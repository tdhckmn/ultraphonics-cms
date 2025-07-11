import React from "react";

import { EnumValueConfig } from "../../types";
import { EnumValuesChip } from "./EnumValuesChip";
import { PreviewSize } from "../PropertyPreviewProps";
import { ErrorBoundary } from "../../components";

/**
 * @group Preview components
 */
export function ArrayEnumPreview({
    name,
    value,
    enumValues,
    size,
}: {
    value: string[] | number[];
    name: string | undefined;
    enumValues: EnumValueConfig[];
    size: PreviewSize;
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {value &&
                value.map((enumKey, index) => {
                    return (
                        <ErrorBoundary key={`preview_array_ref_${name}_${index}`}>
                            <EnumValuesChip
                                enumKey={enumKey}
                                enumValues={enumValues}
                                size={size !== "medium" ? "small" : "medium"}
                            />
                        </ErrorBoundary>
                    );
                })}
        </div>
    );
}
