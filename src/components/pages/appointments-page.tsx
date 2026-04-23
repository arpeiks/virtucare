"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Plus,
  Stethoscope,
  Trash2,
  Edit,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Hidden from "@/components/control/hidden";
import { Ternary } from "@/components/control/ternary";

interface AppointmentRow {
  id: string;
  date: string;
  time: string;
  reason: string;
  visitType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorSubspecialty?: string | null;
  doctorImageUrl?: string | null;
}

function formatDateLong(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthShort(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
  });
}

function formatDayNum(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getDate();
}

function formatWeekday(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isUpcoming(dateStr: string, time: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes) >= new Date();
}

function hoursUntil(dateStr: string, time: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const dt = new Date(year, month - 1, day, hours, minutes);
  return (dt.getTime() - Date.now()) / (1000 * 60 * 60);
}

function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-8 bg-card border border-dashed border-ring/60 rounded-2xl text-center">
      <div className="size-14 rounded-full bg-muted grid place-items-center text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <div>
        <div className="font-serif text-2xl text-foreground tracking-tight mb-1.5">
          {title}
        </div>
        <div className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          {body}
        </div>
      </div>
      <Hidden display={!!action}><div className="mt-1">{action}</div></Hidden>
    </div>
  );
}

function AppointmentSkeleton() {
  return (
    <Card className="p-0 overflow-hidden animate-pulse">
      <div className="grid grid-cols-[140px_1fr_auto]">
        <div className="p-6 bg-muted border-r border-border" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="flex gap-3 items-center">
            <div className="size-9 rounded-full bg-muted" />
            <div className="space-y-1.5">
              <div className="h-5 bg-muted rounded w-40" />
              <div className="h-3 bg-muted rounded w-28" />
            </div>
          </div>
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>
        <div className="p-6 border-l border-border space-y-2 flex flex-col justify-center">
          <div className="h-[34px] w-28 bg-muted rounded-[10px]" />
          <div className="h-[34px] w-28 bg-muted rounded-[10px]" />
        </div>
      </div>
    </Card>
  );
}

function AppointmentCard({
  appt,
  isPast,
  onCancel,
  onReschedule,
}: {
  appt: AppointmentRow;
  isPast: boolean;
  onCancel?: () => void;
  onReschedule?: () => void;
}) {
  const router = useRouter();
  const cancelled = appt.status === "cancelled";
  const VisitIcon = appt.visitType === "Phone consult" ? Phone : Video;
  const hours = hoursUntil(appt.date, appt.time);
  const imminent = hours >= 0 && hours < 24 && !cancelled;

  return (
    <Card
      className={cn(
        "p-0 overflow-hidden transition-all duration-150",
        cancelled && "opacity-60",
        !isPast && "hover:shadow-md hover:border-ring/60"
      )}
    >
      <div className="grid grid-cols-[140px_1fr_auto]">
        <div
          className={cn(
            "p-6 flex flex-col justify-center items-center text-center border-r border-border rounded-l-xl",
            imminent
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground"
          )}
        >
          <div
            className={cn(
              "text-[11px] uppercase tracking-widest font-medium",
              imminent ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {formatMonthShort(appt.date)}
          </div>
          <div className="font-serif text-[44px] leading-none my-1 tracking-tight">
            {formatDayNum(appt.date)}
          </div>
          <div
            className={cn(
              "text-xs",
              imminent ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {formatWeekday(appt.date)}
          </div>
          <div
            className={cn(
              "text-[13px] font-medium mt-2",
              imminent ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {formatTime(appt.time)}
          </div>
        </div>

        <div className="p-5 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            {cancelled ? (
              <Badge variant="destructive" className="text-xs">
                Cancelled
              </Badge>
            ) : imminent ? (
              <Badge
                className="text-xs gap-1.5 bg-primary/10 text-primary border-primary/20"
                variant="outline"
              >
                <Clock className="size-3" />
                Starts soon
              </Badge>
            ) : isPast ? (
              <Badge variant="secondary" className="text-xs">
                Completed
              </Badge>
            ) : (
              <Badge
                className="text-xs gap-1.5 bg-success/10 text-success border-success/20"
                variant="outline"
              >
                <span className="size-1.5 rounded-full bg-success inline-block" />
                Confirmed
              </Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <VisitIcon className="size-3" />
              {appt.visitType} · 30 min
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <Avatar className="size-9 shrink-0">
              <Hidden display={!!appt.doctorImageUrl}>
                <AvatarImage src={appt.doctorImageUrl!} alt={appt.doctorName} />
              </Hidden>
              <AvatarFallback className="text-xs font-medium">
                {getInitials(appt.doctorName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-serif text-[19px] text-foreground leading-tight tracking-tight truncate">
                {appt.doctorName}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {appt.doctorSpecialty}
                {appt.doctorSubspecialty && ` · ${appt.doctorSubspecialty}`}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            <span className="text-subtle-foreground">Reason — </span>
            {appt.reason}
          </div>
        </div>

        <div className="p-5 flex flex-col justify-center gap-2 border-l border-border min-w-[148px]">
          <Hidden display={!isPast && !cancelled}>
            <>
              <Hidden display={imminent}>
                <Button variant="primary" size="sm" className="w-full gap-1.5">
                  <Video className="size-3.5" />
                  Join visit
                </Button>
              </Hidden>
              <Button
                variant="secondary"
                size="sm"
                className="w-full gap-1.5"
                onClick={onReschedule}
              >
                <Edit className="size-3.5" />
                Reschedule
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="w-full gap-1.5"
                onClick={onCancel}
              >
                <Trash2 className="size-3.5" />
                Cancel
              </Button>
            </>
          </Hidden>
          <Hidden display={isPast || cancelled}>
            <>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => router.push(`/booking?doctorId=${appt.doctorId}`)}
              >
                View doctor
              </Button>
              <Hidden display={!cancelled}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/booking?doctorId=${appt.doctorId}`)}
                >
                  Book again
                </Button>
              </Hidden>
            </>
          </Hidden>
        </div>
      </div>
    </Card>
  );
}

function CancelModal({
  appointment,
  open,
  onClose,
  onConfirm,
  cancelling,
}: {
  appointment: AppointmentRow | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cancelling: boolean;
}) {
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[460px]" showCloseButton={false}>
        <DialogHeader>
          <div className="size-12 rounded-full bg-destructive/10 grid place-items-center text-destructive mb-1">
            <Trash2 className="size-5" />
          </div>
          <DialogTitle className="font-serif text-[26px] font-normal tracking-tight text-foreground">
            Cancel this appointment?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            You&apos;re cancelling your{" "}
            <strong className="text-foreground font-medium">
              {formatTime(appointment.time)}
            </strong>{" "}
            visit with{" "}
            <strong className="text-foreground font-medium">
              {appointment.doctorName}
            </strong>{" "}
            on {formatDateLong(appointment.date)}. You won&apos;t be charged.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={onClose} disabled={cancelling}>
            Keep appointment
          </Button>
          <Button
            variant="dangerFilled"
            onClick={onConfirm}
            disabled={cancelling}
            className="gap-2"
          >
            <Trash2 className="size-3.5" />
            {cancelling ? "Cancelling…" : "Cancel appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TabBar({
  tab,
  setTab,
  upcomingCount,
  pastCount,
}: {
  tab: "upcoming" | "past";
  setTab: (t: "upcoming" | "past") => void;
  upcomingCount: number;
  pastCount: number;
}) {
  const tabs = [
    { id: "upcoming" as const, label: "Upcoming", count: upcomingCount },
    { id: "past" as const, label: "Past & cancelled", count: pastCount },
  ];

  return (
    <div className="flex gap-1 border-b border-border mb-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer",
            tab === t.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {t.label}
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[11px] font-medium",
              tab === t.id
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {t.count}
          </span>
        </button>
      ))}
    </div>
  );
}

export function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [confirmCancel, setConfirmCancel] = useState<AppointmentRow | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments");
      if (!res.ok) throw new Error("Failed to load appointments");
      const data = await res.json();
      setAppointments(data);
    } catch {
      setError("Could not load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelConfirm() {
    if (!confirmCancel) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/appointments/${confirmCancel.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to cancel");
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === confirmCancel.id ? { ...a, status: "cancelled" } : a
        )
      );
      setConfirmCancel(null);
    } catch {
    } finally {
      setCancelling(false);
    }
  }

  const upcoming = useMemo(
    () =>
      appointments.filter(
        (a) => a.status !== "cancelled" && isUpcoming(a.date, a.time)
      ),
    [appointments]
  );

  const past = useMemo(
    () =>
      appointments
        .filter(
          (a) => a.status === "cancelled" || !isUpcoming(a.date, a.time)
        )
        .sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }),
    [appointments]
  );

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="px-10 py-8 pb-16 max-w-[1100px] mx-auto">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-[12px] tracking-widest uppercase text-primary mb-2.5 font-medium">
            Your care
          </div>
          <h1 className="font-serif text-[44px] font-normal text-foreground tracking-tight leading-none m-0">
            Appointments
          </h1>
        </div>
        <Button
          variant="primary"
          size="md"
          className="gap-2 shrink-0"
          onClick={() => router.push("/")}
        >
          <Plus className="size-4" />
          Book new appointment
        </Button>
      </div>

      <Hidden display={!!error}>
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive mb-6">
          <AlertCircle className="size-4 shrink-0" />
          {error}
          <button
            onClick={fetchAppointments}
            className="ml-auto underline underline-offset-2 text-xs hover:no-underline"
          >
            Retry
          </button>
        </div>
      </Hidden>

      <Hidden display={loading}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <AppointmentSkeleton key={i} />
          ))}
        </div>
      </Hidden>

      <Hidden display={!loading && !error}>
        <>
          <TabBar
            tab={tab}
            setTab={setTab}
            upcomingCount={upcoming.length}
            pastCount={past.length}
          />

          <Ternary condition={list.length === 0}>
            <Ternary condition={tab === "upcoming"}>
              <EmptyState
                icon={Calendar}
                title="No appointments yet"
                body="Book your first visit with a VirtuCare doctor. Most patients are seen within 24 hours."
                action={
                  <Button
                    variant="primary"
                    size="md"
                    className="gap-2"
                    onClick={() => router.push("/")}
                  >
                    <Stethoscope className="size-4" />
                    Find a doctor
                  </Button>
                }
              />
              <EmptyState
                icon={Clock}
                title="No past appointments"
                body="Once you complete or cancel a visit, it will appear here."
              />
            </Ternary>
            <div className="flex flex-col gap-3">
              {list.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appt={appt}
                  isPast={tab === "past"}
                  onCancel={() => setConfirmCancel(appt)}
                  onReschedule={() =>
                    router.push(
                      `/booking?doctorId=${appt.doctorId}&editingId=${appt.id}&date=${appt.date}&time=${appt.time}`
                    )
                  }
                />
              ))}
            </div>
          </Ternary>
        </>
      </Hidden>

      <CancelModal
        appointment={confirmCancel}
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={handleCancelConfirm}
        cancelling={cancelling}
      />
    </div>
  );
}
