"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Filter, CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import InstallPrompt from '@/components/InstallPrompt';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const { toast } = useToast();

  // Load todos from API on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(
          data.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a todo item",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTodo.trim() }),
      });

      if (response.ok) {
        const newTodoItem = await response.json();
        setTodos([newTodoItem, ...todos]);
        setNewTodo("");
        toast({
          title: "Success",
          description: "Todo added successfully",
        });
      } else {
        throw new Error("Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      } else {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast({
          title: "Success",
          description: "Todo deleted successfully",
        });
      } else {
        throw new Error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    if (!editingTodo || editText.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a todo item",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText.trim() }),
      });

      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === editingTodo.id
              ? { ...todo, text: editText.trim() }
              : todo
          )
        );
        setEditingTodo(null);
        setEditText("");
        toast({
          title: "Success",
          description: "Todo updated successfully",
        });
      } else {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
          <p className="text-muted-foreground">Stay organized and productive</p>
        </div>

        {/* Add Todo Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold">{todos.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-600">
                {activeCount}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-600">
                {completedCount}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <Card>
          <CardContent className="p-3">
            <div className="flex gap-2 justify-center">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="flex-1"
              >
                All ({todos.length})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
                className="flex-1"
              >
                Active ({activeCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
                className="flex-1"
              >
                Completed ({completedCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Tasks
              <Badge variant="secondary">{filteredTodos.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === "all"
                    ? "No todos yet. Add one above!"
                    : filter === "active"
                    ? "No active todos"
                    : "No completed todos"}
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      todo.completed ? "bg-muted/50" : "bg-card"
                    }`}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          todo.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {todo.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(todo.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEdit(todo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Todo</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && saveEdit()
                              }
                              placeholder="Edit todo..."
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={() => setEditingTodo(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={saveEdit}>Save</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clear Completed Button */}
        {completedCount > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              try {
                const response = await fetch("/api/todos/clear-completed", {
                  method: "POST",
                });

                if (response.ok) {
                  setTodos(todos.filter((todo) => !todo.completed));
                  toast({
                    title: "Success",
                    description: "Completed todos cleared",
                  });
                } else {
                  throw new Error("Failed to clear completed todos");
                }
              } catch (error) {
                console.error("Error clearing completed todos:", error);
                toast({
                  title: "Error",
                  description: "Failed to clear completed todos",
                  variant: "destructive",
                });
              }
            }}
          >
            Clear Completed ({completedCount})
          </Button>
        )}
      </div>
      <InstallPrompt />
    </div>
  );
}
