import { NextResponse } from "next/server";
import { todos, clearCompleted } from "@/lib/mock-data";

export async function POST() {
  try {
    const beforeCount = todos.length;
    clearCompleted();
    const afterCount = todos.length;
    return NextResponse.json({ 
      success: true, 
      deleted: beforeCount - afterCount 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear completed todos" }, { status: 500 });
  }
}