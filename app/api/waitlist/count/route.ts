import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.user.count();

    return NextResponse.json(
      { count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return NextResponse.json(
      { error: "Failed to get waitlist count", count: 0 },
      { status: 500 }
    );
  }
}
