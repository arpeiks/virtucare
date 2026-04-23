"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Check, ArrowLeft, ArrowRight } from "lucide-react"
import { BookingProgress } from "./booking-progress"
import { StepDateTime } from "./step-date-time"
import { StepReason } from "./step-reason"
import { StepReview } from "./step-review"
import { BookingSummary } from "./booking-summary"
import { cn } from "@/lib/utils"

// Mock data - replace with actual data
const MOCK_DOCTOR = {
  id: "1",
  name: "Dr. Sarah Johnson",
  specialty: "Family Medicine",
  subspecialty: "Internal Medicine",
  slotsByDay: {
    0: [], // Sunday
    1: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"], // Monday
    2: ["09:00", "10:00", "11:00", "14:00", "15:00"], // Tuesday
    3: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"], // Wednesday
    4: ["09:00", "10:00", "11:00", "14:00", "15:00"], // Thursday
    5: ["09:00", "10:00", "11:00"], // Friday
    6: [], // Saturday
  }
}

interface BookingPageProps {
  doctorId?: string
  initialDate?: string
  initialTime?: string
  editingId?: string
  slotStyle?: 'chips' | 'list'
  onBack?: () => void
  onConfirm?: (appointment: any) => void
}

export function BookingPage({
  doctorId = "1",
  initialDate,
  initialTime,
  editingId,
  slotStyle = 'chips',
  onBack,
  onConfirm
}: BookingPageProps) {
  const doctor = MOCK_DOCTOR // In real app, fetch by doctorId
  
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : null
  )
  const [selectedTime, setSelectedTime] = useState(initialTime || '')
  const [reason, setReason] = useState('')
  const [visitType, setVisitType] = useState('Video visit')

  const canProceed1 = selectedDate && selectedTime
  const canProceed2 = reason.trim().length >= 10

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !reason.trim()) return

    const appointment = {
      id: editingId || `appt-${Date.now()}`,
      doctorId,
      date: selectedDate.toISOString(),
      time: selectedTime,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      visitType,
    }

    onConfirm?.(appointment)
  }

  const handleBack = () => {
    if (step === 1) {
      onBack?.()
    } else {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  if (!doctor) return null

  return (
    <div className="p-7 pb-15 max-w-[1040px] mx-auto">
      {/* Progress */}
      <BookingProgress currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-7 mt-7">
        {/* Main Content */}
        <Card className="p-6">
          {step === 1 && (
            <StepDateTime
              doctor={doctor}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              slotStyle={slotStyle}
            />
          )}
          
          {step === 2 && (
            <StepReason
              reason={reason}
              setReason={setReason}
              visitType={visitType}
              setVisitType={setVisitType}
            />
          )}
          
          {step === 3 && (
            <StepReview
              doctor={doctor}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              reason={reason}
              visitType={visitType}
              editing={!!editingId}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft size={14} />
              {step === 1 ? 'Back to profile' : 'Back'}
            </Button>

            {step < 3 ? (
              <Button
                variant="primary"
                disabled={step === 1 ? !canProceed1 : !canProceed2}
                onClick={handleNext}
                className="gap-2"
              >
                Continue
                <ArrowRight size={14} />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                className="gap-2"
              >
                {editingId ? 'Update appointment' : 'Confirm booking'}
                <Check size={16} />
              </Button>
            )}
          </div>
        </Card>

        {/* Summary Sidebar */}
        <div className="lg:sticky lg:top-5 h-fit">
          <BookingSummary
            doctor={doctor}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            visitType={visitType}
            reason={reason}
          />
        </div>
      </div>
    </div>
  )
}