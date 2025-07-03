import CreditPredictorPage from '@/components/credit-predictor-page';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Creditworthiness Assessment AI
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Submit financial data to receive an AI-driven creditworthiness analysis, including a score prediction and improvement strategies.
        </p>
      </div>
      <CreditPredictorPage />
    </main>
  );
}
