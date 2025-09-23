import * as SQLite from 'expo-sqlite';

export type Expense = {
  id?: number;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  notes: string | null;
};

export type CategoryWiseExpense = {
  category: string;
  total: number;
};

export type Budget = {
  id?: number;
  month: string;
  amount: number;
};

const db = SQLite.openDatabaseSync('expenseTracker.db');

export const initDB = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        merchant TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        notes TEXT
      );
      CREATE TABLE IF NOT EXISTS budget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT UNIQUE NOT NULL,
        amount REAL NOT NULL
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO expenses (amount, merchant, category, date, notes) VALUES (?, ?, ?, ?, ?)',
      expense.amount,
      expense.merchant,
      expense.category,
      expense.date,
      expense.notes || null
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (startDate?: string): Promise<Expense[]> => {
  try {
    let query = 'SELECT * FROM expenses';
    const params = [];

    if (startDate) {
      query += ' WHERE date >= ?';
      params.push(startDate);
    }

    query += ' ORDER BY date DESC';

    const allRows = await db.getAllAsync<Expense>(query, ...params);
    return allRows;
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const getCategoryWiseExpense = async (startDate?: string): Promise<CategoryWiseExpense[]> => {
  try {
    let query = 'SELECT category, SUM(amount) as total FROM expenses';
    const params = [];

    if (startDate) {
      query += ' WHERE date >= ?';
      params.push(startDate);
    }

    query += ' GROUP BY category HAVING total > 0 ORDER BY total DESC';

    const result = await db.getAllAsync<CategoryWiseExpense>(query, ...params);
    return result;
  } catch (error) {
    console.error('Error getting category-wise expenses:', error);
    throw error;
  }
};
