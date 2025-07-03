'use server';

/**
 * @fileOverview A flow to explain the credit score and the factors influencing it.
 * 
 * - creditScoreExplanation - A function that handles the credit score explanation process.
 * - CreditScoreExplanationInput - The input type for the creditScoreExplanation function.
 * - CreditScoreExplanationOutput - The return type for the creditScoreExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreditScoreExplanationInputSchema = z.object({
  income: z.number().describe('The annual income of the individual.'),
  debts: z.number().describe('The total outstanding debts of the individual.'),
  paymentHistory: z.string().describe('A summary of the individual\'s payment history.'),
  creditScore: z.number().describe('The predicted credit score of the individual.'),
});
export type CreditScoreExplanationInput = z.infer<typeof CreditScoreExplanationInputSchema>;

const CreditScoreExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the credit score and the factors that influenced it.'),
});
export type CreditScoreExplanationOutput = z.infer<typeof CreditScoreExplanationOutputSchema>;

export async function creditScoreExplanation(input: CreditScoreExplanationInput): Promise<CreditScoreExplanationOutput> {
  return creditScoreExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'creditScoreExplanationPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: CreditScoreExplanationInputSchema},
  output: {schema: CreditScoreExplanationOutputSchema},
  system: 'You are an expert credit analyst. You provide clear and concise explanations of credit scores, highlighting the factors that most influenced the prediction so the user can understand and potentially improve their creditworthiness.',
  prompt: `Based on the following data, explain why the individual received a credit score of {{creditScore}}.\n\nIncome: {{income}}\nDebts: {{debts}}\nPayment History: {{paymentHistory}}`,
});

const creditScoreExplanationFlow = ai.defineFlow(
  {
    name: 'creditScoreExplanationFlow',
    inputSchema: CreditScoreExplanationInputSchema,
    outputSchema: CreditScoreExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
