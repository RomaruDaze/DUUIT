import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const todos = await db.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const todo = await db.todo.create({
      data: {
        text: text.trim(),
        completed: false,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}