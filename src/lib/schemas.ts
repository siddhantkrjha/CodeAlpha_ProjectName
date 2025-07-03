import { z } from 'zod';

export const formSchema = z.object({
  income: z.coerce.number().min(1, 'Annual income must be greater than 0.'),
  debts: z.coerce.number().min(0, 'Debts cannot be negative.'),
  paymentHistory: z.enum(['excellent', 'good', 'fair', 'poor'], {
    required_error: 'You need to select a payment history status.',
  }),
});

export type FormValues = z.infer<typeof formSchema>;
