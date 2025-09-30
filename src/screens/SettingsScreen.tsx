import React, { useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Alert, ScrollView } from 'react-native';
import { Appbar, List, Switch, Divider } from 'react-native-paper';
import { useSMSListener } from '../hooks/useSMSListener';

const SettingsScreen: React.FC = () => {
  const [isSmsEnabled, setIsSmsEnabled] = useState(false);

  const onNewExpenseAdded = () => {
    console.log("A new expense was added via SMS! Dashboard will refresh on next visit.");
  };

  useSMSListener(isSmsEnabled, onNewExpenseAdded);

  const requestSmsPermission = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ];
      const granted = await PermissionsAndroid.requestMultiple(permissions);

      if (
        granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('SMS Permissions Granted');
        setIsSmsEnabled(true);
      } else {
        console.log('SMS Permissions Denied');
        setIsSmsEnabled(false);
      }
    } catch (err) {
      console.warn(err);
      setIsSmsEnabled(false);
    }
  };

  const handleSmsToggle = (value: boolean) => {
    if (value) {
      requestSmsPermission();
    } else {
      setIsSmsEnabled(false);
    }
  };
  
  const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "Are you sure you want to delete all your data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => console.log("Resetting app..."), style: 'destructive' },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <List.Section>
          <List.Subheader>Automation</List.Subheader>
          <List.Item
            title="Automate via SMS"
            description="Detect expenses from bank alerts"
            left={props => <List.Icon {...props} icon="message-processing-outline" />}
            right={() => <Switch value={isSmsEnabled} onValueChange={handleSmsToggle} />}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title="Manage Budget"
            description="Update your monthly budget amount"
            left={props => <List.Icon {...props} icon="cash-multiple" />}
            onPress={() => console.log("Navigate to Manage Budget screen")}
          />
          <List.Item
            title="Default Currency"
            description="NGN (Nigerian Naira)"
            left={props => <List.Icon {...props} icon="currency-ngn" />}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Data Management</List.Subheader>
          <List.Item
            title="Export to CSV"
            description="Save your transaction history to a file"
            left={props => <List.Icon {...props} icon="file-export-outline" />}
            onPress={() => console.log("Exporting to CSV...")}
          />
          <List.Item
            title="Reset App Data"
            description="Delete all expenses and budget settings"
            left={props => <List.Icon {...props} icon="delete-sweep-outline" />}
            onPress={handleResetApp}
            titleStyle={styles.resetText}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    paddingBottom: 20,
  },
  resetText: {
    color: 'red',
  },
});

export default SettingsScreen;