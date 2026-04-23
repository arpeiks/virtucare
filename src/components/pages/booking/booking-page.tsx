"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Hidden from "@/components/control/hidden"
import { Ternary } from "@/components/control/ternary"
import { BookingProgress } from "./booking-progress"
import { StepDateTime } from "./step-date-time"
import { StepReason } from "./step-reason"
import { StepReview } from "./step-review"
import { BookingSummary } from "./booking-summary"
import { format, parse } from "date-fns"

export interface Doctor {
  id: string
  name: string
  specialty: string
  subspecialty?: string | null
  imageUrl?: string | null
  slotsByDay: Record<number, string[]>
}

interface BookingPageProps {
  doctorId?: string
  initialDate?: string
  initialTime?: string
  editingId?: string
  slotStyle?: "chips" | "list"
  onBack?: () => void
  onConfirm?: () => void
}

export function BookingPage({
  doctorId = "1",
  initialDate,
  initialTime,
  editingId,
  slotStyle = "chips",
  onBack,
  onConfirm,
}: BookingPageProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loadingDoctor, setLoadingDoctor] = useState(true)
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ? parse(initialDate, "yyyy-MM-dd", new Date()) : null
  )
  const [selectedTime, setSelectedTime] = useState(initialTime ?? "")
  const [reason, setReason] = useState("")
  const [visitType, setVisitType] = useState("Video visit")

  const canProceed1 = selectedDate && selectedTime
  const canProceed2 = reason.trim().length >= 10

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`)
        if (!res.ok) throw new Error("Doctor not found")
        const data = await res.json()
        setDoctor(data)
      } catch {
        setError("Could not load doctor information. Please go back and try again.")
      } finally {
        setLoadingDoctor(false)
      }
    }

    async function fetchBookedSlots() {
      try {
        const res = await fetch(`/api/appointments?doctorId=${doctorId}`)
        if (res.ok) {
          const data = await res.json()
          setBookedSlots(data)
        }
      } catch {
      }
    }

    fetchDoctor()
    fetchBookedSlots()
  }, [doctorId])

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !reason.trim() || !doctor) return

    setSubmitting(true)
    setError(null)

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")

      const method = editingId ? "PATCH" : "POST"
      const url = editingId
        ? `/api/appointments/${editingId}`
        : "/api/appointments"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor.id,
          date: dateStr,
          time: selectedTime,
          reason: reason.trim(),
          visitType,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to save appointment")
      }

      onConfirm?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
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

  if (loadingDoctor) {
    return (
      <div className="p-7 max-w-[1040px] mx-auto">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-7" />
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-7">
          <div className="h-96 bg-muted animate-pulse rounded-xl" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !doctor) {
    return (
      <div className="p-7 max-w-[1040px] mx-auto">
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
          {error}
        </div>
        <Button variant="ghost" className="mt-4 gap-2" onClick={onBack}>
          <ArrowLeft size={14} /> Go back
        </Button>
      </div>
    )
  }

  if (!doctor) return null

  return (
    <div className="p-7 pb-15 max-w-[1040px] mx-auto">
      <BookingProgress currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-7 mt-7">
        <Card className="p-6">
          <Hidden display={step === 1}>
            <StepDateTime
              doctor={doctor}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              slotStyle={slotStyle}
              bookedSlots={bookedSlots}
            />
          </Hidden>

          <Hidden display={step === 2}>
            <StepReason
              reason={reason}
              setReason={setReason}
              visitType={visitType}
              setVisitType={setVisitType}
            />
          </Hidden>

          <Hidden display={step === 3}>
            <StepReview
              doctor={doctor}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              reason={reason}
              visitType={visitType}
              editing={!!editingId}
            />
          </Hidden>

          <Hidden display={!!error}>
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          </Hidden>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={submitting}
              className="gap-2"
            >
              <ArrowLeft size={14} />
              {step === 1 ? "Back to profile" : "Back"}
            </Button>

            <Ternary condition={step < 3}>
              <Button
                variant="primary"
                disabled={step === 1 ? !canProceed1 : !canProceed2}
                onClick={handleNext}
                className="gap-2"
              >
                Continue
                <ArrowRight size={14} />
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-2"
              >
                {submitting
                  ? "Saving…"
                  : editingId
                  ? "Update appointment"
                  : "Confirm booking"}
                <Hidden display={!submitting}>
                  <Check size={16} />
                </Hidden>
              </Button>
            </Ternary>
          </div>
        </Card>

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
