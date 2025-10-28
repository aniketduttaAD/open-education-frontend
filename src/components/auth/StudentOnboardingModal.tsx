'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, GraduationCap, MapPin, Calendar } from 'lucide-react'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { DatePicker } from '../ui/DatePicker'

interface StudentOnboardingModalProps {
  isOpen: boolean
  onComplete?: (data: StudentOnboardingData) => void
  loading?: boolean
}

const StudentOnboardingSchema = z.object({
  gender: z.enum(['male','female','other'], { required_error: 'Please select your gender' }),
  dob: z.date({ required_error: 'Please select your date of birth' }).refine(
    (date) => {
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      const monthDiff = today.getMonth() - date.getMonth()
      const dayDiff = today.getDate() - date.getDate()
      
      // Calculate actual age considering month and day
      let actualAge = age
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge = age - 1
      }
      
      return actualAge >= 15 && actualAge <= 100
    },
    'You must be at least 15 years old'
  ),
  latestDegree: z.string().min(1, 'Latest degree is required'),
  collegeUniversity: z.string().min(1, 'College/University name is required')
})

type StudentOnboardingData = z.infer<typeof StudentOnboardingSchema>

export function StudentOnboardingModal({ isOpen, onComplete, loading = false }: StudentOnboardingModalProps) {
  const [formData, setFormData] = useState<StudentOnboardingData>({
    gender: 'male',
    dob: new Date(),
    latestDegree: '',
    collegeUniversity: ''
  })

  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const saveStudentDetails = useAuthStore(s => s.saveStudentDetails)
  const completeOnboarding = useAuthStore(s => s.completeOnboarding)

  const handleStringChange = (field: 'gender' | 'latestDegree' | 'collegeUniversity', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, dob: date }))
      if (errors.dob) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.dob
          return newErrors
        })
      }
    }
  }

  const validateForm = (): boolean => {
    const res = StudentOnboardingSchema.safeParse(formData)
    if (!res.success) {
      const fieldErrors: Record<string, string> = {}
      res.error.issues.forEach(issue => {
        const path = issue.path[0] as string
        fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    await saveStudentDetails({
      gender: formData.gender,
      dob: formData.dob.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      degree: formData.latestDegree,
      college_name: formData.collegeUniversity,
      education_level: formData.latestDegree,
      preferred_languages: [],
      interests: [],
      learning_goals: [],
      experience_level: ''
    })
    await completeOnboarding()
    onComplete?.(formData)
  }

  const degreeOptions = [
    'High School',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'Other'
  ]

  const genderOptions = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' },
    { key: 'other', label: 'Other' },
  ] as const

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl mx-4"
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Complete Your Student Profile
                </h2>
                <p className="text-lg text-gray-600">
                  Help us personalize your learning experience
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <div className="space-y-6">

                  {/* Gender and Date of Birth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleStringChange('gender', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.gender ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select gender</option>
                        {genderOptions.map(option => (
                          <option key={option.key} value={option.key}>{option.label}</option>
                        ))}
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Date of Birth *
                      </label>
                      <DatePicker
                        selected={formData.dob}
                        onChange={handleDateChange}
                        placeholder="Select your date of birth"
                        className={errors.dob ? 'border-red-500' : ''}
                      />
                      {errors.dob && (
                        <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                      )}
                    </div>
                  </div>

                  {/* Latest Degree */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latest Degree/Education Level *
                    </label>
                    <select
                      value={formData.latestDegree}
                      onChange={(e) => handleStringChange('latestDegree', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.latestDegree ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your latest degree</option>
                      {degreeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.latestDegree && (
                      <p className="mt-1 text-sm text-red-600">{errors.latestDegree}</p>
                    )}
                  </div>

                  {/* College/University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College/University *
                    </label>
                    <input
                      type="text"
                      value={formData.collegeUniversity}
                      onChange={(e) => handleStringChange('collegeUniversity', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.collegeUniversity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your college or university name"
                    />
                    {errors.collegeUniversity && (
                      <p className="mt-1 text-sm text-red-600">{errors.collegeUniversity}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="px-8 py-3 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Setting up your profile...
                      </div>
                    ) : (
                      'Complete Setup'
                    )}
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      <span>Personalized Learning</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Track Progress</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Earn Certificates</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
