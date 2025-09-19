import { NextResponse } from "next/server";
import { todos, updateTodo, deleteTodo } from "@/lib/mock-data";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { text, completed } = await request.json();
    const todo = todos.find(t => t.id === params.id);
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    updateTodo(params.id, {
      text: text || todo.text,
      completed: completed !== undefined ? completed : todo.completed,
    });
    
    const updatedTodo = todos.find(t => t.id === params.id);
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const todo = todos.find(t => t.id === params.id);
    
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    
    deleteTodo(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}