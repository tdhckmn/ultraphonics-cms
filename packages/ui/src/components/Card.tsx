"use client";
import React, { useCallback } from "react";
import { cardClickableMixin, cardMixin } from "../styles";
import { cls } from "../util";

type CardProps = {
    children: React.ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
    className?: string;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, onClick, style, ...props }, ref) => {
        const onKeyPress = useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                    onClick?.();
                }
            },
            [onClick]
        );

        return (
            <div
                ref={ref}
                onKeyPress={onKeyPress}
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onClick={onClick}
                className={cls(cardMixin, onClick && cardClickableMixin, className)}
                style={style}
                {...props}
            >
                {children}
            </div>
        );
    }
);

export { Card };
