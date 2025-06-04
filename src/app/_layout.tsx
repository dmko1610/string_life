import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import { en, registerTranslation, ru } from 'react-native-paper-dates';

import { I18nProvider } from '@/context/I18nContext';

registerTranslation('en', en);
registerTranslation('ru', ru);

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <SQLiteProvider databaseName="stringLife">
      <PaperProvider>
        <I18nProvider>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="add-instrument"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="instrument"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </View>
        </I18nProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
