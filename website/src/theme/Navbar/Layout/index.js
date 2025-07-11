import React from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useHideableNavbar, useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";
import styles from "./styles.module.css";
import { defaultBorderMixin } from "../../../partials/styles";

function NavbarBackdrop(props) {
    return (
        <div
            role="presentation"
            {...props}
            className={clsx("navbar-sidebar__backdrop", props.className)}
        />
    );
}

export default function NavbarLayout({ children }) {
    const {
        navbar: { hideOnScroll, style },
    } = useThemeConfig();
    const mobileSidebar = useNavbarMobileSidebar();
    const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);
    return (
        <nav
            ref={navbarRef}
            aria-label={translate({
                id: "theme.NavBar.navAriaLabel",
                message: "Main",
                description: "The ARIA label for the main navigation",
            })}
            className={clsx(
                "navbar",
                "navbar--fixed-top",
                hideOnScroll && [styles.navbarHideable, !isNavbarVisible && styles.navbarHidden],
                {
                    "navbar--dark": style === "dark",
                    "navbar--primary": style === "primary",
                    "navbar-sidebar--show": mobileSidebar.shown,
                },
                "h-20 flex justify-center items-center",
                "border-y border-x-0 border-solid",
                defaultBorderMixin
            )}
        >
            <div
                className={clsx(
                    "w-[84rem] h-20 max-w-full flex justify-center items-center flex-col mx-auto border-x border-y-0 border-solid",
                    defaultBorderMixin
                )}
            >
                {children}
                <NavbarBackdrop onClick={mobileSidebar.toggle} />
                <NavbarMobileSidebar />
            </div>
        </nav>
    );
}
