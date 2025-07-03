'use server';
/**
 * @fileOverview A comprehensive creditworthiness prediction and analysis flow.
 *
 * - predictCreditWorthiness - A function that predicts a credit score and provides analysis.
 */

import {ai} from '@/ai/genkit';
import {
  CreditWorthinessInputSchema,
  CreditWorthinessOutputSchema,
  type CreditWorthinessInput,
  type CreditWorthinessOutput,
} from '@/lib/schemas';

export async function predictCreditWorthiness(input: CreditWorthinessInput): Promise<CreditWorthinessOutput> {
  return predictCreditWorthinessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'creditWorthinessPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: CreditWorthinessInputSchema},
  output: {schema: CreditWorthinessOutputSchema},
  system: `You are an expert credit analyst AI. Your task is to act as a creditworthiness prediction model.
  Given the user's financial data, you will perform the following steps:

  1.  **Data Validation**: First, analyze the input data for any anomalies or inconsistencies. An anomaly is an entry that seems unusual or out of a normal range (e.g., debts higher than income). If you find any, list them in the 'anomalies' array. If not, the array should be empty.

  2.  **Score Prediction**: Calculate a credit score based on the provided data. Use the following deterministic formula:
      - Base Score: 300
      - Payment History Points: excellent=200, good=150, fair=100, poor=50.
      - Debt-to-Income (DTI) Ratio Points: Calculate DTI = debts / income (capped at 1). DTI Points = (1 - DTI) * 250.
      - Income Points: (income / 200000, capped at 1) * 150.
      - Final Score = round(Base Score + Payment History Points + DTI Points + Income Points).
      - The final score must be clamped between 300 and 850.

  3.  **Explanation Generation**: Based on the calculated score and the input data, provide a clear explanation. Highlight the key factors (DTI, payment history, income level) that most influenced the score, both positively and negatively.

  4.  **Advice Generation**: Provide personalized, specific, and actionable advice to help the user improve their credit score. The advice should be directly related to the weaknesses identified in their financial profile. Do not suggest the user seek professional help.`,
  prompt: `Analyze the following financial data:
  - Annual Income: {{income}}
  - Total Debts: {{debts}}
  - Payment History: {{paymentHistory}}`,
});

const predictCreditWorthinessFlow = ai.defineFlow(
  {
    name: 'predictCreditWorthinessFlow',
    inputSchema: CreditWorthinessInputSchema,
    outputSchema: CreditWorthinessOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
