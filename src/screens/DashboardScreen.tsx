import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ProgressBar, List, FAB, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { formatCurrency } from '../utils/formatters'; // <-- IMPORT OUR NEW FUNCTION

// --- MOCK DATA ---
const MOCK_BUDGET = 500000.0;
const MOCK_EXPENSES = [
  { id: '1', merchant: 'Shoprite', category: 'Groceries', amount: 12550.0, date: '2025-09-22' },
  { id: '2', merchant: 'TotalEnergies', category: 'Transport', amount: 15000.0, date: '2025-09-21' },
  { id: '3', merchant: 'Jumia', category: 'Shopping', amount: 35200.5, date: '2025-09-20' },
  { id: '4', merchant: 'MTN', category: 'Bills', amount: 5000.0, date: '2025-09-19' },
  { id: '5', merchant: 'The Place Restaurant', category: 'Food', amount: 7500.0, date: '2025-09-18' },
];


type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const totalSpent = MOCK_EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = MOCK_BUDGET - totalSpent;
  const budgetProgress = MOCK_BUDGET > 0 ? totalSpent / MOCK_BUDGET : 0;

  const renderExpenseItem = ({ item }: { item: typeof MOCK_EXPENSES[0] }) => (
    <List.Item
      title={item.merchant}
      description={`${item.category} - ${item.date}`}
      left={props => <List.Icon {...props} icon="wallet-outline" />}
      right={() => <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>}
    />
  );

  return (
    <View style={styles.container}>
      {/* --- Budget Summary Card --- */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge">Budget Summary</Text>
          <ProgressBar progress={budgetProgress} style={styles.progressBar} />
          <View style={styles.summaryTextContainer}>
            <Text variant="bodyMedium">Spent: {formatCurrency(totalSpent)}</Text>
            <Text variant="bodyMedium">Remaining: {formatCurrency(remainingBudget)}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* --- Recent Expenses List --- */}
      <Text variant="headlineSmall" style={styles.listHeader}>
        Recent Expenses
      </Text>
      <FlatList
        data={MOCK_EXPENSES}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider />}
        style={styles.list}
      />

      {/* --- Floating Action Button --- */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
  },
  progressBar: {
    marginTop: 16,
    height: 8,
    borderRadius: 4,
  },
  summaryTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  listHeader: {
    marginLeft: 16,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;
