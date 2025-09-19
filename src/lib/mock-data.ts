// Shared mock data store
export let todos = [
  {
    id: "1",
    text: "Welcome to DUIT!",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const addTodo = (todo: any) => {
  todos.push(todo);
};

export const updateTodo = (id: string, updates: any) => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const deleteTodo = (id: string) => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
};

export const clearCompleted = () => {
  todos = todos.filter((todo) => !todo.completed);
};
