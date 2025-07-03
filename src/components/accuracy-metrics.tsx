
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const metrics = [
  { name: 'Precision', value: '0.88' },
  { name: 'Recall', value: '0.92' },
  { name: 'F1-Score', value: '0.90' },
  { name: 'ROC-AUC', value: '0.95' },
];

export function AccuracyMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
        <CardDescription>Metrics for our underlying prediction model.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">{metric.name}</p>
              <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                <TrendingUp className="h-5 w-5 text-accent" />
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
