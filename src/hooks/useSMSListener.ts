import { useEffect, useCallback } from 'react';
import SmsListener from 'react-native-android-sms-listener';
import { addExpense, Expense } from '../services/sqlite';
import { sendNewExpenseNotification } from '../utils/notifications'; // <-- 1. IMPORT THE HELPER

type ParsedExpense = Omit<Expense, 'id' | 'date' | 'notes'> & { notes: string };

const parseSms = (sms: string): ParsedExpense | null => {
  console.log('Attempting to parse SMS (v4):', sms);
  if (!/debit|dr/i.test(sms)) return null;
  
  const amountRegex = /(?:Amt:NGN|Amt:\s*NGN|NGN)\s*([\d,]+\.?\d*)/i;
  const amountMatch = sms.match(amountRegex);
  const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : null;
  const amount = amountStr ? parseFloat(amountStr) : null;

  if (!amount || isNaN(amount)) return null;

  let merchant: string | null = null;
  const descRegex = /(?:Desc|Description|Narration):(.*?)(?:Date:|Avail Bal:|$)/is;
  const descMatch = sms.match(descRegex);
  if (descMatch) {
    const description = descMatch[1].trim();
    const companyRegex = /[A-Z]{2,}\s+[A-Z]{2,}/;
    const companyMatch = description.match(companyRegex);
    if (companyMatch) {
      merchant = companyMatch[0].trim();
    }
  }

  if (!merchant) return null;

  console.log(`SUCCESS: Parsed Amount: ${amount}, Merchant: ${merchant}`);
  return {
    amount,
    merchant,
    category: 'Uncategorized',
    notes: `Parsed from SMS:\n"${sms.substring(0, 100)}..."`,
  };
};

export const useSMSListener = (isEnabled: boolean, onNewExpense: () => void) => {
  useEffect(() => {
    let subscription: any = null;

    if (isEnabled) {
      console.log('Starting SMS listener with FINAL library...');
      
      const handleSmsReceived = async (message: any) => {
        console.log("SMS RECEIVED EVENT (FINAL LIBRARY):", message);
        
        const body = message?.body || message?.message || message;
        
        if (body && typeof body === 'string') {
          const result = parseSms(body);
          if (result) {
            try {
              const newExpense = {
                ...result,
                date: new Date().toISOString().split('T')[0],
              };
              await addExpense(newExpense);
              console.log("SMS expense saved silently to DB");

              // --- 2. TRIGGER NOTIFICATION ---
              await sendNewExpenseNotification(result.merchant, result.amount);

              onNewExpense();
            } catch (error) {
              console.error("Failed to silently save SMS expense", error);
            }
          }
        }
      };

      subscription = SmsListener.addListener(handleSmsReceived);
    }

    return () => {
      console.log('Stopping SMS listener with FINAL library...');
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [isEnabled, onNewExpense]);
};
