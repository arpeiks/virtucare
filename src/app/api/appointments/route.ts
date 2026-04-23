import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appointment, doctor } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parse, isBefore } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorIdParam = searchParams.get("doctorId");

    if (doctorIdParam) {
      const rows = await db
        .select({
          date: appointment.date,
          time: appointment.time,
        })
        .from(appointment)
        .where(
          and(
            eq(appointment.doctorId, doctorIdParam),
            eq(appointment.status, "confirmed")
          )
        );
      return NextResponse.json(rows);
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
        visitType: appointment.visitType,
        status: appointment.status,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        doctorId: appointment.doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorSubspecialty: doctor.subspecialty,
        doctorImageUrl: doctor.imageUrl,
      })
      .from(appointment)
      .innerJoin(doctor, eq(appointment.doctorId, doctor.id))
      .where(eq(appointment.userId, session.user.id))
      .orderBy(appointment.date, appointment.time);

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { doctorId, date, time, reason, visitType } = body;

    if (!doctorId || !date || !time || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appointmentDateTime = parse(
      `${date} ${time}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    if (isBefore(appointmentDateTime, new Date())) {
      return NextResponse.json({ error: "Cannot book an appointment in the past" }, { status: 400 });
    }

    const [conflict] = await db
      .select({ id: appointment.id })
      .from(appointment)
      .where(
        and(
          eq(appointment.doctorId, doctorId),
          eq(appointment.date, date),
          eq(appointment.time, time),
          eq(appointment.status, "confirmed")
        )
      )
      .limit(1);

    if (conflict) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another time." },
        { status: 409 }
      );
    }

    const id = `appt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const [created] = await db
      .insert(appointment)
      .values({
        id,
        userId: session.user.id,
        doctorId,
        date,
        time,
        reason,
        visitType: visitType ?? "Video visit",
        status: "confirmed",
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
