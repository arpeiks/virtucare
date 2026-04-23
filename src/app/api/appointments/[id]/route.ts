import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appointment } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { date, time, reason, visitType, status } = body;

    const [updated] = await db
      .update(appointment)
      .set({
        ...(date && { date }),
        ...(time && { time }),
        ...(reason && { reason }),
        ...(visitType && { visitType }),
        ...(status && { status }),
        updatedAt: new Date(),
      })
      .where(
        and(eq(appointment.id, id), eq(appointment.userId, session.user.id))
      )
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [deleted] = await db
      .delete(appointment)
      .where(
        and(eq(appointment.id, id), eq(appointment.userId, session.user.id))
      )
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}
