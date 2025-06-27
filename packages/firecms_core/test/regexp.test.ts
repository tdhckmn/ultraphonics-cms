import { expect, it } from "@jest/globals";
import { isValidRegExp, serializeRegExp } from "../src";

it("Serialize", () => {
    expect(serializeRegExp(/\d.*/)).toEqual("/\\d.*/");
    expect(serializeRegExp(/\d.*/g)).toEqual("/\\d.*/g");
});

it("Validate", () => {
    // expect(isValidRegExp("\\d.*")).toEqual(false);
    expect(isValidRegExp("/\\d.*/g")).toEqual(true);
});
