'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader className="items-center">
        <Bot className="h-12 w-12 mb-4 text-primary" />
        <CardTitle>AI-Powered Credit Analysis</CardTitle>
        <CardDescription className="text-center">
          Fill out the form on the left to get started. Our AI will analyze your
          financial profile to predict a credit score and offer personalized
          advice for improvement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground text-center">
          <p>This tool provides an estimated credit score and is for informational purposes only. It is not a substitute for a professional credit report.</p>
        </div>
      </CardContent>
    </Card>
  );
}
