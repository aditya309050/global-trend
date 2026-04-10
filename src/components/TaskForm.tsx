'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || title.trim() === ''}
        className="h-12 px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
      >
        <Plus className="w-5 h-5" />
        <span>Add</span>
      </button>
    </form>
  );
}
