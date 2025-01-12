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
    fields: ["hobbies", "learning_goals", "languages"]
  },
  {
    title: "Lifestyle and Daily Habits",
    fields: ["daily_routine", "exercise_habits", "caffeine_consumption"]
  },
  {
    title: "Professional Information",
    fields: ["profession", "work_style", "career_goals"]
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
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentYear = new Date().getFullYear();
  const defaultYear = 2000;
  const defaultMonth = 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-8 px-3 text-xs justify-start font-normal bg-white",
            !date && "text-muted-foreground hover:bg-gray-50"
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3 text-gray-500" />
          {date ? format(date, "MMMM d, yyyy") : "Select your date of birth"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex gap-2">
          {/* Year Dropdown */}
          <select
            value={date ? date.getFullYear() : defaultYear}
            onChange={(e) => {
              const newDate = date ? new Date(date) : new Date(defaultYear, defaultMonth, 1);
              newDate.setFullYear(parseInt(e.target.value));
              onChange(newDate);
            }}
            className="flex-1 h-8 px-2 text-sm rounded-md border border-input bg-white
              focus:outline-none focus:ring-1 focus:ring-black hover:border-gray-400"
          >
            {Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (
              <option key={1900 + i} value={1900 + i}>
                {1900 + i}
              </option>
            )).reverse()}
          </select>

          {/* Month Dropdown */}
          <select
            value={date ? date.getMonth() : defaultMonth}
            onChange={(e) => {
              const newDate = date ? new Date(date) : new Date(defaultYear, defaultMonth, 1);
              newDate.setMonth(parseInt(e.target.value));
              // Adjust day if it exceeds the days in the new month
              const daysInNewMonth = getDaysInMonth(newDate.getFullYear(), parseInt(e.target.value));
              if (newDate.getDate() > daysInNewMonth) {
                newDate.setDate(daysInNewMonth);
              }
              onChange(newDate);
            }}
            className="flex-1 h-8 px-2 text-sm rounded-md border border-input bg-white
              focus:outline-none focus:ring-1 focus:ring-black hover:border-gray-400"
          >
            {[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ].map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          {/* Day Dropdown */}
          <select
            value={date ? date.getDate() : 1}
            onChange={(e) => {
              const newDate = date ? new Date(date) : new Date(defaultYear, defaultMonth, 1);
              newDate.setDate(parseInt(e.target.value));
              onChange(newDate);
            }}
            className="flex-1 h-8 px-2 text-sm rounded-md border border-input bg-white
              focus:outline-none focus:ring-1 focus:ring-black hover:border-gray-400"
          >
            {Array.from(
              { length: date 
                ? getDaysInMonth(date.getFullYear(), date.getMonth())
                : getDaysInMonth(defaultYear, defaultMonth) 
              }, 
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              )
            )}
          </select>
        </div>
      </PopoverContent>
    </Popover>
  );
}

async function getTimezoneFromCity(city: string): Promise<string> {
  try {
    // First, get coordinates from city name using Google Geocoding API
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.results && geocodeData.results.length > 0) {
      const { lat, lng } = geocodeData.results[0].geometry.location;
      
      // Then, get timezone using coordinates
      const timestamp = Math.floor(Date.now() / 1000);
      const timezoneResponse = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const timezoneData = await timezoneResponse.json();

      if (timezoneData.timeZoneId) {
        return timezoneData.timeZoneId;
      }
    }
    
    // Fallback to browser's timezone if API calls fail
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error fetching timezone:', error);
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const [formData, setFormData] = useState<DbOnboarding>({
    name: '',
    age: undefined,
    date_of_birth: null,
    gender: '',
    location: '',
    time_zone: '',
    hobbies: '',
    learning_goals: '',
    languages: '',
    daily_routine: '',
    exercise_habits: '',
    caffeine_consumption: '',
    profession: '',
    work_style: '',
    career_goals: '',
    life_goals: '',
    learning_priorities: '',
    motivators: '',
    health_goals: '',
    allergies: '',
    wellness_practices: '',
    relationship_status: '',
    family_details: '',
    social_engagement: '',
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
          </select>
        )
      case 'age':
        return (
          <Input
            type="number"
            placeholder={`Enter ${formatFieldName(field)}`}
            value={formData[field] as string | number | readonly string[] | undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field, e.target.value)}
            className="w-full h-8 px-3 text-xs rounded-md border-input
              placeholder:text-muted-foreground
              focus-visible:ring-1 focus-visible:ring-ring
              hover:border-muted-foreground transition-colors"
          />
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
      case 'location':
        return (
          <Input
            placeholder="Enter your city"
            value={formData[field] as string}
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const city = e.target.value;
              handleInputChange(field, city);
              
              // Get and set timezone when city changes
              if (city.length > 2) {
                const timezone = await getTimezoneFromCity(city);
                handleInputChange('time_zone', timezone);
              }
            }}
            className="w-full h-8 px-3 text-xs rounded-md border-input
              placeholder:text-muted-foreground
              focus-visible:ring-1 focus-visible:ring-ring
              hover:border-muted-foreground transition-colors"
          />
        );
      case 'time_zone':
        return (
          <Input
            placeholder="Timezone will be set automatically"
            value={formData[field] as string}
            disabled
            className="w-full h-8 px-3 text-xs rounded-md border-input
              placeholder:text-muted-foreground bg-gray-50
              focus-visible:ring-1 focus-visible:ring-ring
              hover:border-muted-foreground transition-colors"
          />
        );
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
            <h1 className="text-2xl font-semibold">Make Your first Artificially Intelligent Friend, StarCy!</h1>
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
