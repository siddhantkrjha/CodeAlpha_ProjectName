import CreditPredictorPage from '@/components/credit-predictor-page';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          CreditWise Predictor
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter your financial details to get an AI-powered credit score prediction and personalized advice.
        </p>
      </div>
      <CreditPredictorPage />
    </main>
  );
}
