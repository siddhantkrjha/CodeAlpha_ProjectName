
'use client';

import { cn } from "@/lib/utils";

const getScoreData = (score: number) => {
  if (score < 580) return { rating: 'Poor', color: 'hsl(var(--destructive))' };
  if (score < 670) return { rating: 'Fair', color: 'hsl(var(--chart-4))' };
  if (score < 740) return { rating: 'Good', color: 'hsl(var(--chart-2))' };
  if (score < 800) return { rating: 'Very Good', color: 'hsl(var(--accent))' };
  return { rating: 'Excellent', color: 'hsl(var(--accent))' };
};

const CreditScoreGauge = ({ score }: { score: number }) => {
  const { rating, color } = getScoreData(score);
  const percentage = (score - 300) / (850 - 300);
  const radius = 80;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-48">
      <svg className="w-full h-full" viewBox="0 0 200 100">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="40%" stopColor="hsl(var(--chart-4))" />
            <stop offset="70%" stopColor="hsl(var(--chart-2))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Foreground arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-5xl font-bold" style={{ color: color }}>
          {score}
        </span>
        <span className="text-lg font-medium" style={{ color: color }}>
          {rating}
        </span>
      </div>
    </div>
  );
};

export default CreditScoreGauge;
