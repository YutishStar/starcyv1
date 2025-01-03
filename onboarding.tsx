'use client'

import * as React from "react"
import { useState, useEffect } from 'react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import Image from 'next/image'

const formSteps = [
  {
    title: "Personal Information",
    fields: ["name", "age", "dateOfBirth", "gender", "location", "timeZone"]
  },
  {
    title: "Preferences and Interests",
    fields: ["hobbies", "favoriteContent", "learningGoals", "languages"]
  },
  {
    title: "Lifestyle and Daily Habits",
    fields: ["dailyRoutine", "dietaryPreferences", "exerciseHabits", "sleepPatterns", "caffeineConsumption"]
  },
  {
    title: "Professional Information",
    fields: ["profession", "workStyle", "careerGoals", "productivityPreferences"]
  },
  {
    title: "Personal Goals and Aspirations",
    fields: ["lifeGoals", "learningPriorities", "motivators"]
  },
  {
    title: "Health and Wellness",
    fields: ["healthGoals", "allergies", "wellnessPractices"]
  },
  {
    title: "Relationship Dynamics",
    fields: ["relationshipStatus", "familyDetails", "socialEngagement"]
  }
];

interface DatePickerProps {
  date?: Date
  onChange?: (date?: Date) => void
}

function DatePicker({ date, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-8 px-3 text-xs justify-start font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? format(date, "MMMM d, yyyy") : "Select your date of birth"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          className="rounded-md border shadow-sm bg-white"
          classNames={{
            months: "space-y-4 px-3",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-xs",
            row: "flex w-full mt-2",
            cell: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
              "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            ),
            day: cn(
              "h-7 w-7 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
              "rounded-md text-xs"
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    name: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    timeZone: '',
    hobbies: '',
    favoriteContent: '',
    learningGoals: '',
    languages: '',
    dailyRoutine: '',
    dietaryPreferences: '',
    exerciseHabits: '',
    sleepPatterns: '',
    caffeineConsumption: '',
    profession: '',
    workStyle: '',
    careerGoals: '',
    productivityPreferences: '',
    lifeGoals: '',
    learningPriorities: '',
    motivators: '',
    healthGoals: '',
    allergies: '',
    wellnessPractices: '',
    relationshipStatus: '',
    familyDetails: '',
    socialEngagement: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      console.log('Form submitted:', formData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderField = (field: string) => {
    switch (field) {
      case 'dateOfBirth':
        return (
          <DatePicker
            date={formData[field] ? new Date(formData[field]) : undefined}
            onChange={(date) => handleInputChange(field, date?.toISOString() || '')}
          />
        )
      case 'gender':
        return (
          <select
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full h-8 px-3 text-xs bg-background rounded-md border border-input
              focus:outline-none focus:ring-1 focus:ring-ring
              hover:border-muted-foreground transition-colors"
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        )
      case 'workStyle':
      case 'relationshipStatus':
        return (
          <select
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full h-8 px-3 text-xs bg-background rounded-md border border-input
              focus:outline-none focus:ring-1 focus:ring-ring
              hover:border-muted-foreground transition-colors"
          >
            <option value="" disabled>Select {field.replace(/([A-Z])/g, ' $1').toLowerCase()}</option>
            {field === 'workStyle' ? (
              <>
                <option value="freelancer">Freelancer</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="employed">Employed</option>
                <option value="other">Other</option>
              </>
            ) : (
              <>
                <option value="single">Single</option>
                <option value="in-relationship">In a relationship</option>
                <option value="married">Married</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </>
            )}
          </select>
        )
      default:
        return (
          <Input
            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            value={formData[field] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field, e.target.value)}
            className="w-full h-8 px-3 text-xs rounded-md border-input
              placeholder:text-muted-foreground
              focus-visible:ring-1 focus-visible:ring-ring
              hover:border-muted-foreground transition-colors"
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-20 h-14 relative">
              <Image
                src="/sc-logo.png"
                alt="StarCy Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Tell StarCy About You!</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {formSteps.length}: {formSteps[currentStep].title}
            </p>
          </div>
        </div>

        <form className="space-y-4">
          {formSteps[currentStep].fields.map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground mb-1.5 pl-0.5">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {renderField(field)}
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="px-2 py-0.5 text-xs"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="px-2 py-0.5 text-xs bg-black text-white hover:bg-black/90"
            >
              {currentStep === formSteps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

