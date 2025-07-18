import * as React from "react";
import { useEffect, useState } from "react";
import { Skeleton } from "@firecms/ui";

export interface AsyncPreviewComponentProps {
    builder: Promise<React.ReactNode>;
}

/**
 * Utility component used to render the result of an async execution.
 * It shows a loading indicator while at it.
 *
 * @group Preview components
 */
export const AsyncPreviewComponent = React.memo(function AsyncPreviewComponentInternal<
    M extends Record<string, any>,
>({ builder }: AsyncPreviewComponentProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [result, setResult] = useState<React.ReactNode>(null);

    useEffect(() => {
        let unmounted = false;
        builder
            .then((res) => {
                if (!unmounted) {
                    setLoading(false);
                    setResult(res);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
        return () => {
            unmounted = true;
        };
    }, [builder]);

    if (loading) return <Skeleton />;

    return <React.Fragment>{result}</React.Fragment>;
});
