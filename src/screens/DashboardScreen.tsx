import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text as RNText } from 'react-native';
import { Text, Card, ProgressBar, List, Divider, FAB, Appbar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigatorProps } from '../navigation/types';
import { formatCurrency } from '../utils/formatters';
import { getExpenses, getBudget, Expense, Budget } from '../services/sqlite';
import { useSMSListener } from '../hooks/useSMSListener';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigatorProps>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      console.log("Dashboard is refreshing data...");
      
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // Fetch both expenses and budget at the same time
      const [storedExpenses, storedBudget] = await Promise.all([
        getExpenses(), // For now, get all expenses. We can filter this later.
        getBudget(month)
      ]);

      setExpenses(storedExpenses);
      setBudget(storedBudget);
      console.log("Current budget loaded:", storedBudget?.amount);

    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  }, []);

  useSMSListener(true, loadDashboardData); 

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );
  
  const budgetAmount = budget ? budget.amount : 0;
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budgetAmount - totalSpent;
  const budgetProgress = budgetAmount > 0 ? totalSpent / budgetAmount : 0;

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <List.Item
      title={item.merchant}
      description={`${item.category} - ${item.date}`}
      left={props => <List.Icon {...props} icon="wallet-outline" />}
      right={() => <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>
      
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

      <Text variant="headlineSmall" style={styles.listHeader}>
        Recent Expenses
      </Text>

      {expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <RNText>No expenses yet. Tap the + button to add one!</RNText>
        </View>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={item => item.id!.toString()}
          ItemSeparatorComponent={() => <Divider />}
          style={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense' as any)}
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
    marginHorizontal: 16,
    marginTop: 16,
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
    marginTop: 24,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;