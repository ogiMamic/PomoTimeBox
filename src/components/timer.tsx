'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Timer() {
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1)
      }, 1000)
    } else if (time === 0) {
      if (isBreak) {
        setTime(25 * 60)
        setIsBreak(false)
      } else {
        setTime(5 * 60)
        setIsBreak(true)
      }
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, isBreak])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setTime(25 * 60)
    setIsActive(false)
    setIsBreak(false)
  }

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isBreak ? 'Break Time' : 'Work Time'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center mb-4">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <Progress value={(1 - time / (isBreak ? 5 * 60 : 25 * 60)) * 100} className="mb-4" />
        <div className="flex justify-center space-x-2">
          <Button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</Button>
          <Button onClick={resetTimer} variant="outline">Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
}