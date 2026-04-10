'use client';

import { useState, useEffect, useMemo } from 'react';
import { Task } from '@/types/task';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import { ListTodo, CheckCircle2, Circle, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Could not load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task added successfully!');
    } catch (err) {
      showToast('Failed to add task.', 'error');
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      );
      if (completed) showToast('Task completed! 🎉');
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const updateTaskTitle = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to update title');
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title } : t))
      );
      showToast('Title updated.');
    } catch (err) {
      showToast('Failed to update title.', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task deleted.');
    } catch (err) {
      showToast('Failed to delete task.', 'error');
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    try {
      await Promise.all(completedTasks.map(t => fetch(`/api/tasks/${t.id}`, { method: 'DELETE' })));
      setTasks(prev => prev.filter(t => !t.completed));
      showToast(`Cleared ${completedTasks.length} tasks.`);
    } catch (err) {
      showToast('Failed to clear some tasks.', 'error');
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  }, [sortedTasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, active: total - completed };
  }, [tasks]);

  return (
    <main className="min-h-screen py-12 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background text-foreground">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Master your flow</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Focus on what <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">matters</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            A premium experience for your daily productivity.
          </p>
        </div>

        {/* Stats Card */}
        <motion.div 
          layout
          className="grid grid-cols-3 gap-4 p-6 glass rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Total</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-3xl font-bold text-primary">{stats.active}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Done</div>
          </div>
        </motion.div>

        {/* Task Input */}
        <TaskForm onAdd={addTask} />

        {/* Filters & Actions */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex gap-4">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm font-semibold capitalize transition-all pb-2 -mb-[9px] border-b-2 px-1 ${
                  filter === f ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear completed
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-3 min-h-[300px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-muted-foreground"
              >
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm">Fetching tasks...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-destructive space-y-2 glass rounded-2xl"
              >
                <AlertCircle className="w-10 h-10" />
                <p>{error}</p>
                <button 
                  onClick={fetchTasks}
                  className="text-sm underline hover:text-destructive/80"
                >
                  Try again
                </button>
              </motion.div>
            ) : filteredTasks.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4 glass rounded-2xl border-dashed border-white/5"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  {filter === 'completed' ? <CheckCircle2 className="w-8 h-8 opacity-20" /> : <ListTodo className="w-8 h-8 opacity-20" />}
                </div>
                <p className="text-sm font-medium">
                  {filter === 'all' 
                    ? "Your board is clear." 
                    : filter === 'active' 
                      ? "Zero active tasks. Rest time!" 
                      : "No completed tasks yet."}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onUpdateTitle={updateTaskTitle}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-[10px] text-muted-foreground/30 uppercase tracking-[0.3em]">
        Task Manager Pro • Experience Refined
      </footer>
    </main>
  );
}
