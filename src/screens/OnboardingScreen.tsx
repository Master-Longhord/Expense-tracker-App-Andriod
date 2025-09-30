import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { addOrUpdateBudget } from '../services/sqlite';

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [budgetAmount, setBudgetAmount] = React.useState('');

  const handleSetBudget = async () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      // Basic validation
      return;
    }

    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // Format to YYYY-MM
      
      await addOrUpdateBudget({ month, amount });
      
      navigation.replace('Main');
    } catch (error) {
      console.error("Failed to save budget", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Set Your Monthly Budget
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          You can change this later in the settings.
        </Text>
        <TextInput
          label="Budget Amount (₦)"
          value={budgetAmount}
          onChangeText={text => setBudgetAmount(text)}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSetBudget}
          disabled={!budgetAmount}
          style={styles.button}
        >
          Get Started
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;