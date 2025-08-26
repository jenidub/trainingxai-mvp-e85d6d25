import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export type PromptingImpactSliderProps = {
  initialYears?: number;
  minYears?: number;
  maxYears?: number;
  step?: number;
  maturityYears?: number;
  defaultTier?: "low" | "mid" | "high";
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  currency?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
};

// Salary anchors for piecewise linear interpolation
export const mockAnchors = [
  { years: 0.5, salary: 103140 },
  { years: 2, salary: 121641 },
  { years: 5, salary: 138301 },
  { years: 8, salary: 155132 },
  { years: 12, salary: 172468 },
  { years: 17, salary: 185709 },
  { years: 20, salary: 185709 }
];

// Tier maximum uplifts
const tierMaxUplifts = {
  low: 0.28,
  mid: 0.40,
  high: 0.56
};

export function estimateBaseSalary(years: number): number {
  if (years <= mockAnchors[0].years) return mockAnchors[0].salary;
  if (years >= mockAnchors[mockAnchors.length - 1].years) return mockAnchors[mockAnchors.length - 1].salary;

  for (let i = 0; i < mockAnchors.length - 1; i++) {
    const current = mockAnchors[i];
    const next = mockAnchors[i + 1];
    
    if (years >= current.years && years <= next.years) {
      const ratio = (years - current.years) / (next.years - current.years);
      return current.salary + ratio * (next.salary - current.salary);
    }
  }
  
  return mockAnchors[mockAnchors.length - 1].salary;
}

export function aiUpliftPercent(years: number, tier: "low" | "mid" | "high", maturityYears: number): number {
  const maxPct = tierMaxUplifts[tier];
  const pct = Math.min(1, Math.max(0, years / maturityYears)) * maxPct;
  return pct;
}

export function estimateAdjustedSalary(base: number, upliftPct: number): number {
  return base * (1 + upliftPct);
}

function useAnimatedNumber(target: number, duration: number = 500) {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    const start = current;
    const diff = target - start;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      setCurrent(start + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return Math.round(current);
}

const PromptingImpactSlider: React.FC<PromptingImpactSliderProps> = ({
  initialYears = 2,
  minYears = 0,
  maxYears = 20,
  step = 0.5,
  maturityYears = 5,
  defaultTier = "mid",
  showCTA = true,
  ctaText = "Build your prompting skills",
  ctaHref = "/learn",
  currency = "USD",
  locale = "en-US",
  title = "How much can AI skills add to your salary?",
  subtitle = "Drag your years of prompting experience, then choose an AI-skills tier."
}) => {
  const [years, setYears] = useState(initialYears);
  const [selectedTier, setSelectedTier] = useState<"low" | "mid" | "high">(defaultTier);

  const baseSalary = estimateBaseSalary(years);
  const upliftPct = aiUpliftPercent(years, selectedTier, maturityYears);
  const adjustedSalary = estimateAdjustedSalary(baseSalary, upliftPct);
  const delta = adjustedSalary - baseSalary;

  const animatedBase = useAnimatedNumber(baseSalary);
  const animatedAdjusted = useAnimatedNumber(adjustedSalary);
  const animatedDelta = useAnimatedNumber(delta);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const rangeMin = Math.round(adjustedSalary * 0.9);
  const rangeMax = Math.round(adjustedSalary * 1.1);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg border shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4">
          {/* Years Slider */}
          <div className="space-y-2">
            <Label htmlFor="years-slider" className="text-sm font-medium">
              Years of experience: {years.toFixed(1)}
            </Label>
            <Slider
              id="years-slider"
              min={minYears}
              max={maxYears}
              step={step}
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              className="w-full"
              aria-valuemin={minYears}
              aria-valuemax={maxYears}
              aria-valuenow={years}
            />
          </div>

          {/* Tier Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">AI-skills tier:</Label>
            <RadioGroup 
              value={selectedTier} 
              onValueChange={(value) => setSelectedTier(value as "low" | "mid" | "high")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-sm">Low (+28%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mid" id="mid" />
                <Label htmlFor="mid" className="text-sm">Mid (+40%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-sm">High (+56%)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3" aria-live="polite">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Base salary</div>
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(animatedBase)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              AI-skills uplift ({(upliftPct * 100).toFixed(1)}%)
            </div>
            <div className="text-lg font-semibold text-primary">
              +{formatCurrency(animatedDelta)}
            </div>
          </div>

          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground">AI-adjusted salary</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(animatedAdjusted)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              typical range {formatCurrency(rangeMin)} – {formatCurrency(rangeMax)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-xs text-muted-foreground hover:text-foreground underline">
              About these numbers
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>About These Salary Estimates</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p>
                Base salary figures aggregate public sources including Glassdoor via Coursera, BuiltIn, and other industry reports, last updated mid-2025.
              </p>
              <p>
                AI-skills uplifts are synthesized from PwC, Lightcast, and AWS surveys on AI productivity impacts and vary significantly by role and market.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> Estimates only; actual compensation varies by role, location, company, and total compensation packages at top firms can be significantly higher than base salary.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {showCTA && (
          <Button asChild size="sm">
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PromptingImpactSlider;