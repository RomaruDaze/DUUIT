import {
  ref,
  push,
  set,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "./firebase";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // Keep as string for Firebase
  updatedAt: string;
  userId: string;
}

export class TodoService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Get user's todos reference
  private getUserTodosRef() {
    return ref(database, `todos/${this.userId}`);
  }

  // Get specific todo reference
  private getTodoRef(todoId: string) {
    return ref(database, `todos/${this.userId}/${todoId}`);
  }

  // Listen to todos changes
  onTodosChange(callback: (todos: Todo[]) => void) {
    const todosRef = this.getUserTodosRef();

    const unsubscribe = onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      const todos: Todo[] = data ? Object.values(data) : [];
      callback(todos);
    });

    return unsubscribe;
  }

  // Add a new todo
  async addTodo(text: string): Promise<string> {
    const todosRef = this.getUserTodosRef();
    const newTodoRef = push(todosRef);

    const todo: Todo = {
      id: newTodoRef.key!,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(), // Store as ISO string
      updatedAt: new Date().toISOString(),
      userId: this.userId,
    };

    await set(newTodoRef, todo);
    return newTodoRef.key!;
  }

  // Update a todo
  async updateTodo(todoId: string, updates: Partial<Todo>): Promise<void> {
    const todoRef = this.getTodoRef(todoId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await set(todoRef, updateData);
  }

  // Delete a todo
  async deleteTodo(todoId: string): Promise<void> {
    const todoRef = this.getTodoRef(todoId);
    await remove(todoRef);
  }

  // Toggle todo completion
  async toggleTodo(todoId: string, completed: boolean): Promise<void> {
    const todoRef = this.getTodoRef(todoId);

    // Get the current todo data first
    const currentTodo = await this.getTodo(todoId);
    if (!currentTodo) {
      throw new Error("Todo not found");
    }

    // Update with all existing data plus the new completed status
    await this.updateTodo(todoId, {
      ...currentTodo,
      completed,
      updatedAt: new Date().toISOString(),
    });
  }

  // Add a helper method to get a single todo
  private async getTodo(todoId: string): Promise<Todo | null> {
    const todoRef = this.getTodoRef(todoId);
    return new Promise((resolve) => {
      onValue(
        todoRef,
        (snapshot) => {
          const data = snapshot.val();
          resolve(data ? { ...data, id: todoId } : null);
        },
        { onlyOnce: true }
      );
    });
  }

  // Clear completed todos
  async clearCompleted(): Promise<void> {
    const todosRef = this.getUserTodosRef();
    const completedQuery = query(
      todosRef,
      orderByChild("completed"),
      equalTo(true)
    );

    onValue(
      completedQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.keys(data).forEach((todoId) => {
            remove(ref(database, `todos/${this.userId}/${todoId}`));
          });
        }
      },
      { onlyOnce: true }
    );
  }
}
