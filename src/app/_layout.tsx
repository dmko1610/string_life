import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import { en, registerTranslation, ru } from 'react-native-paper-dates';

import { I18nProvider } from '@/context/I18nContext';
import { darkTheme, lightTheme } from '@/theme';

registerTranslation('en', en);
registerTranslation('ru', ru);

export default function RootLayout() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <SQLiteProvider databaseName="stringLife">
      <PaperProvider theme={theme}>
        <I18nProvider>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerShown: false,
              }}
            />
          </View>
        </I18nProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
