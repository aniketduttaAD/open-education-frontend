'use client'

import { useEffect, useMemo, useState } from 'react'
import { DatePicker } from '@/components/ui/DatePicker'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import { User } from 'lucide-react'
import { StudentOnboardingSchema, type StudentOnboardingInput } from '@/lib/validation/onboarding'

export default function StudentOnboardingPage() {
  const router = useRouter()
  const saveStudentDetails = useAuthStore(s => s.saveStudentDetails)
  const completeOnboarding = useAuthStore(s => s.completeOnboarding)
  const { user } = useUserStore()

  useEffect(() => {
    document.title = "Student Onboarding - OpenEducation";
  }, []);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [form, setForm] = useState({
    dob: '',
    degree: '',
    college_name: '',
    interestsText: '',
    learningGoalsText: '',
    preferredLanguagesText: '',
    education_level: '',
    experience_level: '',
  })

  // Prefill from latest API user data
  useEffect(() => {
    const sd = user?.student_details
    if (!sd) return
    setForm(prev => ({
      ...prev,
      dob: sd.dob || prev.dob,
      degree: sd.degree || prev.degree,
      college_name: sd.college_name || prev.college_name,
      interestsText: Array.isArray(sd.interests) ? sd.interests.join(', ') : prev.interestsText,
      learningGoalsText: Array.isArray(sd.learning_goals) ? sd.learning_goals.join(', ') : prev.learningGoalsText,
      preferredLanguagesText: Array.isArray(sd.preferred_languages) ? sd.preferred_languages.join(', ') : prev.preferredLanguagesText,
      education_level: sd.education_level || prev.education_level,
      experience_level: sd.experience_level || prev.experience_level,
    }))
  }, [user])

  const onChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const derivedInput: StudentOnboardingInput = useMemo(() => ({
    dob: form.dob,
    degree: form.degree.trim(),
    college_name: form.college_name.trim(),
    interests: form.interestsText.split(',').map(s => s.trim()).filter(Boolean),
    learning_goals: form.learningGoalsText.split(',').map(s => s.trim()).filter(Boolean),
    preferred_languages: form.preferredLanguagesText.split(',').map(s => s.trim()).filter(Boolean),
    education_level: form.education_level.trim(),
    experience_level: form.experience_level.trim(),
  }), [form])

  const validation = useMemo(() => StudentOnboardingSchema.safeParse(derivedInput), [derivedInput])
  const isValid = validation.success

  const onSubmit = async () => {
    if (!isValid) {
      const e: Record<string, string> = {}
      if (!validation.success) {
        validation.error.issues.forEach(i => { e[String(i.path[0])] = i.message })
      }
      setErrors(e)
      return
    }
    setLoading(true)
    await saveStudentDetails({
      gender: 'male',
      dob: derivedInput.dob,
      degree: derivedInput.degree,
      college_name: derivedInput.college_name,
      interests: derivedInput.interests,
      learning_goals: derivedInput.learning_goals,
      preferred_languages: derivedInput.preferred_languages,
      education_level: derivedInput.education_level,
      experience_level: derivedInput.experience_level,
    })
    await completeOnboarding()
    router.push('/courses')
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Student Onboarding</h1>
            {user?.name && (
              <p className="text-lg text-neutral-600 mb-4">
                Welcome, {user.name}! Let&apos;s set up your learning profile.
              </p>
            )}
            <p className="text-neutral-600">Tell us about your background to personalize your learning.</p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Core fields required by the unified flow */}

            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Date of Birth *
              </label>
              <DatePicker
                selected={form.dob ? new Date(form.dob) : null}
                onChange={(date) => {
                  const v = date ? format(date, 'yyyy-MM-dd') : ''
                  setForm(prev => ({ ...prev, dob: v }))
                  setErrors(prev => ({ ...prev, dob: undefined }))
                }}
                placeholder="Select your date of birth"
                className={errors.dob ? 'border-red-500' : ''}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dob}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Degree *
              </label>
              <input 
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.degree 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`} 
                value={form.degree} 
                onChange={e => {
                  onChange('degree', e.target.value)
                  if (e.target.value.trim().length >= 1) {
                    setErrors(prev => ({ ...prev, degree: undefined }))
                  } else if (e.target.value.trim().length === 0) {
                    setErrors(prev => ({ ...prev, degree: "Degree is required" }))
                  }
                }}
                placeholder="e.g. Bachelor of Science, Master of Arts"
              />
              {errors.degree && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.degree}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                College/University *
              </label>
              <input 
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.college_name 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`} 
                value={form.college_name} 
                onChange={e => {
                  onChange('college_name', e.target.value)
                  if (e.target.value.trim().length >= 1) {
                    setErrors(prev => ({ ...prev, college_name: undefined }))
                  } else if (e.target.value.trim().length === 0) {
                    setErrors(prev => ({ ...prev, college_name: "College/University is required" }))
                  }
                }}
                placeholder="e.g. Harvard University, MIT"
              />
              {errors.college_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.college_name}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Education Level *
              </label>
              <input 
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.education_level 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`} 
                value={form.education_level} 
                onChange={e => {
                  onChange('education_level', e.target.value)
                  if (e.target.value.trim().length >= 1) {
                    setErrors(prev => ({ ...prev, education_level: undefined }))
                  } else if (e.target.value.trim().length === 0) {
                    setErrors(prev => ({ ...prev, education_level: "Education level is required" }))
                  }
                }}
                placeholder="e.g. Undergraduate, Graduate, PhD"
              />
              {errors.education_level && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education_level}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Experience Level *
              </label>
              <input 
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                  errors.experience_level 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`} 
                value={form.experience_level} 
                onChange={e => {
                  onChange('experience_level', e.target.value)
                  if (e.target.value.trim().length >= 1) {
                    setErrors(prev => ({ ...prev, experience_level: undefined }))
                  } else if (e.target.value.trim().length === 0) {
                    setErrors(prev => ({ ...prev, experience_level: "Experience level is required" }))
                  }
                }}
                placeholder="e.g. Beginner, Intermediate, Advanced"
              />
              {errors.experience_level && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experience_level}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Interests (comma-separated)
              </label>
              <input 
                className="w-full px-4 py-3 border rounded-lg border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
                value={form.interestsText} 
                onChange={e => onChange('interestsText', e.target.value)}
                placeholder="e.g. Mathematics, Science, Programming, Art"
              />
              {errors.interests && (
                <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Learning Goals (comma-separated)
              </label>
              <input 
                className="w-full px-4 py-3 border rounded-lg border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
                value={form.learningGoalsText} 
                onChange={e => onChange('learningGoalsText', e.target.value)}
                placeholder="e.g. Learn Python, Master Calculus, Improve Writing"
              />
              {errors.learning_goals && (
                <p className="mt-1 text-sm text-red-600">{errors.learning_goals}</p>
              )}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Preferred Languages (comma-separated)
              </label>
              <input 
                className="w-full px-4 py-3 border rounded-lg border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
                value={form.preferredLanguagesText} 
                onChange={e => onChange('preferredLanguagesText', e.target.value)}
                placeholder="e.g. English, Spanish, French"
              />
              {errors.preferred_languages && (
                <p className="mt-1 text-sm text-red-600">{errors.preferred_languages}</p>
              )}
            </div>

            <div className="pt-2">
              <Button 
                size="lg" 
                onClick={onSubmit}
                disabled={loading || !isValid}
                className="px-8"
              >
                {loading ? 'Saving...' : 'Save and Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
