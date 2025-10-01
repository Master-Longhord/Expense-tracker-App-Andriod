import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB, getBudget } from './src/services/sqlite';

const theme = {
  ...MD3LightTheme,
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  console.log('Notification permissions granted.');
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Main'>('Onboarding');

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await initDB();
        console.log('Database initialized successfully');
        
        await registerForPushNotificationsAsync();

        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const budget = await getBudget(month);

        if (budget) {
          console.log('Budget found for this month. Skipping Onboarding.');
          setInitialRoute('Main');
        } else {
          console.log('No budget found. Starting with Onboarding.');
          setInitialRoute('Onboarding');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };

    prepareApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AppNavigator initialRouteName={initialRoute} />
    </PaperProvider>
  );
}
