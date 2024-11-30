'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimeboxData {
  priorities: string[];
  notes: string;
  schedule: { [key: string]: string };
}

export default function TimeboxPlanner() {
  const [date, setDate] = useState<Date>(new Date())
  const [priorities, setPriorities] = useState(['', '', ''])
  const [notes, setNotes] = useState('')
  const [schedule, setSchedule] = useState<{ [key: string]: string }>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    loadDataForDate(date)
  }, [date])

  const loadDataForDate = (selectedDate: Date) => {
    const dateString = format(selectedDate, 'yyyy-MM-dd')
    const savedData = localStorage.getItem(`timebox_${dateString}`)
    if (savedData) {
      const parsedData: TimeboxData = JSON.parse(savedData)
      setPriorities(parsedData.priorities)
      setNotes(parsedData.notes)
      setSchedule(parsedData.schedule)
    } else {
      setPriorities(['', '', ''])
      setNotes('')
      setSchedule({})
    }
    setHasUnsavedChanges(false)
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      if (hasUnsavedChanges) {
        if (window.confirm("Sie haben ungespeicherte Änderungen. Möchten Sie diese verwerfen?")) {
          setDate(newDate)
        }
      } else {
        setDate(newDate)
      }
    }
  }

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...priorities]
    newPriorities[index] = value
    setPriorities(newPriorities)
    setHasUnsavedChanges(true)
  }

  const handleScheduleChange = (time: string, value: string) => {
    setSchedule(prev => ({ ...prev, [time]: value }))
    setHasUnsavedChanges(true)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    const dateString = format(date, 'yyyy-MM-dd')
    const dataToSave: TimeboxData = {
      priorities,
      notes,
      schedule
    }
    localStorage.setItem(`timebox_${dateString}`, JSON.stringify(dataToSave))
    setHasUnsavedChanges(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Timebox Planner</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] pl-3 text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'd. MMMM yyyy', { locale: de })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Zeitplan</TabsTrigger>
            <TabsTrigger value="priorities">Prioritäten</TabsTrigger>
            <TabsTrigger value="notes">Notizen</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {Array.from({ length: 18 }, (_, i) => i + 5).map((hour) => (
                  <div key={hour} className="grid grid-cols-3 gap-2">
                    <div className="text-right font-medium">{hour % 24}:00</div>
                    <Input
                      value={schedule[`${hour}:00`] || ''}
                      onChange={(e) => handleScheduleChange(`${hour}:00`, e.target.value)}
                      className="col-span-2"
                    />
                    <div className="text-right font-medium">{hour % 24}:30</div>
                    <Input
                      value={schedule[`${hour}:30`] || ''}
                      onChange={(e) => handleScheduleChange(`${hour}:30`, e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="priorities">
            <div className="space-y-4">
              {priorities.map((priority, index) => (
                <Input
                  key={index}
                  value={priority}
                  onChange={(e) => handlePriorityChange(index, e.target.value)}
                  placeholder={`Priorität ${index + 1}`}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="notes">
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Ihre Notizen hier..."
              className="min-h-[200px]"
            />
          </TabsContent>
        </Tabs>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            {hasUnsavedChanges ? "Änderungen speichern" : "Keine Änderungen zu speichern"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}