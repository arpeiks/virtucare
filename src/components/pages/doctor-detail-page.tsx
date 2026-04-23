"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Star,
  MapPin,
  Video,
  ArrowRight,
  Clock,
  GraduationCap,
  Languages,
  CalendarCheck,
  Briefcase,
} from "lucide-react";
import Hidden from "@/components/control/hidden";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subspecialty?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  rating: string;
  reviews: number;
  years: number;
  location: string;
  nextAvailable: string;
  slotsByDay: Record<number, string[]>;
}

function totalSlots(doctor: Doctor): number {
  return Object.values(doctor.slotsByDay).reduce(
    (sum, slots) => sum + slots.length,
    0
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function DoctorDetailSkeleton() {
  return (
    <div className="p-8 pb-16 max-w-[1100px] mx-auto">
      <Skeleton className="h-5 w-28 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        <div className="space-y-8">
          <div className="flex gap-5">
            <Skeleton className="h-[88px] w-[88px] rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-5 pt-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </div>
      <div className="text-sm text-foreground font-semibold mt-0.5">{value}</div>
    </div>
  );
}

interface DoctorDetailPageProps {
  doctorId: string;
}

export function DoctorDetailPage({ doctorId }: DoctorDetailPageProps) {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`);
        if (!res.ok) throw new Error("Doctor not found");
        const data = await res.json();
        setDoctor(data);
      } catch {
        setError("Could not load doctor information.");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [doctorId]);

  if (loading) return <DoctorDetailSkeleton />;

  if (error || !doctor) {
    return (
      <div className="p-8 max-w-[1100px] mx-auto">
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive mb-4">
          {error ?? "Doctor not found."}
        </div>
        <Button variant="ghost" className="gap-2" onClick={() => router.push("/")}>
          <ArrowLeft size={14} /> Back to doctors
        </Button>
      </div>
    );
  }

  const available = totalSlots(doctor);
  const locationCity = doctor.location.includes("•")
    ? doctor.location.split("•")[1].trim()
    : doctor.location;

  return (
    <div className="p-8 pb-16 max-w-[1100px] mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 -ml-1 mb-7 text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/")}
      >
        <ArrowLeft size={14} />
        All doctors
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        <div>
          <div className="flex gap-5 items-flex-start">
            <Avatar className="h-[88px] w-[88px] flex-shrink-0 text-xl font-medium">
              <AvatarImage src={doctor.imageUrl ?? ""} />
              <AvatarFallback className="text-xl font-medium">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2.5">
                <Badge variant="secondary">{doctor.specialty}</Badge>
                <Hidden display={doctor.nextAvailable === "Today"}>
                  <Badge
                    variant="outline"
                    className="border-success/40 text-success bg-success/10"
                  >
                    Available today
                  </Badge>
                </Hidden>
              </div>

              <h1 className="font-serif text-4xl text-foreground tracking-tight leading-[1.05] mb-1.5">
                {doctor.name}
              </h1>

              <Hidden display={!!doctor.subspecialty}>
                <p className="text-sm text-muted-foreground">
                  {doctor.subspecialty}
                </p>
              </Hidden>

              <div className="flex flex-wrap items-center gap-5 mt-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">
                    {doctor.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({doctor.reviews} reviews)
                  </span>
                </div>
                <Stat label="Experience" value={`${doctor.years} yrs`} />
                <Hidden display={!!locationCity}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">
                      {locationCity}
                    </span>
                  </div>
                </Hidden>
              </div>
            </div>
          </div>

          <Separator className="mt-8" />

          <Hidden display={!!doctor.bio}>
            <Section icon={Briefcase} title="About">
              <p className="text-sm text-foreground leading-relaxed">{doctor.bio}</p>
            </Section>
          </Hidden>

          <Section icon={CalendarCheck} title="Availability">
            <div className="flex flex-wrap gap-2">
              {available > 0 ? (
                <>
                  <Badge variant="outline" className="gap-1.5">
                    <Clock className="h-3 w-3" />
                    {available} open slots this week
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-success/40 text-success bg-success/10"
                  >
                    Next: {doctor.nextAvailable}
                  </Badge>
                </>
              ) : (
                <Badge variant="secondary">No availability this week</Badge>
              )}
            </div>
          </Section>
        </div>

        <div className="lg:sticky lg:top-5 h-fit">
          <Card>
            <CardContent className="p-6">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Next available
              </div>
              <div className="font-serif text-3xl text-foreground tracking-tight leading-tight">
                {doctor.nextAvailable}
              </div>

              <Separator className="my-5" />

              <div className="text-xs text-muted-foreground mb-3">
                Typical visit:{" "}
                <span className="text-foreground font-medium">
                  30 minutes · Video
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-muted rounded-lg border border-border mb-5">
                <Video className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">Secure video visit</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                disabled={available === 0}
                onClick={() =>
                  router.push(`/booking?doctorId=${doctor.id}`)
                }
              >
                Book appointment
                <ArrowRight size={16} />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Free cancellation up to 2 hours before
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
