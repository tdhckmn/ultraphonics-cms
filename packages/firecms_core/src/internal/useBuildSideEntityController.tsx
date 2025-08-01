import { useCallback, useEffect, useRef } from "react";
import {
    AuthController,
    CustomizationController,
    EntityCollection,
    EntitySidePanelProps,
    NavigationController,
    ResolvedProperty,
    SideDialogPanelProps,
    SideDialogsController,
    SideEntityController,
} from "../types";
import { getNavigationEntriesFromPath, NavigationViewInternal } from "../util/navigation_from_path";
import { useLocation } from "react-router-dom";
import {
    removeInitialAndTrailingSlashes,
    resolveCollection,
    resolveDefaultSelectedView,
    resolvedSelectedEntityView,
} from "../util";
import { ADDITIONAL_TAB_WIDTH, CONTAINER_FULL_WIDTH, FORM_CONTAINER_WIDTH } from "./common";
import { useCustomizationController, useLargeLayout } from "../hooks";
import { EntitySidePanel } from "../core/EntitySidePanel";
import { JSON_TAB_VALUE } from "../core/EntityEditView";

const NEW_URL_HASH = "new_side";
const SIDE_URL_HASH = "side";

export function getEntityViewWidth(
    props: EntitySidePanelProps<any>,
    small: boolean,
    customizationController: CustomizationController,
    authController: AuthController
): string {
    if (small) return CONTAINER_FULL_WIDTH;

    const { selectedSecondaryForm } = resolvedSelectedEntityView(
        props.collection?.entityViews,
        customizationController,
        props.selectedTab
    );

    const shouldUseSmallLayout =
        !props.selectedTab ||
        props.selectedTab === JSON_TAB_VALUE ||
        props.selectedTab === "__history" ||
        Boolean(selectedSecondaryForm);

    let resolvedWidth: string | undefined;
    if (props.width) {
        resolvedWidth = typeof props.width === "number" ? `${props.width}px` : props.width;
    } else if (props.collection?.sideDialogWidth) {
        resolvedWidth =
            typeof props.collection.sideDialogWidth === "number"
                ? `${props.collection.sideDialogWidth}px`
                : props.collection.sideDialogWidth;
    }

    if (!shouldUseSmallLayout) {
        return `calc(${ADDITIONAL_TAB_WIDTH} + ${resolvedWidth ?? FORM_CONTAINER_WIDTH})`;
    } else {
        if (resolvedWidth) {
            return resolvedWidth;
        } else if (!props.collection) {
            return FORM_CONTAINER_WIDTH;
        } else {
            return calculateCollectionDesiredWidth(props.collection, authController);
        }
    }
}

const collectionViewWidthCache: { [key: string]: string } = {};

function calculateCollectionDesiredWidth(
    collection: EntityCollection<any>,
    authController: AuthController
): string {
    if (collectionViewWidthCache[collection.id]) {
        return collectionViewWidthCache[collection.id];
    }
    const resolvedCollection = resolveCollection({
        collection,
        path: "__ignored",
        ignoreMissingFields: true,
        authController,
    });

    let result = FORM_CONTAINER_WIDTH;
    if (resolvedCollection?.properties) {
        const values = Object.values(resolvedCollection.properties).map((p: ResolvedProperty) =>
            getNestedPropertiesDepth(p)
        );
        const maxDepth = Math.max(...values);
        if (maxDepth < 3) {
            result = FORM_CONTAINER_WIDTH;
        } else {
            result = 768 + 32 * (maxDepth - 2) + "px";
        }
    }
    collectionViewWidthCache[collection.id] = result;
    return result;
}

function getNestedPropertiesDepth(property: ResolvedProperty, accumulator: number = 0): number {
    if (property.dataType === "map" && property.properties) {
        const values = Object.values(property.properties).flatMap((property) =>
            getNestedPropertiesDepth(property, accumulator + 1)
        );
        return Math.max(...values);
    } else if (property.dataType === "array" && property.oneOf) {
        return accumulator + 3;
    } else if (property.dataType === "array" && property.of) {
        if (Array.isArray(property.of)) {
            return Math.max(
                ...property.of.map((p) => getNestedPropertiesDepth(p, accumulator + 1))
            );
        } else {
            return getNestedPropertiesDepth(property.of, accumulator + 1);
        }
    } else {
        return accumulator + 1;
    }
}

export const useBuildSideEntityController = (
    navigation: NavigationController,
    sideDialogsController: SideDialogsController,
    authController: AuthController
): SideEntityController => {
    const location = useLocation();
    const initialised = useRef<boolean>(false);
    const customizationController = useCustomizationController();

    const smallLayout = !useLargeLayout();

    useEffect(() => {
        const newFlag = location.hash === `#${NEW_URL_HASH}`;
        const sideFlag = location.hash === `#${SIDE_URL_HASH}`;

        if (!navigation.loading) {
            if ((newFlag || sideFlag) && navigation.isUrlCollectionPath(location.pathname)) {
                const entityOrCollectionPath = navigation.urlPathToDataPath(location.pathname);
                const panelsFromUrl = buildSidePanelsFromUrl(
                    entityOrCollectionPath,
                    navigation.collections ?? [],
                    newFlag
                );
                for (let i = 0; i < panelsFromUrl.length; i++) {
                    const props = panelsFromUrl[i];
                    if (i === 0)
                        sideDialogsController.replace(
                            propsToSidePanel(
                                props,
                                navigation.buildUrlCollectionPath,
                                navigation.resolveIdsFrom,
                                smallLayout,
                                customizationController,
                                authController
                            )
                        );
                    else
                        sideDialogsController.open(
                            propsToSidePanel(
                                props,
                                navigation.buildUrlCollectionPath,
                                navigation.resolveIdsFrom,
                                smallLayout,
                                customizationController,
                                authController
                            )
                        );
                }
            }
            initialised.current = true;
        }
    }, [navigation.loading]);

    // sync panels if URL changes with #side
    const currentPanelKeys = sideDialogsController.sidePanels.map((p) => p.key);
    useEffect(() => {
        if (initialised.current) {
            const sideFlag = location.hash === `#${SIDE_URL_HASH}`;
            if (sideFlag) {
                const entityOrCollectionPath = navigation.urlPathToDataPath(location.pathname);
                const panelsFromUrl = buildSidePanelsFromUrl(
                    entityOrCollectionPath,
                    navigation.collections ?? [],
                    false
                );
                // if we have more panels than determined by the url, we ignore the url. We might have references open
                if (panelsFromUrl.length <= currentPanelKeys.length) {
                    return;
                }
                const lastPanel = panelsFromUrl[panelsFromUrl.length - 1];
                const panelProps = propsToSidePanel(
                    lastPanel,
                    navigation.buildUrlCollectionPath,
                    navigation.resolveIdsFrom,
                    smallLayout,
                    customizationController,
                    authController
                );
                const lastCurrentPanel =
                    currentPanelKeys.length > 0
                        ? currentPanelKeys[currentPanelKeys.length - 1]
                        : undefined;
                if (!lastCurrentPanel || lastCurrentPanel !== panelProps.key) {
                    sideDialogsController.replace(panelProps);
                }
            }
        }
    }, [location.pathname, location.hash, currentPanelKeys]);

    // update side panels to match browser size
    useEffect(() => {
        const updatedSidePanels = sideDialogsController.sidePanels.map((sidePanelProps) => {
            if (sidePanelProps.additional) {
                return propsToSidePanel(
                    sidePanelProps.additional,
                    navigation.buildUrlCollectionPath,
                    navigation.resolveIdsFrom,
                    smallLayout,
                    customizationController,
                    authController
                );
            }
            return sidePanelProps;
        });
        sideDialogsController.setSidePanels(updatedSidePanels);
    }, [smallLayout]);

    const close = useCallback(() => {
        sideDialogsController.close();
    }, [sideDialogsController]);

    const open = useCallback(
        (props: EntitySidePanelProps<any>) => {
            if (props.copy && !props.entityId) {
                throw Error("If you want to copy an entity you need to provide an entityId");
            }

            const defaultSelectedView = resolveDefaultSelectedView(
                props.collection ? props.collection.defaultSelectedView : undefined,
                {
                    status: props.copy ? "copy" : props.entityId ? "existing" : "new",
                    entityId: props.entityId,
                }
            );

            sideDialogsController.open(
                propsToSidePanel(
                    {
                        selectedTab: defaultSelectedView,
                        ...props,
                    },
                    navigation.buildUrlCollectionPath,
                    navigation.resolveIdsFrom,
                    smallLayout,
                    customizationController,
                    authController
                )
            );
        },
        [
            sideDialogsController,
            navigation.buildUrlCollectionPath,
            navigation.resolveIdsFrom,
            smallLayout,
            authController.user,
        ]
    );

    const replace = useCallback(
        (props: EntitySidePanelProps<any>) => {
            if (props.copy && !props.entityId) {
                throw Error("If you want to copy an entity you need to provide an entityId");
            }

            sideDialogsController.replace(
                propsToSidePanel(
                    props,
                    navigation.buildUrlCollectionPath,
                    navigation.resolveIdsFrom,
                    smallLayout,
                    customizationController,
                    authController
                )
            );
        },
        [
            navigation.buildUrlCollectionPath,
            navigation.resolveIdsFrom,
            sideDialogsController,
            smallLayout,
            authController.user,
        ]
    );

    return {
        close,
        open,
        replace,
    };
};

export function buildSidePanelsFromUrl(
    path: string,
    collections: EntityCollection[],
    newFlag: boolean
): EntitySidePanelProps<any>[] {
    const navigationViewsForPath: NavigationViewInternal<any>[] = getNavigationEntriesFromPath({
        path,
        collections,
    });

    let sidePanel: EntitySidePanelProps<any> | undefined = undefined;
    let lastCollectionPath = "";
    let lastCollectionId: string | undefined = undefined;
    for (let i = 0; i < navigationViewsForPath.length; i++) {
        const navigationEntry = navigationViewsForPath[i];

        if (navigationEntry.type === "collection") {
            lastCollectionPath = navigationEntry.path;
            lastCollectionId = navigationEntry.collection.id;
        }

        const previousEntry = navigationViewsForPath[i - 1];
        if (navigationEntry.type === "entity") {
            sidePanel = {
                path: navigationEntry.path,
                fullIdPath: navigationEntry.fullIdPath,
                entityId: navigationEntry.entityId,
                copy: false,
                width: navigationEntry.parentCollection?.sideDialogWidth,
            };
        } else if (navigationEntry.type === "custom_view") {
            if (previousEntry?.type === "entity") {
                if (sidePanel) sidePanel.selectedTab = navigationEntry.view.key;
            }
        } else if (navigationEntry.type === "collection") {
            if (previousEntry?.type === "entity") {
                if (sidePanel)
                    sidePanel.selectedTab =
                        navigationEntry.collection.id ?? navigationEntry.collection.path;
            }
        }
    }

    if (newFlag) {
        sidePanel = {
            path: lastCollectionPath,
            fullIdPath: lastCollectionId,
            copy: false,
        };
    }

    return sidePanel ? [sidePanel] : [];
}

const propsToSidePanel = (
    props: EntitySidePanelProps,
    buildUrlCollectionPath: (path: string) => string,
    resolveIdsFrom: (pathWithAliases: string) => string,
    smallLayout: boolean,
    customizationController: CustomizationController,
    authController: AuthController
): SideDialogPanelProps => {
    const collectionPath = removeInitialAndTrailingSlashes(props.path);

    const urlPath = props.entityId
        ? buildUrlCollectionPath(
              `${collectionPath}/${props.entityId}${props.selectedTab ? "/" + props.selectedTab : ""}#${SIDE_URL_HASH}`
          )
        : buildUrlCollectionPath(`${collectionPath}#${NEW_URL_HASH}`);

    const resolvedPanelProps: EntitySidePanelProps<any> = {
        ...props,
        formProps: props.formProps,
    };

    const entityViewWidth = getEntityViewWidth(
        props,
        smallLayout,
        customizationController,
        authController
    );
    return {
        key: `${props.path}/${props.entityId}`,
        component: <EntitySidePanel {...resolvedPanelProps} />,
        urlPath: urlPath,
        parentUrlPath: buildUrlCollectionPath(collectionPath),
        width: entityViewWidth,
        onClose: props.onClose,
        additional: props,
    };
};

function isSideUrl(url: string): boolean {
    return url.endsWith("#" + SIDE_URL_HASH) || url.endsWith("#" + NEW_URL_HASH);
}
