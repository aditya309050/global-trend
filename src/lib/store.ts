import fs from 'fs';
import path from 'path';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'src/lib/tasks.json');

// Ensure the file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export function getTasks(): Task[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export function addTask(title: string): Task {
  const tasks = getTasks();
  const newTask: Task = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const initialLength = tasks.length;
  const filteredTasks = tasks.filter((t) => t.id !== id);
  
  if (filteredTasks.length === initialLength) return false;
  
  saveTasks(filteredTasks);
  return true;
}
