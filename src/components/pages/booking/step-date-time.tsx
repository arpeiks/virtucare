"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Hidden from "@/components/control/hidden"
import { Ternary } from "@/components/control/ternary"

interface Doctor {
  id: string
  name: string
  specialty: string
  slotsByDay: Record<number, string[]>
}

interface StepDateTimeProps {
  doctor: Doctor
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  slotStyle?: 'chips' | 'list'
  bookedSlots?: { date: string; time: string }[]
}

const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const sameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString()
}

const formatDateShort = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

export function StepDateTime({
  doctor,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  slotStyle = 'chips',
  bookedSlots = []
}: StepDateTimeProps) {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const days = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const bookedSet = new Set(bookedSlots.map(s => `${s.date}|${s.time}`))

  const toDateStr = (date: Date) => format(date, "yyyy-MM-dd")

  const slotsForDate = (date: Date): { time: string; disabled: boolean; reason?: string }[] => {
    const all = doctor.slotsByDay[date.getDay()] || []
    const dateStr = toDateStr(date)
    const now = new Date()
    const isToday = sameDay(date, today)

    return all.map(slot => {
      if (bookedSet.has(`${dateStr}|${slot}`)) {
        return { time: slot, disabled: true, reason: 'booked' }
      }
      if (isToday) {
        const [h, m] = slot.split(':').map(Number)
        const slotTime = new Date(date)
        slotTime.setHours(h, m, 0, 0)
        if (slotTime <= now) {
          return { time: slot, disabled: true, reason: 'past' }
        }
      }
      return { time: slot, disabled: false }
    })
  }

  const availableCount = (date: Date) => slotsForDate(date).filter(s => !s.disabled).length

  const canGoBack = weekStart > today

  return (
    <div>
      <h2 className="font-serif text-[28px] text-foreground mb-0 font-normal tracking-tight">
        Pick a date
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5">
        Available in the next two weeks. All times in your local time zone.
      </p>

      <div className="flex items-center justify-between mt-6 mb-3">
        <div className="text-sm text-muted-foreground">
          {formatDateShort(days[0])} — {formatDateShort(days[days.length - 1])}
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            disabled={!canGoBack}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.slice(0, 7).map(date => {
          const avail = availableCount(date)
          const isSelected = selectedDate ? sameDay(selectedDate, date) : false
          const isPast = date < today && !sameDay(date, today)
          const isDisabled = isPast || avail === 0

          return (
            <DayCell
              key={date.toISOString()}
              date={date}
              slots={avail}
              selected={isSelected}
              disabled={isDisabled}
              onClick={() => {
                setSelectedDate(date)
                setSelectedTime('')
              }}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.slice(7, 14).map(date => {
          const avail = availableCount(date)
          const isSelected = selectedDate ? sameDay(selectedDate, date) : false
          const isPast = date < today && !sameDay(date, today)
          const isDisabled = isPast || avail === 0

          return (
            <DayCell
              key={date.toISOString()}
              date={date}
              slots={avail}
              selected={isSelected}
              disabled={isDisabled}
              onClick={() => {
                setSelectedDate(date)
                setSelectedTime('')
              }}
            />
          )
        })}
      </div>

      <div className="mt-8">
        <h3 className="font-serif text-[22px] text-foreground mb-0 font-normal tracking-tight">
          {selectedDate 
            ? `Available times · ${formatDateLong(selectedDate)}`
            : 'Select a date to see times'
          }
        </h3>

        <Ternary condition={!!selectedDate}>
          {selectedDate ? (
          (() => {
            const slots = slotsForDate(selectedDate)
            const allDisabled = slots.every(s => s.disabled)
            
            if (slots.length === 0) {
              return (
                <div className="mt-4 py-6 text-sm text-muted-foreground">
                  No appointments available on this day. Try another date.
                </div>
              )
            }

            if (allDisabled) {
              return (
                <>
                  <div className="mt-4 py-3 text-sm text-muted-foreground">
                    All slots on this day are unavailable. Try another date.
                  </div>
                  <Ternary condition={slotStyle === 'list'}>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {slots.map(({ time: slot }) => (
                        <button
                          key={slot}
                          disabled
                          className="p-3.5 text-left border rounded-lg text-sm flex justify-between items-center border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                        >
                          <span>{formatTime(slot)}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-2">
                      {slots.map(({ time: slot }) => (
                        <button
                          key={slot}
                          disabled
                          className="p-3 border rounded-lg text-sm font-medium border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  </Ternary>
                </>
              )
            }

            if (slotStyle === 'list') {
              return (
                <div className="mt-4 flex flex-col gap-1.5">
                  {slots.map(({ time: slot, disabled }) => (
                    <button
                      key={slot}
                      onClick={() => !disabled && setSelectedTime(slot)}
                      disabled={disabled}
                      className={cn(
                        "p-3.5 text-left border rounded-lg text-sm flex justify-between items-center transition-colors",
                        disabled
                          ? "border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                          : selectedTime === slot
                          ? "border-primary bg-primary/5 text-foreground cursor-pointer"
                          : "border-border bg-card hover:bg-muted/50 cursor-pointer"
                      )}
                    >
                      <span>{formatTime(slot)}</span>
                      <Hidden display={selectedTime === slot && !disabled}>
                        <Check size={16} className="text-primary" />
                      </Hidden>
                    </button>
                  ))}
                </div>
              )
            }

            return (
              <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-2">
                {slots.map(({ time: slot, disabled }) => (
                  <button
                    key={slot}
                    onClick={() => !disabled && setSelectedTime(slot)}
                    disabled={disabled}
                    className={cn(
                      "p-3 border rounded-lg text-sm font-medium transition-colors",
                      disabled
                        ? "border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                        : selectedTime === slot
                        ? "border-primary bg-primary text-primary-foreground cursor-pointer"
                        : "border-border bg-card hover:bg-muted/50 cursor-pointer"
                    )}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            )
          })()
          ) : null}
          <div className="mt-4 py-6 text-sm text-muted-foreground">
            Choose a day above to see open times.
          </div>
        </Ternary>
      </div>
    </div>
  )
}

interface DayCellProps {
  date: Date
  slots: number
  selected?: boolean
  disabled?: boolean
  onClick: () => void
}

function DayCell({ date, slots, selected, disabled, onClick }: DayCellProps) {
  const isToday = sameDay(date, new Date())

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-3.5 border rounded-lg cursor-pointer text-center flex flex-col items-center gap-1 transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : disabled
          ? "border-border bg-background text-muted-foreground opacity-55 cursor-not-allowed"
          : "border-border bg-card hover:bg-muted/50"
      )}
    >
      <div className={cn(
        "text-xs uppercase tracking-wider",
        selected ? "text-primary-foreground" : "text-muted-foreground"
      )}>
        {date.toLocaleDateString('en-US', { weekday: 'short' })}
      </div>
      <div className="font-serif text-[22px] leading-none">
        {date.getDate()}
      </div>
      <div className={cn(
        "text-xs mt-0.5",
        selected ? "text-primary-foreground" : "text-muted-foreground"
      )}>
        {isToday ? 'Today' : slots === 0 ? 'Full' : `${slots} open`}
      </div>
    </button>
  )
}