'use client';

import { Task } from '@/types/task';
import { CheckCircle2, Circle, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdateTitle }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleUpdate = () => {
    if (newTitle.trim() !== '' && newTitle !== task.title) {
      onUpdateTitle(task.id, newTitle);
    }
    setIsEditing(false);
  };

  const formattedDate = new Date(task.createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group flex items-center gap-4 p-4 glass rounded-xl transition-all hover:bg-white/10 hover:shadow-xl hover:shadow-primary/5 border-l-4 border-l-transparent hover:border-l-primary"
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className="flex-shrink-0 transition-transform active:scale-90"
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/10" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      <div className="flex-grow min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            autoFocus
            className="w-full bg-secondary/50 border border-primary/30 rounded px-2 py-1 outline-none text-foreground"
          />
        ) : (
          <div className="flex flex-col">
            <span
              className={`block truncate text-lg transition-all ${
                task.completed ? 'text-muted-foreground line-through opacity-60' : 'text-foreground font-medium'
              }`}
            >
              {task.title}
            </span>
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-tighter">
              Added at {formattedDate}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Edit title"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 hover:bg-red-500/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
