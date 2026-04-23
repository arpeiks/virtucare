"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, Calendar, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type BookedSlot = { date: string; time: string };

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function availableSlotsForDate(
  date: Date,
  slotsByDay: Record<number, string[]>,
  bookedSet: Set<string>
): string[] {
  const all = slotsByDay[date.getDay()] ?? [];
  const dateStr = toDateStr(date);
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = date.toDateString() === today.toDateString();

  return all.filter((slot) => {
    if (bookedSet.has(`${dateStr}|${slot}`)) return false;
    if (isToday) {
      const [h, m] = slot.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(h, m, 0, 0);
      if (slotTime <= now) return false;
    }
    return true;
  });
}

function hasAvailableSlotOnDate(
  date: Date,
  slotsByDay: Record<number, string[]>,
  bookedSet: Set<string>
): boolean {
  return availableSlotsForDate(date, slotsByDay, bookedSet).length > 0;
}

function hasAvailableSlotWithinDays(
  slotsByDay: Record<number, string[]>,
  bookedSet: Set<string>,
  days: number
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (hasAvailableSlotOnDate(d, slotsByDay, bookedSet)) return true;
  }
  return false;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subspecialty: string | null;
  bio: string | null;
  imageUrl: string | null;
  rating: string;
  reviews: number;
  years: number;
  location: string;
  nextAvailable: string;
  slotsByDay: Record<number, string[]>;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SelectOption {
  v: string;
  l: string;
}

function SelectChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: (string | SelectOption)[];
  onChange: (v: string) => void;
}) {
  const opts: SelectOption[] = options.map((o) =>
    typeof o === "string" ? { v: o, l: o } : o
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-[42px] px-3.5 bg-background border border-border rounded-[10px] text-[13px] text-foreground",
          "hover:border-ring/80 transition-colors gap-1.5 w-auto"
        )}
      >
        <span className="text-muted-foreground">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {opts.map((o) => (
          <SelectItem key={o.v} value={o.v}>
            {o.l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DoctorCard({
  doctor,
  bookedSlots,
  onView,
  onBook,
}: {
  doctor: Doctor;
  bookedSlots: BookedSlot[];
  onView: () => void;
  onBook: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const bookedSet = useMemo(
    () => new Set(bookedSlots.map((s) => `${s.date}|${s.time}`)),
    [bookedSlots]
  );

  const todaysSlots = availableSlotsForDate(today, doctor.slotsByDay, bookedSet);
  const tomorrowSlots = availableSlotsForDate(tomorrow, doctor.slotsByDay, bookedSet);
  const displaySlots = todaysSlots.length > 0 ? todaysSlots : tomorrowSlots;
  const slotsLabel = todaysSlots.length > 0 ? "Today" : "Tomorrow";

  const locationCity = doctor.location
    ? doctor.location.includes("•")
      ? doctor.location.split("•")[1]?.trim()
      : doctor.location
    : null;

  return (
    <Card
      className="cursor-pointer hover:border-ring/60 hover:shadow-md transition-all duration-150 overflow-hidden p-0"
      onClick={onView}
    >
      <div className="p-6">
        <div className="flex gap-4">
          <Avatar size="lg" className="size-14 shrink-0">
            {doctor.imageUrl && <AvatarImage src={doctor.imageUrl} alt={doctor.name} />}
            <AvatarFallback className="text-sm font-medium bg-secondary text-secondary-foreground">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-serif text-[22px] text-foreground leading-tight tracking-tight">
                  {doctor.name}
                </div>
                <div className="text-[13px] text-muted-foreground mt-1">
                  {doctor.specialty}
                  {doctor.subspecialty ? ` · ${doctor.subspecialty}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[13px] text-foreground shrink-0">
                <Star className="size-3.5 fill-primary text-primary" />
                <span className="font-medium">{doctor.rating}</span>
                <span className="text-muted-foreground">({doctor.reviews})</span>
              </div>
            </div>

            <div className="flex gap-3 mt-2.5 text-[12px] text-muted-foreground">
              {doctor.years > 0 && <span>{doctor.years} yrs experience</span>}
              {doctor.years > 0 && locationCity && <span>·</span>}
              {locationCity && <span>{locationCity}</span>}
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-5" />

        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
            {slotsLabel}
          </div>
          {displaySlots.length > 4 && (
            <div className="text-[12px] text-muted-foreground">
              +{displaySlots.length - 4} more
            </div>
          )}
        </div>

        {displaySlots.length === 0 ? (
          <div className="text-[13px] text-muted-foreground py-2.5">
            No openings {slotsLabel.toLowerCase()} —{" "}
            <span className="text-primary">see full schedule</span>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {displaySlots.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  onBook();
                }}
                className="px-3 py-2 border border-border rounded-lg text-[13px] text-foreground bg-background hover:border-primary hover:bg-secondary transition-colors duration-150 cursor-pointer"
              >
                {formatTime(s)}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2.5 mt-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            View profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
          >
            Book appointment
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-16 bg-card border border-dashed border-ring rounded-xl text-center">
      <div className="size-14 rounded-full bg-background grid place-items-center text-muted-foreground">
        <Calendar className="size-6" />
      </div>
      <div className="font-serif text-2xl text-foreground tracking-tight">{title}</div>
      <div className="text-[14px] text-muted-foreground max-w-md leading-relaxed">{body}</div>
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}

function DoctorCardSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="size-14 rounded-full bg-muted shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="h-3.5 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
      <div className="h-px bg-border my-5" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="flex gap-2.5 mt-5">
        <div className="h-[34px] w-28 bg-muted rounded-[10px]" />
        <div className="h-[34px] w-36 bg-muted rounded-[10px]" />
      </div>
    </Card>
  );
}

const SPECIALTIES_PLACEHOLDER = ["All specialties"];

export function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlotsByDoctor, setBookedSlotsByDoctor] = useState<
    Record<string, BookedSlot[]>
  >({});

  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [availability, setAvailability] = useState("anytime");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/doctors");
        const data: Doctor[] = await r.json();

        const entries = await Promise.all(
          data.map(async (d) => {
            try {
              const res = await fetch(`/api/appointments?doctorId=${d.id}`);
              if (!res.ok) return [d.id, []] as [string, BookedSlot[]];
              const slots: BookedSlot[] = await res.json();
              return [d.id, slots] as [string, BookedSlot[]];
            } catch {
              return [d.id, []] as [string, BookedSlot[]];
            }
          })
        );

        setDoctors(data);
        setBookedSlotsByDoctor(Object.fromEntries(entries));
      } catch {
        setError("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const specialties = useMemo(() => {
    const unique = Array.from(new Set(doctors.map((d) => d.specialty)));
    return ["All specialties", ...unique.sort()];
  }, [doctors]);

  const availableToday = useMemo(
    () =>
      doctors.filter((d) => {
        const bookedSet = new Set(
          (bookedSlotsByDoctor[d.id] ?? []).map((s) => `${s.date}|${s.time}`)
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return hasAvailableSlotOnDate(today, d.slotsByDay, bookedSet);
      }).length,
    [doctors, bookedSlotsByDoctor]
  );

  const filtered = useMemo(() => {
    let list = doctors.filter((d) => {
      if (specialty !== "All specialties" && d.specialty !== specialty)
        return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.specialty.toLowerCase().includes(q) &&
          !(d.subspecialty ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      if (availability === "today" || availability === "week") {
        const bookedSet = new Set(
          (bookedSlotsByDoctor[d.id] ?? []).map((s) => `${s.date}|${s.time}`)
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (availability === "today") {
          if (!hasAvailableSlotOnDate(today, d.slotsByDay, bookedSet))
            return false;
        } else {
          if (!hasAvailableSlotWithinDays(d.slotsByDay, bookedSet, 7))
            return false;
        }
      }
      return true;
    });

    if (sort === "rating")
      list = [...list].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    if (sort === "experience")
      list = [...list].sort((a, b) => b.years - a.years);
    if (sort === "availability")
      list = [...list].sort((a) => (a.nextAvailable === "Today" ? -1 : 1));

    return list;
  }, [doctors, query, specialty, availability, sort]);

  const clearFilters = () => {
    setQuery("");
    setSpecialty("All specialties");
    setAvailability("anytime");
  };

  return (
    <div className="px-10 py-8 pb-16 max-w-[1360px] mx-auto">
      <div className="flex items-end justify-between gap-10 mb-8">
        <div className="max-w-2xl">
          <div className="text-[12px] tracking-widest uppercase text-primary mb-3 font-medium">
            Book a visit
          </div>
          <h1 className="font-serif text-[52px] leading-[1.05] font-normal text-foreground tracking-tight m-0">
            Find the right doctor,
            <br />
            <em className="italic text-primary not-italic">on your schedule.</em>
          </h1>
          <p className="text-[15px] text-muted-foreground mt-4 max-w-lg leading-relaxed">
            Board-certified physicians across primary care and specialties. Most
            patients are seen within 24 hours.
          </p>
        </div>

        {!loading && availableToday > 0 && (
          <Badge
            variant="secondary"
            className="h-7 px-3 text-[13px] gap-1.5 text-success border-success/20 bg-success/10 shrink-0"
          >
            <span className="size-1.5 rounded-full bg-success inline-block" />
            {availableToday} available today
          </Badge>
        )}
      </div>

      <div className="flex gap-3 items-center p-3 bg-card border border-border rounded-[14px] mb-5 flex-wrap">
        <div className="flex-1 min-w-[280px] flex items-center gap-2.5 px-3.5 h-[42px] bg-background border border-border rounded-[10px] focus-within:border-ring transition-colors">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or specialty"
            className="flex-1 border-none bg-transparent outline-none text-[14px] text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <SelectChip
          label="Specialty"
          value={specialty}
          options={loading ? SPECIALTIES_PLACEHOLDER : specialties}
          onChange={setSpecialty}
        />
        <SelectChip
          label="Available"
          value={availability}
          options={[
            { v: "anytime", l: "Anytime" },
            { v: "today", l: "Today" },
            { v: "week", l: "This week" },
          ]}
          onChange={setAvailability}
        />
        <SelectChip
          label="Sort"
          value={sort}
          options={[
            { v: "rating", l: "Top rated" },
            { v: "experience", l: "Most experience" },
            { v: "availability", l: "Soonest" },
          ]}
          onChange={setSort}
        />
      </div>

      {!loading && !error && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-[13px] text-muted-foreground">
            <span className="text-foreground font-medium">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "doctor" : "doctors"} match your filters
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-[14px] text-destructive text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              title="No doctors match your filters"
              body="Try broadening your search or clearing filters to see more options."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4">
              {filtered.map((d) => (
                <DoctorCard
                  key={d.id}
                  doctor={d}
                  bookedSlots={bookedSlotsByDoctor[d.id] ?? []}
                  onView={() => router.push(`/doctors/${d.id}`)}
                  onBook={() => router.push(`/booking?doctorId=${d.id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
