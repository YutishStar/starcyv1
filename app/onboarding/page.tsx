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
import { supabase } from '@/lib/supabaseClient'
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { submitOnboardingData } from "./actions"

const formSteps = [
  {
    title: "Personal Information",
    fields: ["name", "age", "date_of_birth", "gender", "location", "time_zone"]
  },
  {
    title: "Preferences and Interests",
    fields: ["hobbies", "favorite_content", "learning_goals", "languages"]
  },
  {
    title: "Lifestyle and Daily Habits",
    fields: ["daily_routine", "dietary_preferences", "exercise_habits", "sleep_patterns", "caffeine_consumption"]
  },
  {
    title: "Professional Information",
    fields: ["profession", "work_style", "career_goals", "productivity_preferences"]
  },
  {
    title: "Personal Goals and Aspirations",
    fields: ["life_goals", "learning_priorities", "motivators"]
  },
  {
    title: "Health and Wellness",
    fields: ["health_goals", "allergies", "wellness_practices"]
  },
  {
    title: "Relationship Dynamics",
    fields: ["relationship_status", "family_details", "social_engagement"]
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
  const router = useRouter()
  const [formData, setFormData] = useState<DbOnboarding>({
    // user_id: '',
    name: '',
    age: undefined,
    date_of_birth: null,
    gender: '',
    location: '',
    time_zone: '',
    hobbies: '',
    favorite_content: '',
    learning_goals: '',
    languages: '',
    daily_routine: '',
    dietary_preferences: '',
    exercise_habits: '',
    sleep_patterns: '',
    caffeine_consumption: '',
    profession: '',
    work_style: '',
    career_goals: '',
    productivity_preferences: '',
    life_goals: '',
    learning_priorities: '',
    motivators: '',
    health_goals: '',
    allergies: '',
    wellness_practices: '',
    relationship_status: '',
    family_details: '',
    social_engagement: '',
    // created_at: '',
    // updated_at: '',
    // email: '',
    is_onboarded: false,
  });
  

  const handleInputChange = (field: keyof DbOnboarding, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const {user} = useUser();
  const handleNext = async () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      console.log('Form submitted:', formData)
      // Replace with actual user ID
      const userId = user?.id;
      const userEmail = user?.emailAddresses[0].emailAddress; // Replace with actual user email
      console.log('User ID:', userId, 'User Email:', userEmail)

      const res = await submitOnboardingData(formData)
      console.log('Response:', res)
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      console.log('User data updated:', res.message)
      await user?.reload()
      router.push('/')
    }
    if (res?.error) {
      // setError(res?.error)
    }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatFieldName = (field: string) => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  const renderField = (field: keyof DbOnboarding) => {
    switch (field) {
      case 'date_of_birth':
        return (
          <DatePicker
            date={formData[field] ? new Date(formData[field]) : undefined}
            onChange={(date) => handleInputChange(field, date?.toISOString() || '')}
          />
        )
      case 'gender':
        return (
          <select
            value={formData[field] as string | number | readonly string[] | undefined}
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
      case 'work_style':
      case 'relationship_status':
        return (
          <select
            value={formData[field] as string | number | readonly string[] | undefined}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full h-8 px-3 text-xs bg-background rounded-md border border-input
              focus:outline-none focus:ring-1 focus:ring-ring
              hover:border-muted-foreground transition-colors"
          >
            <option value="" disabled>Select {formatFieldName(field)}</option>
            {field === 'work_style' ? (
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
            placeholder={`Enter ${formatFieldName(field)}`}
            value={formData[field] as string | number | readonly string[] | undefined}
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
                  {formatFieldName(field)}
                </label>
                {renderField(field as keyof DbOnboarding)}
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
