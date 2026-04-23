"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Video, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepReasonProps {
  reason: string
  setReason: (reason: string) => void
  visitType: string
  setVisitType: (type: string) => void
}

const quickReasons = [
  'Annual physical',
  'Medication refill',
  'New symptoms',
  'Follow-up visit',
  'Lab results review',
  'Mental health check-in',
]

const visitTypeOptions = [
  {
    value: 'Video visit',
    icon: Video,
    description: 'Meet by secure video'
  },
  {
    value: 'Phone consult',
    icon: Phone,
    description: 'Audio-only call'
  }
]

export function StepReason({
  reason,
  setReason,
  visitType,
  setVisitType
}: StepReasonProps) {
  const addQuickReason = (quickReason: string) => {
    setReason(reason ? `${reason} ${quickReason}` : quickReason)
  }

  return (
    <div>
      <h2 className="font-serif text-[28px] text-foreground mb-0 font-normal tracking-tight">
        What brings you in?
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5">
        Share a quick note so your doctor can prepare. Details stay private.
      </p>

      {/* Visit Type */}
      <div className="mt-6">
        <Label className="text-sm font-medium mb-2.5 block">Visit type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {visitTypeOptions.map((option) => {
            const IconComponent = option.icon
            const isSelected = visitType === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => setVisitType(option.value)}
                className={cn(
                  "p-3.5 border rounded-lg cursor-pointer text-left flex gap-3 items-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground"
                )}>
                  <IconComponent size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {option.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick Pick */}
      <div className="mt-6">
        <Label className="text-sm font-medium mb-2.5 block">Quick pick</Label>
        <div className="flex gap-2 flex-wrap">
          {quickReasons.map((quickReason) => (
            <Button
              key={quickReason}
              variant="ghost"
              size="sm"
              onClick={() => addQuickReason(quickReason)}
              className="rounded-full border border-border bg-card hover:bg-muted/50 text-xs"
            >
              + {quickReason}
            </Button>
          ))}
        </div>
      </div>

      {/* Reason Textarea */}
      <div className="mt-6">
        <Label className="text-sm font-medium mb-2.5 block">
          Reason for visit
        </Label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Experiencing persistent headaches for the past two weeks, especially in the afternoons…"
          rows={5}
          className="resize-vertical"
        />
        <div className="flex justify-between mt-1.5">
          <div className={cn(
            "text-xs",
            reason.trim().length < 10 
              ? "text-muted-foreground" 
              : "text-green-600"
          )}>
            {reason.trim().length < 10 
              ? `Please add at least ${10 - reason.trim().length} more characters`
              : 'Looks good'
            }
          </div>
          <div className="text-xs text-muted-foreground">
            {reason.length} chars
          </div>
        </div>
      </div>
    </div>
  )
}