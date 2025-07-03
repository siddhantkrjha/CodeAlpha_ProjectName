'use server';

import { predictCreditWorthiness } from '@/ai/flows/predict-credit-worthiness';
import type { FormValues } from '@/lib/schemas';

export async function getAiPrediction(values: FormValues) {
  try {
    const result = await predictCreditWorthiness({
      income: values.income,
      debts: values.debts,
      paymentHistory: values.paymentHistory,
    });
    return result;
  } catch (error) {
    console.error('Error in getAiPrediction:', error);
    // Returning a structured error object that matches the expected output
    return {
      score: 300,
      anomalies: ['An unexpected server error occurred. Please try again later.'],
      explanation: 'Could not generate an explanation due to a server error. Please check the server logs for more details.',
      advice: 'Could not generate financial advice due to a server error. Please check the server logs for more details.',
    };
  }
}
