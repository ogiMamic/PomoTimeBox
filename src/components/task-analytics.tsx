import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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
  duration?: number; // Duration in minutes
}

interface TaskAnalyticsProps {
  tasks: Task[];
  availableTags: Tag[];
}

export function TaskAnalytics({ tasks, availableTags }: TaskAnalyticsProps) {
  const data = availableTags.map(tag => {
    const tagTasks = tasks.filter(task => task.tags.some(t => t.id === tag.id))
    const totalDuration = tagTasks.reduce((sum, task) => sum + (task.duration || 0), 0)
    return {
      name: tag.name,
      duration: totalDuration,
      color: tag.color
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="duration" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}