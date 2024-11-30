'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventDropArg } from '@fullcalendar/core'

interface Task {
  id: string;
  content: string;
}

interface CalendarSectionProps {
  events: any[];
  onEventDrop: (eventDropInfo: EventDropArg) => void;
  onEventClick: (clickInfo: any) => void;
  onDateSelect: (selectInfo: any) => void;
  onTaskDrop: (task: Task, date: Date) => void;
}

export function CalendarSection({
  events,
  onEventDrop,
  onEventClick,
  onDateSelect,
  onTaskDrop
}: CalendarSectionProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventDrop={onEventDrop}
          eventClick={onEventClick}
          select={onDateSelect}
          height="auto"
          aspectRatio={1.35}
          expandRows={true}
          stickyHeaderDates={true}
          droppable={true}
          drop={(info) => {
            const task: Task = {
              id: info.draggedEl.id,
              content: info.draggedEl.innerText
            };
            onTaskDrop(task, info.date);
          }}
        />
      </CardContent>
    </Card>
  )
}