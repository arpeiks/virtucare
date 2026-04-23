"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingProgressProps {
  currentStep: number
}

const steps = [
  'Date & time',
  'Reason for visit', 
  'Review & confirm'
]

export function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="flex items-center gap-4">
      {steps.map((stepName, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isCompleted = currentStep > stepNumber
        
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium transition-colors",
                  isCompleted || isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border"
                )}
              >
                {isCompleted ? (
                  <Check size={14} />
                ) : (
                  stepNumber
                )}
              </div>
              <div
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {stepName}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}