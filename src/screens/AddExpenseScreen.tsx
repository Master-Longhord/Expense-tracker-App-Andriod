import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorProps } from '../navigation/types';
import { addExpense } from '../services/sqlite'; 

const CATEGORIES = ['Food', 'Transport', 'Groceries', 'Shopping', 'Bills', 'Entertainment', 'Health'];

const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigatorProps>();
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isFormValid = amount && merchant && selectedCategory;

  const handleSaveExpense = async () => {
    if (!isFormValid) return;

    const expenseData = {
      amount: parseFloat(amount),
      merchant,
      category: selectedCategory,
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      await addExpense(expenseData);
      navigation.goBack(); 
    } catch (error) {
      console.error("Failed to save expense to database", error);
      // Optionally, show an alert to the user here
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Amount (₦)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Merchant / Store"
        value={merchant}
        onChangeText={setMerchant}
        mode="outlined"
        style={styles.input}
      />
      
      <Text style={styles.categoryHeader}>Category</Text>
      <View style={styles.chipContainer}>
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            mode="outlined"
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.chip}
          >
            {category}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Notes (Optional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={3}
      />

      <Button
        mode="contained"
        onPress={handleSaveExpense}
        disabled={!isFormValid}
        style={styles.button}
      >
        Save Expense
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  categoryHeader: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 4,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  button: {
    paddingVertical: 8,
    marginTop: 8,
  },
});

export default AddExpenseScreen;
