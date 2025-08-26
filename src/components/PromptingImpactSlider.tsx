import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export type PromptingImpactSliderProps = {
  initialYears?: number;
  minYears?: number;
  maxYears?: number;
  step?: number;
  maturityYears?: number;
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  currency?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
};

// Static base salary
const STATIC_BASE_SALARY = 103140;

export function estimateBaseSalary(years: number): number {
  return STATIC_BASE_SALARY;
}

export function aiUpliftPercent(years: number, maturityYears: number): number {
  const FIXED_MAX_UPLIFT = 0.40;
  const pct = Math.min(1, Math.max(0, years / maturityYears)) * FIXED_MAX_UPLIFT;
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
  showCTA = true,
  ctaText = "Build your prompting skills",
  ctaHref = "/learn",
  currency = "USD",
  locale = "en-US",
  title = "How much can AI skills add to your salary?",
  subtitle = "Drag your years of prompting experience to see the impact."
}) => {
  const [years, setYears] = useState(initialYears);

  const baseSalary = estimateBaseSalary(years);
  const upliftPct = aiUpliftPercent(years, maturityYears);
  const adjustedSalary = estimateAdjustedSalary(baseSalary, upliftPct);

  const animatedBase = useAnimatedNumber(baseSalary);
  const animatedAdjusted = useAnimatedNumber(adjustedSalary);

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
    <div className="w-full mx-auto p-6 bg-card rounded-lg border shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Years Slider */}
        <div className="space-y-4">
          <Label htmlFor="years-slider" className="text-base font-medium block text-center">
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

        {/* Results - Simplified Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Base salary</div>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(animatedBase)}
            </div>
          </div>

          <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/30">
            <div className="text-sm text-muted-foreground mb-2">AI-adjusted salary</div>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(animatedAdjusted)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              typical range {formatCurrency(rangeMin)} – {formatCurrency(rangeMax)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm text-muted-foreground hover:text-foreground underline">
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
    </div>
  );
};

export default PromptingImpactSlider;