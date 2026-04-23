"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface BookingSummaryProps {
  doctor: Doctor
  selectedDate: Date | null
  selectedTime: string
  visitType: string
  reason: string
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
  if (!time) return '—'
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function BookingSummary({
  doctor,
  selectedDate,
  selectedTime,
  visitType,
  reason
}: BookingSummaryProps) {
  return (
    <Card className="p-6">
      {/* Doctor Info */}
      <div className="flex gap-3.5 items-center mb-4.5">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" />
          <AvatarFallback>
            {doctor.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-serif text-lg text-foreground leading-tight tracking-tight">
            {doctor.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {doctor.specialty}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Summary Details */}
      <div className="space-y-3">
        <SummaryRow 
          label="Date" 
          value={selectedDate ? formatDateLong(selectedDate) : '—'} 
        />
        <SummaryRow 
          label="Time" 
          value={formatTime(selectedTime)} 
        />
        <SummaryRow 
          label="Type" 
          value={visitType} 
        />
        <SummaryRow 
          label="Duration" 
          value="30 minutes" 
        />
        <SummaryRow 
          label="Cost" 
          value="Covered by plan" 
        />
      </div>

      {/* Reason */}
      {reason && (
        <>
          <Separator className="my-3" />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
              Reason
            </div>
            <div className="text-sm text-foreground leading-relaxed">
              {reason}
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

interface SummaryRowProps {
  label: string
  value: string
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between items-baseline gap-3.5">
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
      <div className="text-sm text-foreground font-medium text-right">
        {value}
      </div>
    </div>
  )
}