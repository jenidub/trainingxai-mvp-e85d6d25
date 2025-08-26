import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

// Anchor points for salary interpolation (years, salary)
export const mockAnchors = [
  { years: 0.5, salary: 103140 },
  { years: 2, salary: 121641 },
  { years: 5, salary: 138301 },
  { years: 8, salary: 155132 },
  { years: 12, salary: 172468 },
  { years: 17, salary: 185709 },
  { years: 20, salary: 185709 }
];

// Pure function for salary estimation
export function estimateSalary(years: number): number {
  if (years <= mockAnchors[0].years) return mockAnchors[0].salary;
  if (years >= mockAnchors[mockAnchors.length - 1].years) return mockAnchors[mockAnchors.length - 1].salary;

  // Find the two anchor points to interpolate between
  for (let i = 0; i < mockAnchors.length - 1; i++) {
    const current = mockAnchors[i];
    const next = mockAnchors[i + 1];
    
    if (years >= current.years && years <= next.years) {
      // Linear interpolation
      const ratio = (years - current.years) / (next.years - current.years);
      return Math.round(current.salary + (next.salary - current.salary) * ratio);
    }
  }
  
  return mockAnchors[mockAnchors.length - 1].salary;
}

export type PromptingSalarySliderProps = {
  initialYears?: number;
  minYears?: number;
  maxYears?: number;
  step?: number;
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  currency?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
};

/**
 * Interactive salary slider component for AI prompting experience.
 * 
 * Example usage:
 * ```tsx
 * import PromptingSalarySlider from "@/components/PromptingSalarySlider";
 * 
 * export default function HomeHero() {
 *   return (
 *     <section className="mx-auto max-w-5xl px-6 py-12">
 *       <PromptingSalarySlider
 *         initialYears={3}
 *         ctaHref="/programs/prompting"
 *       />
 *     </section>
 *   );
 * }
 * ```
 */
const PromptingSalarySlider: React.FC<PromptingSalarySliderProps> = ({
  initialYears = 2,
  minYears = 0,
  maxYears = 20,
  step = 0.5,
  showCTA = true,
  ctaText = "Build your prompting skills",
  ctaHref = "/learn",
  currency = "USD",
  locale = "en-US",
  title = "What can more prompting experience do for your salary?",
  subtitle = "Drag to set your years of prompting experience."
}) => {
  const [years, setYears] = useState(initialYears);
  const [displaySalary, setDisplaySalary] = useState(estimateSalary(initialYears));
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate salary counter
  useEffect(() => {
    const targetSalary = estimateSalary(years);
    if (targetSalary === displaySalary) return;

    setIsAnimating(true);
    const startSalary = displaySalary;
    const difference = targetSalary - startSalary;
    const duration = 500; // 500ms animation
    const startTime = performance.now();

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = Math.round(startSalary + (difference * easeOutQuart));
      setDisplaySalary(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animateValue);
  }, [years, displaySalary]);

  const handleSliderChange = (value: number[]) => {
    setYears(value[0]);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const estimatedSalary = estimateSalary(years);
  const lowerBound = Math.round(estimatedSalary * 0.9);
  const upperBound = Math.round(estimatedSalary * 1.1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const currentValue = years;
    let newValue = currentValue;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(minYears, currentValue - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(maxYears, currentValue + step);
        break;
      case 'PageDown':
        newValue = Math.max(minYears, currentValue - 2);
        break;
      case 'PageUp':
        newValue = Math.min(maxYears, currentValue + 2);
        break;
      case 'Home':
        newValue = minYears;
        break;
      case 'End':
        newValue = maxYears;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    setYears(newValue);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {subtitle}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Slider Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label 
                  htmlFor="experience-slider"
                  className="block text-sm font-medium text-foreground"
                >
                  Years of Prompting Experience
                </label>
                <div className="space-y-2">
                  <Slider
                    id="experience-slider"
                    value={[years]}
                    onValueChange={handleSliderChange}
                    onKeyDown={handleKeyDown}
                    min={minYears}
                    max={maxYears}
                    step={step}
                    className="w-full"
                    aria-valuemin={minYears}
                    aria-valuemax={maxYears}
                    aria-valuenow={years}
                    aria-label={`Experience: ${years} years`}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{minYears} years</span>
                    <span className="font-medium text-primary">
                      {years} years
                    </span>
                    <span>{maxYears}+ years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Display Section */}
            <div className="text-center lg:text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated AI Salary
                </p>
                <div className={`text-4xl lg:text-5xl font-bold text-primary transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
                  <span aria-live="polite" aria-atomic="true">
                    {formatCurrency(displaySalary)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  typical range {formatCurrency(lowerBound)} – {formatCurrency(upperBound)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-primary/20">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                  <InfoIcon className="h-4 w-4" />
                  About these numbers
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>About these salary estimates</DialogTitle>
                  <DialogDescription className="space-y-3 text-sm">
                    <p>
                      These figures are U.S. base salary averages synthesized from multiple public sources 
                      including Glassdoor via Coursera, BuiltIn, and other industry reports, last updated mid-2025.
                    </p>
                    <p>
                      Total compensation at top firms can be significantly higher than base salary shown here, 
                      often including bonuses, equity, and other benefits.
                    </p>
                    <p className="font-medium text-muted-foreground">
                      <strong>Disclaimer:</strong> Estimates only; actual compensation varies significantly 
                      by role, location, company size, and individual performance.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {showCTA && (
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a href={ctaHref}>
                  {ctaText}
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptingSalarySlider;