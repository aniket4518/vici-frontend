import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InputSchema } from "../zod/input";

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      // Validate with Zod
      const result = InputSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const { email } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new user with email only
    const user = await prisma.user.create({
      data: {
        email,
      },
    });

    return NextResponse.json(
      { message: "Successfully joined waitlist", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
