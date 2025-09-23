import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, Card, List, Divider, SegmentedButtons } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getCategoryWiseExpense, CategoryWiseExpense } from '../services/sqlite';
import { formatCurrency } from '../utils/formatters';

const screenWidth = Dimensions.get('window').width;

const colors = ["#6200ee", "#03dac4", "#cf6679", "#ffab00", "#3700b3", "#018786"];

const AnalyticsScreen: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryWiseExpense[]>([]);
  const [filter, setFilter] = useState('month'); // 'week', 'month', 'all'

  const getStartDate = (period: string) => {
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return weekAgo.toISOString().split('T')[0];
    }
    if (period === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return monthAgo.toISOString().split('T')[0];
    }
    return undefined; // 'all' time
  };

  const loadAnalyticsData = useCallback(async () => {
    try {
      const startDate = getStartDate(filter);
      const data = await getCategoryWiseExpense(startDate);
      setCategoryData(data);
    } catch (error) {
      console.error('Failed to load analytics data', error);
    }
  }, [filter]); // Re-run this function when the filter changes

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

      <ScrollView contentContainerStyle={styles.content}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'all', label: 'All Time' },
          ]}
          style={styles.filterButtons}
        />

        {categoryData.length === 0 ? (
          <Text style={styles.noDataText}>No spending data for this period.</Text>
        ) : (
          <Card style={styles.card}>
            <Card.Title title="Spending Breakdown" />
            <Card.Content>
              <PieChart
                data={chartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[screenWidth / 8, 0]}
                absolute
                hasLegend={false}
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
    padding: 16,
  },
  filterButtons: {
    marginBottom: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  card: {
    // Card styles
  },
  legendWrapper: {
    marginTop: 24,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignSelf: 'center',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  }
});

export default AnalyticsScreen;