//Validate uploaded data flow
'use server';

/**
 * @fileOverview Validates uploaded financial data using GenAI to identify anomalies.
 *
 * - validateUploadedData - A function that validates the uploaded data and returns anomalies.
 * - ValidateUploadedDataInput - The input type for the validateUploadedData function.
 * - ValidateUploadedDataOutput - The return type for the validateUploadedData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateUploadedDataInputSchema = z.object({
  income: z.number().describe('The user\u2019s income.'),
  debts: z.number().describe('The user\u2019s debts.'),
  paymentHistory: z.string().describe('The user\u2019s payment history.'),
});
export type ValidateUploadedDataInput = z.infer<typeof ValidateUploadedDataInputSchema>;

const ValidateUploadedDataOutputSchema = z.object({
  anomalies: z.array(z.string()).describe('A list of anomalies found in the data.'),
});
export type ValidateUploadedDataOutput = z.infer<typeof ValidateUploadedDataOutputSchema>;

export async function validateUploadedData(input: ValidateUploadedDataInput): Promise<ValidateUploadedDataOutput> {
  return validateUploadedDataFlow(input);
}

const validateUploadedDataPrompt = ai.definePrompt({
  name: 'validateUploadedDataPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: ValidateUploadedDataInputSchema},
  output: {schema: ValidateUploadedDataOutputSchema},
  prompt: `You are an AI assistant that validates user provided financial data and identifies any anomalies.

  Analyze the following data and identify any anomalies or inconsistencies. An anomaly is an entry that is not within a normal range.

  Income: {{income}}
  Debts: {{debts}}
  Payment History: {{paymentHistory}}

  Return a list of anomalies found in the data. Be specific about why each entry is considered an anomaly.
  If there are no anomalies, return an empty array.
`,
});

const validateUploadedDataFlow = ai.defineFlow(
  {
    name: 'validateUploadedDataFlow',
    inputSchema: ValidateUploadedDataInputSchema,
    outputSchema: ValidateUploadedDataOutputSchema,
  },
  async input => {
    const {output} = await validateUploadedDataPrompt(input);
    return output!;
  }
);
