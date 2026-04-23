import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { doctor } from "@/lib/db/schema";

export async function GET() {
  try {
    const doctors = await db.select().from(doctor);
    return NextResponse.json(
      doctors.map((d) => ({
        ...d,
        slotsByDay: JSON.parse(d.slotsByDay) as Record<number, string[]>,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
