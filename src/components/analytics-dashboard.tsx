'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Mon",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Tue",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Wed",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thu",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Fri",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sat",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export default function AnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 60}h`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}