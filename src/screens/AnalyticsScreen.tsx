import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Appbar, Text, Card, List, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { getCategoryWiseExpense, CategoryWiseExpense } from '../services/sqlite';
import { formatCurrency } from '../utils/formatters';

const screenWidth = Dimensions.get('window').width;

const colors = ["#6200ee", "#03dac4", "#cf6679", "#ffab00", "#3700b3", "#018786"];

const AnalyticsScreen: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryWiseExpense[]>([]);

  const loadAnalyticsData = useCallback(async () => {
    try {
      const data = await getCategoryWiseExpense();
      setCategoryData(data);
    } catch (error) {
      console.error('Failed to load analytics data', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAnalyticsData();
    }, [loadAnalyticsData])
  );

  const chartData = categoryData.map((item, index) => ({
    name: item.category,
    population: item.total,
    color: colors[index % colors.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Spending Analytics" />
      </Appbar.Header>
      <View style={styles.content}>
        {categoryData.length === 0 ? (
          <Text style={styles.noDataText}>No spending data available yet.</Text>
        ) : (
          <Card style={styles.card}>
            <Card.Title title="Spending Breakdown" />
            <Card.Content>
              <PieChart
                data={chartData}
                width={screenWidth - 64} // Adjusted for card padding
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[screenWidth / 8, 0]} // Adjust center for better alignment
                absolute // To show absolute values, not percentages
                hasLegend={false} // We are building our own legend
              />
              <View style={styles.legendWrapper}>
                {chartData.map((item) => (
                  <React.Fragment key={item.name}>
                    <List.Item
                      title={item.name}
                      left={() => (
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                      )}
                      right={() => (
                        <Text style={styles.legendAmount}>{formatCurrency(item.population)}</Text>
                      )}
                    />
                    <Divider />
                  </React.Fragment>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    padding: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  card: {
    // The card itself provides the modern look
  },
  legendWrapper: {
    marginTop: 24,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignSelf: 'center', // Center the dot vertically in the list item
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  }
});

export default AnalyticsScreen;