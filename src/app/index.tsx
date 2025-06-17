import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useFocusEffect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';

import db, { createTable } from '@/services/db';

import Dashboard from './screens/dashboard';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Index() {
  useDrizzleStudio(db);

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    createTable();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setAppIsReady(true);
    }, [])
  );

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <Dashboard onLayout={onLayoutRootView} />;
}
