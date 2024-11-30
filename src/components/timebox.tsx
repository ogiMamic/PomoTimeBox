'use client'

import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PrioritiesSection } from './priorities-section'
import { NotesSection } from './notes-section'
import { DailyCalendar } from './daily-calendar'
import { PomodoroTimer } from './pomodoro-timer'
import { TagSelector } from './tag-selector'
import { TaskAnalytics } from './task-analytics'

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
  duration?: number;
}

interface CalendarSlot {
  time: string;
  tasks: Task[];
}

const languages = {
  en: {
    title: "Timebox",
    save: "Save",
    language: "Language",
    priorities: {
      title: "Priorities",
      addPriority: "Add priority",
      add: "Add",
    },
    notes: {
      notes: "Notes",
      addNote: "Add a note",
      add: "Add",
    },
    pomodoro: {
      start: "Start",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      reset: "Reset",
    },
  },
  de: {
    title: "Zeitbox",
    save: "Speichern",
    language: "Sprache",
    priorities: {
      title: "Prioritäten",
      addPriority: "Priorität hinzufügen",
      add: "Hinzufügen",
    },
    notes: {
      notes: "Notizen",
      addNote: "Notiz hinzufügen",
      add: "Hinzufügen",
    },
    pomodoro: {
      start: "Start",
      pause: "Pause",
      resume: "Fortsetzen",
      stop: "Stopp",
      reset: "Zurücksetzen",
    },
  },
  sr: {
    title: "Временски оквир",
    save: "Сачувај",
    language: "Језик",
    priorities: {
      title: "Приоритети",
      addPriority: "Додај приоритет",
      add: "Додај",
    },
    notes: {
      notes: "Белешке",
      addNote: "Додај белешку",
      add: "Додај",
    },
    pomodoro: {
      start: "Почни",
      pause: "Пауза",
      resume: "Настави",
      stop: "Заустави",
      reset: "Ресетуј",
    },
  },
}

export default function Timebox() {
  const [priorities, setPriorities] = useState<string[]>([])
  const [notes, setNotes] = useState<Task[]>([])
  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [language, setLanguage] = useState<'en' | 'de' | 'sr'>('en')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const availableTags: Tag[] = [
    { id: '1', name: 'Work', color: '#ff0000' },
    { id: '2', name: 'Personal', color: '#00ff00' },
    { id: '3', name: 'Study', color: '#0000ff' },
    { id: '4', name: 'Health', color: '#ff00ff' },
  ]

  useEffect(() => {
    // Initialize calendar slots
    const slots: CalendarSlot[] = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({ time, tasks: [] })
      }
    }
    setCalendarSlots(slots)
  }, [])

  const handlePriorityChange = (newPriorities: string[]) => {
    setPriorities(newPriorities)
    setHasUnsavedChanges(true)
  }

  const handleAddNote = (content: string) => {
    const newNote: Task = { id: Date.now().toString(), content, completed: false, tags: [] }
    setNotes(prev => [...prev, newNote])
    setHasUnsavedChanges(true)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task)
  }

  const handleTaskDrop = (task: Task, time: string) => {
    setCalendarSlots(prev => prev.map(slot => 
      slot.time === time ? { ...slot, tasks: [...slot.tasks, task] } : slot
    ))
    setNotes(prev => prev.filter(note => note.id !== task.id))
    setHasUnsavedChanges(true)
  }

  const handleTaskMove = (taskId: string, fromTime: string, toTime: string) => {
    const task = calendarSlots.find(slot => slot.time === fromTime)?.tasks.find(t => t.id === taskId)
    if (task) {
      setCalendarSlots(prev => prev.map(slot => {
        if (slot.time === fromTime) {
          return { ...slot, tasks: slot.tasks.filter(t => t.id !== taskId) }
        }
        if (slot.time === toTime) {
          return { ...slot, tasks: [...slot.tasks, task] }
        }
        return slot
      }))
      setHasUnsavedChanges(true)
    }
  }

  const handleTaskComplete = (taskId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === taskId ? { ...note, completed: true } : note
    ))
    setCalendarSlots(prev => prev.map(slot => ({
      ...slot,
      tasks: slot.tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    })))
    setHasUnsavedChanges(true)
  }

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setNotes(prev => prev.map(note => 
      note.id === taskId ? { ...note, ...updates } : note
    ))
    setCalendarSlots(prev => prev.map(slot => ({
      ...slot,
      tasks: slot.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    })))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving data:', { priorities, notes, calendarSlots })
    setHasUnsavedChanges(false)
  }

  const filteredNotes = selectedTags.length > 0
    ? notes.filter(note => note.tags.some(tag => selectedTags.some(st => st.id === tag.id)))
    : notes

  const filteredCalendarSlots = selectedTags.length > 0
    ? calendarSlots.map(slot => ({
        ...slot,
        tasks: slot.tasks.filter(task => task.tags.some(tag => selectedTags.some(st => st.id === tag.id)))
      }))
    : calendarSlots

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full bg-background shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{languages[language].title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={language} onValueChange={(value: 'en' | 'de' | 'sr') => setLanguage(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={languages[language].language} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="sr">Српски</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
                {languages[language].save}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <PomodoroTimer 
                selectedTask={selectedTask} 
                onTaskComplete={handleTaskComplete}
                language={languages[language].pomodoro}
              />
              <TagSelector
                availableTags={availableTags}
                selectedTags={selectedTags}
                onTagToggle={(tag) => {
                  setSelectedTags(prev => 
                    prev.some(t => t.id === tag.id)
                      ? prev.filter(t => t.id !== tag.id)
                      : [...prev, tag]
                  )
                }}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <PrioritiesSection
                  priorities={priorities}
                  onPriorityChange={handlePriorityChange}
                  language={languages[language].priorities}
                />
                <NotesSection
                  notes={filteredNotes}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onTaskSelect={handleTaskSelect}
                  onTaskUpdate={handleTaskUpdate}
                  selectedTask={selectedTask}
                  availableTags={availableTags}
                  language={languages[language].notes}
                />
              </div>
              <div className="lg:col-span-2">
                <DailyCalendar
                  slots={filteredCalendarSlots}
                  onTaskDrop={handleTaskDrop}
                  onTaskMove={handleTaskMove}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskSelect={handleTaskSelect}
                  selectedTask={selectedTask}
                  availableTags={availableTags}
                />
              </div>
            </div>
            <TaskAnalytics tasks={[...notes, ...calendarSlots.flatMap(slot => slot.tasks)]} availableTags={availableTags} />
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}