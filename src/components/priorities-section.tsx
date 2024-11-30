import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PrioritiesSectionProps {
  priorities: string[];
  onPriorityChange: (index: number, value: string) => void;
  language: {
    title: string;
    addPriority: string;
    add: string;
  };
}

export function PrioritiesSection({ priorities, onPriorityChange, language }: PrioritiesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{language.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {priorities.map((priority, index) => (
            <Input
              key={index}
              value={priority}
              onChange={(e) => onPriorityChange(index, e.target.value)}
              placeholder={`${language.add} ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}