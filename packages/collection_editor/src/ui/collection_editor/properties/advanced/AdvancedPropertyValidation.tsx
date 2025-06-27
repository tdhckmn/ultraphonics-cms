import React from "react";

import { Field, FormexFieldProps } from "@firecms/formex";
import { SwitchControl } from "../../SwitchControl";

export function AdvancedPropertyValidation({ disabled }: { disabled: boolean }) {
    const columnWidth = "columnWidth";
    const hideFromCollection = "hideFromCollection";
    const readOnly = "readOnly";

    return (
        <div className={"grid grid-cols-12 gap-2"}>
            <div className={"col-span-12"}>
                <Field type="checkbox" name={hideFromCollection}>
                    {({ field, form }: FormexFieldProps) => {
                        return (
                            <SwitchControl
                                label={"Hide from collection"}
                                size={"medium"}
                                disabled={disabled}
                                form={form}
                                tooltip={
                                    "Hide this field from the collection view. It will still be visible in the form view"
                                }
                                field={field}
                            />
                        );
                    }}
                </Field>
            </div>

            <div className={"col-span-12"}>
                <Field name={readOnly} type="checkbox">
                    {({ field, form }: FormexFieldProps) => {
                        return (
                            <SwitchControl
                                label={"Read only"}
                                size={"medium"}
                                disabled={disabled}
                                tooltip={"Is this a read only field. Display only as a preview"}
                                form={form}
                                field={field}
                            />
                        );
                    }}
                </Field>
            </div>
        </div>
    );
}
