'use client'

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { useDrop, useDrag, DropTargetMonitor, DragSourceMonitor } from 'react-dnd'
import { GripVertical } from 'lucide-react'

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

interface CalendarSlot {
  time: string;
  tasks: Task[];
}

interface DailyCalendarProps {
  slots: CalendarSlot[];
  onTaskDrop: (task: Task, time: string) => void;
  onTaskMove: (taskId: string, fromTime: string, toTime: string) => void;
  onTaskUpdate: (taskId: string, newContent: string) => void;
  onTaskSelect: (task: Task) => void;
  selectedTask: Task | null;
}

const CalendarTask: React.FC<{ 
  task: Task; 
  time: string; 
  onTaskMove: (taskId: string, fromTime: string, toTime: string) => void;
  onTaskUpdate: (taskId: string, newContent: string) => void;
  onTaskSelect: (task: Task) => void;
  isSelected: boolean;
}> = ({ task, time, onTaskMove, onTaskUpdate, onTaskSelect, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);

  const [{ isDragging }, drag] = useDrag<{ type: string; task: Task; time: string }, unknown, { isDragging: boolean }>(() => ({
    type: 'calendarTask',
    item: { type: 'calendarTask', task, time },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedContent !== task.content) {
      onTaskUpdate(task.id, editedContent);
    }
  };

  return (
    <div
      ref={drag}
      className={`mt-1 p-1 bg-primary text-primary-foreground rounded flex items-center justify-between ${
        isDragging ? 'opacity-50' : ''
      } ${isSelected ? 'ring-2 ring-accent' : ''} ${
        task.completed ? 'line-through opacity-50' : ''
      }`}
      onDoubleClick={handleDoubleClick}
      onClick={() => onTaskSelect(task)}
    >
      {isEditing ? (
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="bg-transparent border-none outline-none text-primary-foreground w-full"
        />
      ) : (
        <span>{task.content}</span>
      )}
      <GripVertical className="h-4 w-4 cursor-move" />
    </div>
  );
};

const CalendarSlot: React.FC<{ 
  slot: CalendarSlot; 
  onTaskDrop: (task: Task, time: string) => void; 
  onTaskMove: (taskId: string, fromTime: string, toTime: string) => void;
  onTaskUpdate: (taskId: string, newContent: string) => void;
  onTaskSelect: (task: Task) => void;
  selectedTask: Task | null;
}> = ({ slot, onTaskDrop, onTaskMove, onTaskUpdate, onTaskSelect, selectedTask }) => {
  const [{ isOver }, dropRef] = useDrop<{ task: Task; time: string } | Task, void, { isOver: boolean }>({
    accept: ['task', 'calendarTask'],
    drop: (item) => {
      if ('time' in item) {
        onTaskMove(item.task.id, item.time, slot.time)
      } else {
        onTaskDrop(item, slot.time)
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`p-2 border-b border-border min-h-[60px] ${isOver ? 'bg-accent' : ''}`}
    >
      <div className="text-sm text-muted-foreground">{slot.time}</div>
      {slot.tasks.map((task) => (
        <CalendarTask
          key={task.id}
          task={task}
          time={slot.time}
          onTaskMove={onTaskMove}
          onTaskUpdate={onTaskUpdate}
          onTaskSelect={onTaskSelect}
          isSelected={selectedTask?.id === task.id}
        />
      ))}
    </div>
  );
};

export function DailyCalendar({ slots, onTaskDrop, onTaskMove, onTaskUpdate, onTaskSelect, selectedTask }: DailyCalendarProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-[600px] overflow-y-auto">
          {slots.map((slot) => (
            <CalendarSlot 
              key={slot.time} 
              slot={slot} 
              onTaskDrop={onTaskDrop} 
              onTaskMove={onTaskMove}
              onTaskUpdate={onTaskUpdate}
              onTaskSelect={onTaskSelect}
              selectedTask={selectedTask}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}