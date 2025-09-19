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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { text, completed } = await request.json();
    const todoIndex = todos.findIndex(todo => todo.id === params.id);
    
    if (todoIndex === -1) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    todos[todoIndex] = {
      ...todos[todoIndex],
      text: text || todos[todoIndex].text,
      completed: completed !== undefined ? completed : todos[todoIndex].completed,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(todos[todoIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const todoIndex = todos.findIndex(todo => todo.id === params.id);
    
    if (todoIndex === -1) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    todos.splice(todoIndex, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}