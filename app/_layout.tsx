import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';
import { enGB, registerTranslation, ru } from 'react-native-paper-dates';

registerTranslation('en-GB', enGB);
registerTranslation('ru', ru);

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <SQLiteProvider databaseName="stringLife">
      <PaperProvider>
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
      </PaperProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
