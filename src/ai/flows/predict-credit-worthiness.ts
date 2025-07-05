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
import {z} from 'zod';

export async function predictCreditWorthiness(input: CreditWorthinessInput): Promise<CreditWorthinessOutput> {
  return predictCreditWorthinessFlow(input);
}

const AnalysisInputSchema = CreditWorthinessInputSchema.extend({
  score: z.number().describe('The pre-calculated credit score.'),
});

const AnalysisOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the credit score and the factors that influenced it.'),
  advice: z.string().describe('Personalized, actionable financial advice to help the user improve their credit score.'),
  anomalies: z.array(z.string()).describe('A list of potential anomalies or inconsistencies found in the input data.'),
});

const analysisPrompt = ai.definePrompt({
    name: 'creditAnalysisPrompt',
    model: 'googleai/gemini-1.5-flash-latest',
    input: { schema: AnalysisInputSchema },
    output: { schema: AnalysisOutputSchema },
    prompt: `You are an expert credit analyst AI. Your task is to analyze financial data and a pre-calculated credit score.

    Your response must be a JSON object that conforms to the specified schema.

    **Analysis Steps:**
    1.  **Data Validation**: Analyze the input data for anomalies. An anomaly is an entry that seems unusual or out of a normal range (e.g., debts higher than income). List any findings in the 'anomalies' array. If none, the array must be empty.
    2.  **Explanation Generation**: Provide a clear explanation for the score. Highlight the key factors (Debt-to-income ratio, payment history, income level) that influenced it, both positively and negatively.
    3.  **Advice Generation**: Provide personalized, specific, and actionable advice to help the user improve their credit score, based on weaknesses in their profile. Do not suggest seeking professional help.

    **Financial Data to Analyze:**
    - Annual Income: {{income}}
    - Total Debts: {{debts}}
    - Payment History: {{paymentHistory}}
    - Calculated Credit Score: {{score}}`,
});

const predictCreditWorthinessFlow = ai.defineFlow(
  {
    name: 'predictCreditWorthinessFlow',
    inputSchema: CreditWorthinessInputSchema,
    outputSchema: CreditWorthinessOutputSchema,
  },
  async (input) => {
    // 1. Deterministic score calculation
    const { income, debts, paymentHistory } = input;
    const baseScore = 300;
    
    const paymentHistoryMap: Record<string, number> = { excellent: 200, good: 150, fair: 100, poor: 50 };
    const paymentHistoryPoints = paymentHistoryMap[paymentHistory] || 0;
    
    const dti = income > 0 ? Math.min(debts / income, 1) : 1;
    const dtiPoints = (1 - dti) * 250;
    
    const incomePoints = Math.min(income / 200000, 1) * 150;
    
    const rawScore = baseScore + paymentHistoryPoints + dtiPoints + incomePoints;
    const score = Math.max(300, Math.min(Math.round(rawScore), 850));

    // 2. Call LLM for explanation, advice, and anomaly detection
    const analysisInput = { ...input, score };
    const { output } = await analysisPrompt(analysisInput);

    if (!output) {
      throw new Error("AI analysis failed to generate a response.");
    }

    // 3. Combine calculated score with AI-generated text
    return {
      score: score,
      ...output,
    };
  }
);
