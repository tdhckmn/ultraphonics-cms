import React, { useCallback } from 'react';
import 'typeface-rubik';
import '@fontsource/comic-neue';
import '@fontsource/noto-serif';
import '@fontsource/jetbrains-mono';

import {
  CircularProgressCenter,
  FireCMS,
  ModeControllerProvider,
  SnackbarProvider,
  Scaffold,
  AppBar,
  Drawer,
  NavigationRoutes,
  SideDialogs,
  useBuildModeController,
  useBuildLocalConfigurationPersistence,
  useBuildNavigationController,
} from '@firecms/core';

import {
  useFirestoreDelegate,
  useFirebaseAuthController,
  useFirebaseStorageSource,
  useInitialiseFirebase,
} from '@firecms/firebase';

import { firebaseConfig } from '../firebase_config';
import { showsCollection } from './collections/shows_collection';

export function App() {
  const modeController = useBuildModeController();
  const userConfigPersistence = useBuildLocalConfigurationPersistence();

  const { firebaseApp, firebaseConfigLoading, configError } = useInitialiseFirebase({
    firebaseConfig,
  });

  const firestoreDelegate = useFirestoreDelegate({ firebaseApp });
  const storageSource = useFirebaseStorageSource({ firebaseApp });
  const authController = useFirebaseAuthController({
    firebaseApp,
    signInOptions: ['google.com'],
  });

  const collections = useCallback(() => [showsCollection], []);

  const navigationController = useBuildNavigationController({
    collections,
    authController,
    dataSourceDelegate: firestoreDelegate,
    plugins: [],
  });

  if (firebaseConfigLoading || !firebaseApp) {
    return <CircularProgressCenter />;
  }

  if (configError) {
    return <div>{configError}</div>;
  }

  return (
    <SnackbarProvider>
      <ModeControllerProvider value={modeController}>
        <FireCMS
          navigationController={navigationController}
          authController={authController}
          entityLinkBuilder={({ entity }) =>
            `https://console.firebase.google.com/project/${firebaseApp.options.projectId}/firestore/data/${entity.path}/${entity.id}`
          }
          userConfigPersistence={userConfigPersistence}
          dataSourceDelegate={firestoreDelegate}
          storageSource={storageSource}
        >
          {({ context, loading }) => {
            if (loading) return <CircularProgressCenter />;
            return (
              <Scaffold>
                <AppBar title="Ultraphonics CMS" />
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
