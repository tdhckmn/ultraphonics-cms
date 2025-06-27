import { useCallback, useEffect, useState } from "react";

import { deleteApp, FirebaseApp, getApps, initializeApp } from "@firebase/app";

/**
 * @group Firebase
 */
export interface InitialiseFirebaseResult {
    firebaseConfigLoading: boolean;
    firebaseApp?: FirebaseApp;
    configError?: string;
    firebaseConfigError?: Error;
}

const hostingError =
    "It seems like the provided Firebase config is not correct. If you \n" +
    "are using the credentials provided automatically by Firebase \n" +
    "Hosting, make sure you link your Firebase app to Firebase Hosting. \n";

/**
 * Function used to initialise Firebase, either by using the provided config,
 * or by fetching it by Firebase Hosting, if not specified.
 *
 * It works as a hook that gives you the loading state and the used
 * configuration.
 *
 * You most likely only need to use this if you are developing a custom app. You can also not use this component
 * and initialise Firebase yourself.
 *
 * @param onFirebaseInit
 * @param firebaseConfig
 * @param fromUrl
 * @param name
 * @param authDomain
 * @group Firebase
 */
export function useInitialiseFirebase({
    firebaseConfig,
    fromUrl,
    onFirebaseInit,
    name,
    authDomain,
}: {
    firebaseConfig?: Record<string, unknown>;
    fromUrl?: string | undefined;
    onFirebaseInit?: ((config: object, firebaseApp: FirebaseApp) => void) | undefined;
    name?: string;
    authDomain?: string;
}): InitialiseFirebaseResult {
    const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>();
    const [firebaseConfigLoading, setFirebaseConfigLoading] = useState<boolean>(false);
    const [configError, setConfigError] = useState<string>();

    const initFirebase = useCallback(
        (config: Record<string, unknown>) => {
            if (config.projectId === firebaseApp?.options.projectId) {
                console.debug(
                    "Firebase app already initialised with the same project ID. This should happen only in development mode."
                );
                setConfigError(undefined);
                setFirebaseConfigLoading(false);
                return;
            }

            try {
                const targetName = name ?? "[DEFAULT]";
                const currentApps = getApps();
                const existingApp = currentApps.find((app) => app.name === targetName);
                if (existingApp) {
                    deleteApp(existingApp);
                }
                const initialisedFirebaseApp = initializeApp(config, targetName);
                setConfigError(undefined);
                setFirebaseConfigLoading(false);
                setFirebaseApp(initialisedFirebaseApp);
            } catch (e: any) {
                console.error("Error initialising Firebase", e);
                setConfigError(hostingError + "\n" + (e.message ?? JSON.stringify(e)));
            }
        },
        [name]
    );

    useEffect(() => {
        if (onFirebaseInit && firebaseConfig && firebaseApp) {
            onFirebaseInit(firebaseConfig, firebaseApp);
        }
    }, [firebaseApp]);

    useEffect(() => {
        setFirebaseConfigLoading(true);

        function fetchFromUrl(url: string) {
            fetch(url)
                .then(async (response) => {
                    console.debug("Firebase init response", response.status);
                    if (response && response.status < 300) {
                        const config = await response.json();
                        if (authDomain) config.authDomain = authDomain;
                        initFirebase(config);
                    }
                })
                .catch((e) => {
                    setFirebaseConfigLoading(false);
                    setConfigError(
                        "Could not load Firebase configuration from Firebase hosting. " +
                            "If the app is not deployed in Firebase hosting, you need to specify the configuration manually" +
                            e.toString()
                    );
                });
        }

        if (firebaseConfig) {
            initFirebase(firebaseConfig);
        } else {
            if (fromUrl) {
                fetchFromUrl(fromUrl);
            } else if (process.env.NODE_ENV === "production") {
                fetchFromUrl("/__/firebase/init.json");
            } else {
                setFirebaseConfigLoading(false);
                setConfigError(
                    "You need to deploy the app to Firebase hosting or specify a Firebase configuration object"
                );
            }
        }
    }, []);

    return {
        firebaseApp,
        firebaseConfigLoading,
        configError,
    };
}
