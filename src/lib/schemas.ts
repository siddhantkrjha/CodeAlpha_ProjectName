import { z } from 'zod';

export const formSchema = z.object({
  income: z.coerce.number().min(1, 'Annual income must be greater than 0.'),
  debts: z.coerce.number().min(0, 'Debts cannot be negative.'),
  paymentHistory: z.enum(['excellent', 'good', 'fair', 'poor'], {
    required_error: 'You need to select a payment history status.',
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export const CreditWorthinessInputSchema = z.object({
  income: z.number().describe('The annual income of the individual.'),
  debts: z.number().describe('The total outstanding debts of the individual.'),
  paymentHistory: z.string().describe("A summary of the individual's payment history (excellent, good, fair, or poor)."),
});
export type CreditWorthinessInput = z.infer<typeof CreditWorthinessInputSchema>;

export const CreditWorthinessOutputSchema = z.object({
  score: z.number().describe('The predicted credit score, ranging from 300 to 850.'),
  explanation: z.string().describe('A clear and concise explanation of the credit score and the factors that influenced it.'),
  advice: z.string().describe('Personalized, actionable financial advice to help the user improve their credit score.'),
  anomalies: z.array(z.string()).describe('A list of potential anomalies or inconsistencies found in the input data.'),
});
export type CreditWorthinessOutput = z.infer<typeof CreditWorthinessOutputSchema>;
