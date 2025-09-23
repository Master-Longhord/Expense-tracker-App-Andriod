import * as SQLite from 'expo-sqlite';

export type Expense = {
  id?: number;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  notes: string | null;
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
    console.log('Expense added with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};