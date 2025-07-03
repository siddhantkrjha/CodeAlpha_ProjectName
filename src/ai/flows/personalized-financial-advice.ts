'use server';

/**
 * @fileOverview Generates personalized financial advice to improve credit score.
 *
 * - getPersonalizedFinancialAdvice - A function that generates personalized financial advice.
 * - PersonalizedFinancialAdviceInput - The input type for the getPersonalizedFinancialAdvice function.
 * - PersonalizedFinancialAdviceOutput - The return type for the getPersonalizedFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFinancialAdviceInputSchema = z.object({
  creditScore: z.number().describe('The user\'s current credit score.'),
  financialSituation:
    z.string()
      .describe(
        'A detailed description of the user\'s current financial situation, including income, debts, and payment history.'
      ),
});
export type PersonalizedFinancialAdviceInput = z.infer<
  typeof PersonalizedFinancialAdviceInputSchema
>;

const PersonalizedFinancialAdviceOutputSchema = z.object({
  advice:
    z.string()
      .describe(
        'Personalized financial advice tailored to the user\'s situation to improve their credit score.'
      ),
});
export type PersonalizedFinancialAdviceOutput = z.infer<
  typeof PersonalizedFinancialAdviceOutputSchema
>;

export async function getPersonalizedFinancialAdvice(
  input: PersonalizedFinancialAdviceInput
): Promise<PersonalizedFinancialAdviceOutput> {
  return personalizedFinancialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFinancialAdvicePrompt',
  input: {schema: PersonalizedFinancialAdviceInputSchema},
  output: {schema: PersonalizedFinancialAdviceOutputSchema},
  prompt: `You are a financial advisor specializing in credit score improvement.

  Based on the user's credit score and financial situation, provide personalized advice to help them improve their credit score.

  Credit Score: {{{creditScore}}}
  Financial Situation: {{{financialSituation}}}

  Provide specific, actionable steps the user can take.
  Do not suggest the user seek professional help.
`,
});

const personalizedFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedFinancialAdviceFlow',
    inputSchema: PersonalizedFinancialAdviceInputSchema,
    outputSchema: PersonalizedFinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
