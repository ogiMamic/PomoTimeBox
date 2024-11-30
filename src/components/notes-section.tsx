'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, GripVertical } from 'lucide-react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { TagSelector } from './tag-selector'

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  content: string;
  completed: boolean;
  tags: Tag[];
}

interface NotesSectionProps {
  notes: Task[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
  onTaskSelect: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  selectedTask: Task | null;
  availableTags: Tag[];
  language: {
    notes: string;
    addNote: string;
    add: string;
  };
}

const DraggableNote: React.FC<{ 
  task: Task; 
  onDelete: () => void; 
  onSelect: () => void;
  onTagToggle: (tag: Tag) => void;
  isSelected: boolean;
  availableTags: Tag[];
}> = ({ task, onDelete, onSelect, onTagToggle, isSelected, availableTags }) => {
  const [{ isDragging }, drag] = useDrag<Task, unknown, { isDragging: boolean }>(() => ({
    type: 'task',
    item: task,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex flex-col p-2 bg-card rounded-md ${
        isDragging ? 'opacity-50' : ''
      } ${isSelected ? 'ring-2 ring-primary' : ''} ${
        task.completed ? 'line-through text-muted-foreground' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 cursor-move text-muted-foreground" />
          <span>{task.content}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {task.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-2 py-1 text-xs rounded-full"
            style={{ backgroundColor: tag.color, color: '#fff' }}
          >
            {tag.name}
          </span>
        ))}
        <TagSelector
          availableTags={availableTags}
          selectedTags={task.tags}
          onTagToggle={onTagToggle}
        />
      </div>
    </div>
  )
}

export function NotesSection({ 
  notes, 
  onAddNote, 
  onDeleteNote, 
  onTaskSelect, 
  onTaskUpdate,
  selectedTask, 
  availableTags,
  language 
}: NotesSectionProps) {
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim())
      setNewNote('')
    }
  }

  const handleTagToggle = (task: Task, tag: Tag) => {
    const updatedTags = task.tags.some(t => t.id === tag.id)
      ? task.tags.filter(t => t.id !== tag.id)
      : [...task.tags, tag];
    onTaskUpdate(task.id, { tags: updatedTags });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language.notes}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={language.addNote}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <Button onClick={handleAddNote}>{language.add}</Button>
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <DraggableNote
              key={note.id}
              task={note}
              onDelete={() => onDeleteNote(note.id)}
              onSelect={() => onTaskSelect(note)}
              onTagToggle={(tag) => handleTagToggle(note, tag)}
              isSelected={selectedTask?.id === note.id}
              availableTags={availableTags}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}