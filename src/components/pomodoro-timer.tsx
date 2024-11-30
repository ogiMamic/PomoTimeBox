import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface PomodoroTimerProps {
  selectedTask: Task | null;
  onTaskComplete: (task: Task) => void;
  language: {
    start: string;
    stop: string;
    currentTask: string;
  };
}

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

export default function PomodoroTimer({ selectedTask, onTaskComplete, language }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

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
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (selectedTask) {
      setIsRunning(true);
    } else {
      alert("Please select a task before starting the timer.");
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    if (selectedTask) {
      onTaskComplete(selectedTask);
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
        <Button onClick={handleStart} disabled={isRunning || !selectedTask}>
          {language.start}
        </Button>
        <Button onClick={handleStop} disabled={!isRunning}>
          {language.stop}
        </Button>
      </div>
      <div className="text-center">
        <p className="font-semibold">{language.currentTask}:</p>
        <p className={`${selectedTask?.completed ? 'line-through' : ''}`}>
          {selectedTask ? selectedTask.content : 'No task selected'}
        </p>
      </div>
    </div>
  );
}