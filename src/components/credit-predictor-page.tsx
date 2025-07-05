'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getAiPrediction } from '@/app/actions';
import { formSchema, type FormValues, type CreditWorthinessOutput } from '@/lib/schemas';
import { CreditCard, History, Landmark, Loader2, Sparkles } from 'lucide-react';
import CreditScoreGauge from './credit-score-gauge';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { WelcomeCard } from './welcome-card';

export default function CreditPredictorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CreditWorthinessOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 50000,
      debts: 10000,
      paymentHistory: 'good',
    },
  });

  function onSubmit(values: FormValues) {
    setResult(null);
    startTransition(async () => {
      const predictionData = await getAiPrediction(values);

      if (predictionData.anomalies && predictionData.anomalies.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Data Anomaly Detected',
          description: predictionData.anomalies.join(' '),
        });
      }

      setResult(predictionData);
    });
  }

  const handleReset = () => {
    form.reset();
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Financial Profile Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income</FormLabel>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50000" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="debts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Debts</FormLabel>
                     <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10000" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment History</FormLabel>
                    <div className="relative">
                       <History className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select payment history status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (No missed payments)</SelectItem>
                          <SelectItem value="good">Good (1-2 late payments)</SelectItem>
                          <SelectItem value="fair">Fair (A few late payments)</SelectItem>
                          <SelectItem value="poor">Poor (Multiple late payments/defaults)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Assess Creditworthiness'
                  )}
                </Button>
                {(result || isPending) && (
                  <Button variant="outline" onClick={handleReset} disabled={isPending}>
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        {isPending && (
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Creditworthiness Prediction</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>AI-Powered Explanation</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
              </CardContent>
            </Card>
          </div>
        )}

        {result && !isPending && (
          <>
            <Card className="bg-gradient-to-br from-primary/10 to-background">
              <CardHeader>
                <CardTitle>Creditworthiness Prediction</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <CreditScoreGauge score={result.score} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  AI-Powered Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.explanation}</p>
              </CardContent>
            </Card>

            <Alert className="border-accent bg-accent/10">
              <Sparkles className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Personalized Improvement Plan</AlertTitle>
              <AlertDescription>
                {result.advice}
              </AlertDescription>
            </Alert>
          </>
        )}
        
        {!result && !isPending && (
          <WelcomeCard />
        )}
      </div>
    </div>
  );
}
