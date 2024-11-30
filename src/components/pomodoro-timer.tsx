'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

interface PomodoroTimerProps {
  selectedTask: Task | null;
  onTaskComplete: (taskId: string) => void;
  language: {
    start: string;
    pause: string;
    resume: string;
    stop: string;
    reset: string;
  };
}

export function PomodoroTimer({ selectedTask, onTaskComplete, language }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);


  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    if (selectedTask) {
      onTaskComplete(selectedTask.id);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleStop();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, handleStop]);

  const handleStart = () => {
    if (selectedTask) {
      setIsRunning(true);
    } else {
      alert("Please select a task before starting the timer.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-card rounded-lg shadow">
      <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      <div className="flex space-x-4">
        {!isRunning ? (
          <Button onClick={handleStart} disabled={!selectedTask}>
            {language.start}
          </Button>
        ) : (
          <Button onClick={() => setIsRunning(false)}>
            {language.pause}
          </Button>
        )}
        {!isRunning && timeLeft < 25 * 60 && (
          <Button onClick={() => setIsRunning(true)}>
            {language.resume}
          </Button>
        )}
        <Button onClick={handleStop} disabled={!isRunning}>
          {language.stop}
        </Button>
        <Button onClick={() => setTimeLeft(25 * 60)} disabled={isRunning}>
          {language.reset}
        </Button>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {selectedTask ? selectedTask.content : 'No task selected'}
        </p>
      </div>
    </div>
  );
}