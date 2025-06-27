import React, { useCallback } from "react";

import "typeface-rubik";
import "@fontsource/jetbrains-mono";

import {
    AppBar,
    Authenticator,
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
    FirebaseUserWrapper,
    useFirebaseAuthController,
    useFirebaseStorageSource,
    useFirestoreDelegate,
    useInitialiseFirebase,
} from "@firecms/firebase";
import { useDataEnhancementPlugin } from "@firecms/data_enhancement";
import { useImportPlugin } from "@firecms/data_import";
import { useExportPlugin } from "@firecms/data_export";
import {
    useBuildUserManagement,
    userManagementAdminViews,
    useUserManagementPlugin,
} from "@firecms/user_management";
import { booksCollection } from "./books_collection";
import { useFirestoreCollectionsConfigController } from "@firecms/collection_editor_firebase";
import { mergeCollections, useCollectionEditorPlugin } from "@firecms/collection_editor";

export const firebaseConfig = {
    apiKey: "AIzaSyBzt-JvcXvpDrdNU7jYX3fC3v0EAHjTKEw",
    authDomain: "demo.firecms.co",
    databaseURL: "https://firecms-demo-27150.firebaseio.com",
    projectId: "firecms-demo-27150",
    storageBucket: "firecms-demo-27150.appspot.com",
    messagingSenderId: "837544933711",
    appId: "1:837544933711:web:75822ffc0840e3ae01ad3a",
    measurementId: "G-8HRE8MVXZJ",
};

function ProSample() {
    // Use your own authentication logic here
    const myAuthenticator: Authenticator<FirebaseUserWrapper> = useCallback(
        async ({ user, authController }) => {
            if (user?.email?.includes("flanders")) {
                throw Error("Stupid Flanders!");
            }

            // This is an example of retrieving async data related to the user
            // and storing it in the controller's extra field
            const idTokenResult = await user?.firebaseUser?.getIdTokenResult();
            const userIsAdmin = idTokenResult?.claims.admin || user?.email?.endsWith("@firecms.co");

            console.log("Allowing access to", user);
            return Boolean(userIsAdmin);
        },
        []
    );

    const { firebaseApp, firebaseConfigLoading, configError } = useInitialiseFirebase({
        firebaseConfig,
    });

    // Controller used to manage the dark or light color mode
    const modeController = useBuildModeController();

    const signInOptions: FirebaseSignInProvider[] = ["google.com"];

    // Controller for saving some user preferences locally.
    const userConfigPersistence = useBuildLocalConfigurationPersistence();

    // Delegate used for fetching and saving data in Firestore
    const firestoreDelegate = useFirestoreDelegate({
        firebaseApp,
    });

    // Controller used for saving and fetching files in storage
    const storageSource = useFirebaseStorageSource({
        firebaseApp,
    });

    const collectionConfigController = useFirestoreCollectionsConfigController({
        firebaseApp,
    });

    // Controller for managing authentication
    const firebaseAuthController: FirebaseAuthController = useFirebaseAuthController({
        firebaseApp,
        signInOptions,
    });

    // controller in charge of user management
    const userManagement = useBuildUserManagement({
        dataSourceDelegate: firestoreDelegate,
        authController: firebaseAuthController,
    });

    const authController = userManagement;

    const { authLoading, canAccessMainView, notAllowedError } = useValidateAuthenticator({
        disabled: userManagement.loading,
        authenticator: userManagement.authenticator,
        authController,
        // authenticator: myAuthenticator,
        dataSourceDelegate: firestoreDelegate,
        storageSource,
    });

    const collectionsBuilder = useCallback(() => {
        const collections = [
            booksCollection,
            // Your collections here
        ];
        return mergeCollections(collections, collectionConfigController.collections ?? []);
    }, [collectionConfigController.collections]);

    const navigationController = useBuildNavigationController({
        collections: collectionsBuilder,
        collectionPermissions: userManagement.collectionPermissions,
        adminViews: userManagementAdminViews,
        authController,
        dataSourceDelegate: firestoreDelegate,
    });

    const dataEnhancementPlugin = useDataEnhancementPlugin({
        getConfigForPath: ({ path }) => {
            if (path === "books") return true;
            return false;
        },
    });

    const userManagementPlugin = useUserManagementPlugin({ userManagement });

    const importPlugin = useImportPlugin();
    const exportPlugin = useExportPlugin();

    const collectionEditorPlugin = useCollectionEditorPlugin({
        collectionConfigController,
    });

    if (firebaseConfigLoading || !firebaseApp) {
        return <CircularProgressCenter />;
    }

    if (configError) {
        return <>{configError}</>;
    }
    return (
        <SnackbarProvider>
            <ModeControllerProvider value={modeController}>
                <FireCMS
                    navigationController={navigationController}
                    authController={authController}
                    userConfigPersistence={userConfigPersistence}
                    dataSourceDelegate={firestoreDelegate}
                    storageSource={storageSource}
                    plugins={[
                        dataEnhancementPlugin,
                        importPlugin,
                        exportPlugin,
                        userManagementPlugin,
                        collectionEditorPlugin,
                    ]}
                >
                    {({ context, loading }) => {
                        if (loading || authLoading) {
                            return <CircularProgressCenter size={"large"} />;
                        }
                        if (!canAccessMainView) {
                            return (
                                <FirebaseLoginView
                                    authController={authController}
                                    firebaseApp={firebaseApp}
                                    signInOptions={signInOptions}
                                    notAllowedError={notAllowedError}
                                />
                            );
                        }

                        return (
                            <Scaffold autoOpenDrawer={false}>
                                <AppBar title={"My demo app"} />
                                <Drawer />
                                <NavigationRoutes />
                                <SideDialogs />
                            </Scaffold>
                        );
                    }}
                </FireCMS>
            </ModeControllerProvider>
        </SnackbarProvider>
    );
}

export default ProSample;
