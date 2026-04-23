import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { doctor } from "@/lib/db/schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [found] = await db.select().from(doctor).where(eq(doctor.id, id));
    if (!found) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...found,
      slotsByDay: JSON.parse(found.slotsByDay) as Record<number, string[]>,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 });
  }
}
