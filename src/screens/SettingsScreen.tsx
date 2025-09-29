import React, { useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Alert, ScrollView } from 'react-native';
import { Appbar, List, Switch, Divider, Text } from 'react-native-paper';

const SettingsScreen: React.FC = () => {
  const [isSmsEnabled, setIsSmsEnabled] = useState(false);

  // --- Permission logic remains the same ---
  const requestReadSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Expense Tracker SMS Permission',
          message: 'Expense Tracker needs access to your SMS messages to automatically detect transactions.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can now read SMS');
        setIsSmsEnabled(true);
      } else {
        console.log('SMS permission denied');
        setIsSmsEnabled(false);
      }
    } catch (err) {
      console.warn(err);
      setIsSmsEnabled(false);
    }
  };

  const handleSmsToggle = (value: boolean) => {
    if (value) {
      requestReadSmsPermission();
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
        {/* --- AUTOMATION GROUP --- */}
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

        {/* --- GENERAL GROUP --- */}
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

        {/* --- DATA GROUP --- */}
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
