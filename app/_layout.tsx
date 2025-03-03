import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { customTheme } from './theme';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="stringLife">
      <PaperProvider theme={customTheme}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: customTheme.colors.background },
              headerTintColor: customTheme.colors.text,
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
                headerTransparent: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTitle: '',
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
      </PaperProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
