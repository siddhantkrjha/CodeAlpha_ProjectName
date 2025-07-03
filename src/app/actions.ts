
'use server';

import { validateUploadedData } from '@/ai/flows/data-validation';
import { creditScoreExplanation } from '@/ai/flows/credit-score-explanation';
import { getPersonalizedFinancialAdvice } from '@/ai/flows/personalized-financial-advice';
import type { FormValues } from '@/lib/schemas';

export async function getPrediction(values: FormValues, predictedScore: number) {
  try {
    const financialSituation = `The user has an annual income of $${values.income}, total debts of $${values.debts}, and their payment history is described as ${values.paymentHistory}.`;

    const [validationResult, explanationResult, adviceResult] = await Promise.allSettled([
      validateUploadedData({
        ...values,
        paymentHistory: values.paymentHistory,
      }),
      creditScoreExplanation({
        ...values,
        creditScore: predictedScore,
        paymentHistory: values.paymentHistory,
      }),
      getPersonalizedFinancialAdvice({
        creditScore: predictedScore,
        financialSituation,
      }),
    ]);

    const anomalies = validationResult.status === 'fulfilled' ? validationResult.value.anomalies : ['Failed to validate data.'];
    const explanation = explanationResult.status === 'fulfilled' ? explanationResult.value.explanation : 'Could not generate an explanation.';
    const advice = adviceResult.status === 'fulfilled' ? adviceResult.value.advice : 'Could not generate financial advice.';

    if (validationResult.status === 'rejected') {
        console.error('Validation error:', validationResult.reason);
    }
    if (explanationResult.status === 'rejected') {
        console.error('Explanation error:', explanationResult.reason);
    }
    if (adviceResult.status === 'rejected') {
        console.error('Advice error:', adviceResult.reason);
    }

    return { anomalies, explanation, advice };
  } catch (error) {
    console.error('Error in getPrediction:', error);
    return {
      anomalies: ['An unexpected error occurred.'],
      explanation: 'Could not generate an explanation due to a server error.',
      advice: 'Could not generate financial advice due to a server error.',
    };
  }
}
