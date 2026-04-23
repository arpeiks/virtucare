"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Doctor {
  id: string
  name: string
  specialty: string
  subspecialty?: string
}

interface StepReviewProps {
  doctor: Doctor
  selectedDate: Date | null
  selectedTime: string
  reason: string
  visitType: string
  editing?: boolean
}

const formatDateLong = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function StepReview({
  doctor,
  selectedDate,
  selectedTime,
  reason,
  visitType,
  editing = false
}: StepReviewProps) {
  if (!selectedDate) return null

  return (
    <div>
      <h2 className="font-serif text-[28px] text-foreground mb-0 font-normal tracking-tight">
        Review your appointment
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5">
        Confirm the details below. You'll get a reminder 24 hours before.
      </p>

      {/* Doctor Info */}
      <div className="mt-6 p-5 bg-background border border-border rounded-xl">
        <div className="flex gap-4 items-center">
          <Avatar className="h-13 w-13">
            <AvatarImage src="" />
            <AvatarFallback className="text-lg">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-serif text-xl text-foreground tracking-tight">
              {doctor.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {doctor.specialty}
              {doctor.subspecialty && ` · ${doctor.subspecialty}`}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <ReviewRow
          icon={Calendar}
          label="Date"
          value={formatDateLong(selectedDate)}
        />
        <ReviewRow
          icon={Clock}
          label="Time"
          value={`${formatTime(selectedTime)} · 30 min`}
        />
        <ReviewRow
          icon={Video}
          label="Visit type"
          value={visitType}
        />
        <ReviewRow
          icon={Info}
          label="Cost"
          value="Covered by your plan"
        />
      </div>

      {/* Reason */}
      <div className="mt-4 p-4 border border-border rounded-xl bg-card">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
          Reason for visit
        </div>
        <div className="text-sm text-foreground leading-relaxed">
          {reason}
        </div>
      </div>

      {/* Consent Notice */}
      <div className="mt-5 p-3.5 rounded-lg bg-primary/5 flex gap-2.5 items-start">
        <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
        <div className="text-xs text-primary leading-relaxed">
          By confirming, you agree to VirtuCare's telehealth consent. You can cancel 
          or reschedule up to 2 hours before your visit, free of charge.
        </div>
      </div>
    </div>
  )
}

interface ReviewRowProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
}

function ReviewRow({ icon: IconComponent, label, value }: ReviewRowProps) {
  return (
    <div className="p-3.5 border border-border rounded-lg bg-card flex gap-3 items-center">
      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary flex-shrink-0">
        <IconComponent size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
        <div className="text-sm text-foreground font-medium mt-0.5 truncate">
          {value}
        </div>
      </div>
    </div>
  )
}