import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="stringLife">
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.dark.background },
            headerTintColor: Colors.dark.text,
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
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
});
