import { NextResponse } from 'next/server';

// Mock data - in a real app, this would be in a database
let todos = [
  { 
    id: '1', 
    text: 'Welcome to DUIT!', 
    completed: false, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function POST() {
  try {
    todos = todos.filter(todo => !todo.completed);
    return NextResponse.json({ success: true, count: todos.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear completed todos' }, { status: 500 });
  }
}