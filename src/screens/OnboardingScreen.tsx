import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [budget, setBudget] = React.useState('');

  const handleSetBudget = () => {
    navigation.replace('Main');
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
          label="Budget Amount"
          value={budget}
          onChangeText={text => setBudget(text)}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSetBudget}
          disabled={!budget}
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
