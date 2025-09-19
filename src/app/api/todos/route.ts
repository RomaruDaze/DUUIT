import { NextResponse } from "next/server";
import { todos, addTodo } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const newTodo = {
      id: Date.now().toString(),
      text: text || "New todo",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTodo(newTodo);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
