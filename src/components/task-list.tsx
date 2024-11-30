'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type Task = {
  id: number
  name: string
  completed: boolean
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), name: newTask, completed: false }])
      setNewTask('')
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
          />
          <Button onClick={addTask}>Add</Button>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`task-${task.id}`} 
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <label 
                htmlFor={`task-${task.id}`}
                className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
              >
                {task.name}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}