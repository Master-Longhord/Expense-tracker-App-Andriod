import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/services/sqlite';


const theme = {
  ...MD3LightTheme,
};

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDB()
      .then(() => {
        setDbInitialized(true);
        console.log('Database initialized successfully');
      })
      .catch((err) => {
        console.error('Database initialization failed', err);
      });
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}