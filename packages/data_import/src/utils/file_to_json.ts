import * as XLSX from "xlsx";
import { getXLSXHeaders } from "./file_headers";

type ConversionResult = {
    data: object[];
    propertiesOrder: string[];
};

export function convertFileToJson(file: File): Promise<ConversionResult> {
    return new Promise((resolve, reject) => {
        if (file.type === "application/json") {
            console.debug("Converting JSON file to JSON", file.name);
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = e.target?.result as string;
                    const jsonData = JSON.parse(data);
                    if (!Array.isArray(jsonData)) {
                        reject(new Error("JSON file should contain an array of objects"));
                    } else {
                        // Assuming all objects in the array have the same structure/order
                        const propertiesOrder = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
                        resolve({
                            data: jsonData,
                            propertiesOrder,
                        });
                    }
                } catch (e) {
                    console.error("Error parsing JSON file", e);
                    reject(e);
                }
            };
            reader.readAsText(file);
        } else {
            console.debug("Converting Excel file to JSON", file.name);
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, {
                    type: "array",
                    codepage: 65001,
                    cellDates: true,
                });
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const parsedData: Array<any> = XLSX.utils.sheet_to_json(worksheet);
                const headers = getXLSXHeaders(worksheet);
                const cleanedData = parsedData.map(mapJsonParse);
                const jsonData = cleanedData.map(unflattenObject);
                resolve({
                    data: jsonData,
                    propertiesOrder: headers,
                });
            };
            reader.readAsArrayBuffer(file);
        }
    });
}

function mapJsonParse(obj: Record<string, any>) {
    return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
        try {
            acc[key] = JSON.parse(obj[key]);
        } catch (e) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

/**
 * Take an object with keys of type `address.street`, `address.city` and
 * convert it to an object with nested objects like `{ address: { street: ..., city: ... } }`
 * @param flatObj
 */
export function unflattenObject(flatObj: { [key: string]: any }) {
    return Object.keys(flatObj).reduce(
        (nestedObj, key) => {
            let currentObj = nestedObj;
            const keyParts = key.split(".");
            keyParts.forEach((keyPart, i) => {
                if (/^[\w]+\[\d+\]$/.test(keyPart)) {
                    const mainPropertyName = keyPart.slice(0, keyPart.indexOf("["));
                    const index = parseInt(keyPart.slice(keyPart.indexOf("[") + 1, keyPart.indexOf("]")));

                    if (!currentObj[mainPropertyName]) {
                        currentObj[mainPropertyName] = [];
                    }

                    if (i !== keyParts.length - 1) {
                        currentObj[mainPropertyName][index] = currentObj[mainPropertyName][index] || {};
                        currentObj = currentObj[mainPropertyName][index];
                    } else {
                        currentObj[mainPropertyName][index] = flatObj[key];
                    }
                } else if (i !== keyParts.length - 1) {
                    currentObj[keyPart] = currentObj[keyPart] || {};
                    currentObj = currentObj[keyPart];
                } else {
                    currentObj[keyPart] = flatObj[key];
                }
            });
            return nestedObj;
        },
        {} as { [key: string]: any },
    );
}
