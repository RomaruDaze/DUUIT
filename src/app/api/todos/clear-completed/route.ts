import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Delete all completed todos
    const result = await db.todo.deleteMany({
      where: {
        completed: true,
      },
    });

    return NextResponse.json({ 
      message: "Completed todos cleared successfully",
      count: result.count 
    });
  } catch (error) {
    console.error("Error clearing completed todos:", error);
    return NextResponse.json(
      { error: "Failed to clear completed todos" },
      { status: 500 }
    );
  }
}