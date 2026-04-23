import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appointment, doctor } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
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
