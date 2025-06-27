import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "../../../util";
import { cls, focusedDisabled } from "@firecms/ui";

export function VirtualTableNumberInput(props: {
    error: Error | undefined;
    value: number;
    align: "right" | "left" | "center";
    updateValue: (newValue: number | null) => void;
    focused: boolean;
    disabled: boolean;
}) {
    const { align, value, updateValue, focused } = props;
    const propStringValue = value && typeof value === "number" ? value.toString() : "";
    const [internalValue, setInternalValue] = useState<string | null>(propStringValue);

    const prevValue = useRef<number | null>(value);

    useEffect(() => {
        if (prevValue.current !== value && String(value) !== internalValue)
            setInternalValue(value ? value.toString() : null);
        prevValue.current = value;
    }, [value]);

    const doUpdate = React.useCallback(() => {
        if (internalValue !== propStringValue) {
            if (internalValue !== undefined && internalValue !== null) {
                const numberValue = parseFloat(internalValue);
                if (isNaN(numberValue)) return;
                if (numberValue !== undefined && numberValue !== null) updateValue(numberValue);
            } else {
                updateValue(null);
            }
        }
    }, [internalValue, value]);

    useDebouncedCallback(internalValue, doUpdate, !focused, 2000);

    useEffect(() => {
        if (!focused && propStringValue !== internalValue)
            setInternalValue(value !== undefined && value !== null ? value.toString() : null);
    }, [value, focused]);

    const ref = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current && focused) {
            ref.current.focus({ preventScroll: true });
        }
    }, [focused, ref]);

    const regexp = /^-?[0-9]+[,.]?[0-9]*$/;

    return (
        <input
            ref={ref}
            className={cls(
                "w-full text-right p-0 m-0 bg-transparent border-none resize-none outline-none font-normal leading-normal text-unset",
                focusedDisabled
            )}
            style={{
                textAlign: align,
            }}
            value={internalValue ?? ""}
            onChange={(evt) => {
                const newValue = evt.target.value.replace(",", ".");
                if (newValue.length === 0) setInternalValue(null);
                if (regexp.test(newValue) || newValue.startsWith("-")) setInternalValue(newValue);
            }}
        />
    );
}
