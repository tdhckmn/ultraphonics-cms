import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollsMap: Record<string, number> = {};

export function useRestoreScroll() {
    // const scrollsMap = React.useRef<Record<string, number>>({});

    const location = useLocation();

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [scroll, setScroll] = React.useState(0);
    const [direction, setDirection] = React.useState<"up" | "down">("down");

    const handleScroll = useCallback(() => {
        if (!containerRef.current || !location.key) return;
        scrollsMap[location.key] = containerRef.current.scrollTop;
        setScroll(containerRef.current.scrollTop);
        setDirection(containerRef.current.scrollTop > scroll ? "down" : "up");
    }, [containerRef, location.key, scroll]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            if (container) container.removeEventListener("scroll", handleScroll);
        };
    }, [containerRef, handleScroll, location]);

    useEffect(() => {
        if (!containerRef.current || !scrollsMap[location.key]) return;
        containerRef.current.scrollTo({
            top: scrollsMap[location.key],
            behavior: "auto",
        });
    }, [location]);

    return {
        containerRef,
        scroll,
        direction,
    };
}
