import React from "react";

import "typeface-rubik";
import "@fontsource/jetbrains-mono";

import {
    AppBar,
    CircularProgressCenter,
    Drawer,
    FireCMS,
    ModeControllerProvider,
    NavigationRoutes,
    Scaffold,
    SideDialogs,
    SnackbarProvider,
    useBuildLocalConfigurationPersistence,
    useBuildModeController,
    useBuildNavigationController,
    useValidateAuthenticator,
} from "@firecms/core";

import {
    FirebaseAuthController,
    FirebaseLoginView,
    FirebaseSignInProvider,
    useFirebaseAuthController,
    useFirebaseRTDBDelegate,
    useFirebaseStorageSource,
    useInitialiseFirebase,
} from "@firecms/firebase";

import { productsCollection } from "./collections/products_collection";
import { CenteredView } from "@firecms/ui";

const firebaseConfig = {
    apiKey: "AIzaSyCIZxRC_0uy9zU2sQrEo88MigD4Z9ktYzo",
    authDomain: "rtdb-test-eb959.firebaseapp.com",
    databaseURL: "https://rtdb-test-eb959-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rtdb-test-eb959",
    storageBucket: "rtdb-test-eb959.appspot.com",
    messagingSenderId: "380781473867",
    appId: "1:380781473867:web:94e8457d48c642b1655dce",
};

function RTDBApp() {
    const name = "My FireCMS App";

    const { firebaseApp, firebaseConfigLoading, configError } = useInitialiseFirebase({
        firebaseConfig,
    });

    /**
     * Controller used to manage the dark or light color mode
     */
    const modeController = useBuildModeController();

    const signInOptions: FirebaseSignInProvider[] = ["google.com"];

    /**
     * Controller for managing authentication
     */
    const firebaseAuthController: FirebaseAuthController = useFirebaseAuthController({
        firebaseApp,
        signInOptions,
    });

    /**
     * Controller for saving some user preferences locally.
     */
    const userConfigPersistence = useBuildLocalConfigurationPersistence();

    const RTDBDelegate = useFirebaseRTDBDelegate({
        firebaseApp,
    });

    /**
     * Controller used for saving and fetching files in storage
     */
    const storageSource = useFirebaseStorageSource({
        firebaseApp,
    });

    /**
     * Validate authenticator
     */
    const { authLoading, canAccessMainView, notAllowedError } = useValidateAuthenticator({
        authController: firebaseAuthController,
        authenticator: () => true,
        dataSourceDelegate: RTDBDelegate,
        storageSource,
    });

    const navigationController = useBuildNavigationController({
        collections: [productsCollection],
        authController: firebaseAuthController,
        dataSourceDelegate: RTDBDelegate,
    });

    if (firebaseConfigLoading || !firebaseApp) {
        return (
            <>
                <CircularProgressCenter />
            </>
        );
    }

    if (configError) {
        return <CenteredView>{configError}</CenteredView>;
    }

    return (
        <SnackbarProvider>
            <ModeControllerProvider value={modeController}>
                <FireCMS
                    navigationController={navigationController}
                    authController={firebaseAuthController}
                    userConfigPersistence={userConfigPersistence}
                    dataSourceDelegate={RTDBDelegate}
                    storageSource={storageSource}
                >
                    {({ context, loading }) => {
                        let component;
                        if (loading || authLoading) {
                            component = <CircularProgressCenter size={"large"} />;
                        } else {
                            if (!canAccessMainView) {
                                const LoginViewUsed = FirebaseLoginView;
                                component = (
                                    <LoginViewUsed
                                        allowSkipLogin={false}
                                        signInOptions={signInOptions}
                                        firebaseApp={firebaseApp}
                                        authController={firebaseAuthController}
                                        notAllowedError={notAllowedError}
                                    />
                                );
                            } else {
                                component = (
                                    <Scaffold autoOpenDrawer={false}>
                                        <AppBar title={name} />
                                        <Drawer />
                                        <NavigationRoutes />
                                        <SideDialogs />
                                    </Scaffold>
                                );
                            }
                        }

                        return component;
                    }}
                </FireCMS>
            </ModeControllerProvider>
        </SnackbarProvider>
    );
}

export default RTDBApp;
