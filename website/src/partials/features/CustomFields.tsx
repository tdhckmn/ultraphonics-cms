import React from "react";
import { Panel } from "../general/Panel";

export function CustomFields() {
    return (
        <Panel color={"dark_gray"} includePadding={true}>
            <h3 className={"mb-3 font-mono"}>Create your custom fields</h3>
            <p className="text-xl md:text-2xl">
                FireCMS provides around <b>20 default fields</b> which should suffice for most
                business logic. These fields range from simple text fields or selects to more
                complex ones like file uploaders, date pickers, or reference fields. There are also
                hundreds of validation options available, as well as the ability to create custom
                validators.
            </p>
            <p className="text-xl md:text-2xl">
                However, sometimes you may need more complex editing forms and specific fields that
                the default ones don't cover. In these cases, you can create your own custom fields
                and use them in your entity collection.
            </p>
        </Panel>
    );
}
