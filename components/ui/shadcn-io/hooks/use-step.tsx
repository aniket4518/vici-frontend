"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export const title = "React useStep Hook";

// ============================================================================
// Hook Implementation
// ============================================================================

type UseStepActions = {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

type SetStepCallbackType = (step: number | ((step: number) => number)) => void;

export function useStep(maxStep: number): [number, UseStepActions] {
  const [currentStep, setCurrentStep] = React.useState(1);

  const canGoToNextStep = currentStep + 1 <= maxStep;
  const canGoToPrevStep = currentStep - 1 > 0;

  const setStep = React.useCallback<SetStepCallbackType>(
    (step) => {
      const newStep = step instanceof Function ? step(currentStep) : step;

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep);
        return;
      }

      throw new Error("Step not valid");
    },
    [maxStep, currentStep]
  );

  const goToNextStep = React.useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep((step) => step + 1);
    }
  }, [canGoToNextStep]);

  const goToPrevStep = React.useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep((step) => step - 1);
    }
  }, [canGoToPrevStep]);

  const reset = React.useCallback(() => {
    setCurrentStep(1);
  }, []);

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ];
}

export type { UseStepActions };

// ============================================================================
// Demo Component
// ============================================================================

const TOTAL_STEPS = 4;
const stepLabels = ["Account", "Profile", "Settings", "Review"];

function UseStepDemo() {
  const [
    currentStep,
    { goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, reset },
  ] = useStep(TOTAL_STEPS);

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Step Wizard Demo</h3>
        <p className="text-sm text-muted-foreground">Multi-step navigation</p>
      </div>

      <div className="text-center space-y-3">
        <Label className="text-sm font-medium">Current Step</Label>
        <div className="min-h-[60px] flex items-center justify-center">
          <Badge variant="default" className="text-2xl px-6 py-3 font-bold">
            {currentStep} / {TOTAL_STEPS}
          </Badge>
        </div>
        <div className="text-sm font-medium">{stepLabels[currentStep - 1]}</div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Progress</Label>
        <div className="flex gap-1">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={`flex-1 h-2 rounded-full transition-colors ${
                index + 1 <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {stepLabels.map((label, index) => (
            <span
              key={label}
              className={index + 1 === currentStep ? "text-foreground font-medium" : ""}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 min-h-[36px]">
          <Button
            onClick={goToPrevStep}
            disabled={!canGoToPrevStep}
            variant="outline"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <ChevronLeft size={14} />
            Back
          </Button>
          <Button
            onClick={reset}
            disabled={currentStep === 1}
            variant="secondary"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            <RotateCcw size={14} />
            Reset
          </Button>
          <Button
            onClick={goToNextStep}
            disabled={!canGoToNextStep}
            variant="default"
            size="sm"
            className="text-sm h-9 gap-1"
          >
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Navigation State</Label>
        </div>
        <div className="border rounded p-2 min-h-[40px] flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            Prev: {canGoToPrevStep ? "Yes" : "No"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Next: {canGoToNextStep ? "Yes" : "No"}
          </Badge>
        </div>
      </div>

      <div className="text-center min-h-[20px] flex items-center justify-center">
        <div className="text-xs text-muted-foreground">
          1-indexed, bounds-checked navigation
        </div>
      </div>
    </div>
  );
}

export default UseStepDemo;
