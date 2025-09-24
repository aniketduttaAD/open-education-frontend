'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

const StudentSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  college_name: z.string().min(1, 'College/University is required'),
  interests: z.string().optional(),
  learning_goals: z.string().optional(),
  preferred_languages: z.string().optional(),
  education_level: z.string().min(1, 'Education level is required'),
  experience_level: z.string().min(1, 'Experience level is required'),
})

export default function StudentOnboardingPage() {
  const router = useRouter()
  const saveStudentDetails = useAuthStore(s => s.saveStudentDetails)
  const completeOnboarding = useAuthStore(s => s.completeOnboarding)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [form, setForm] = useState({
    degree: '',
    college_name: '',
    interests: '',
    learning_goals: '',
    preferred_languages: '',
    education_level: '',
    experience_level: '',
  })

  const onChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const onSubmit = async () => {
    const parsed = StudentSchema.safeParse(form)
    if (!parsed.success) {
      const e: Record<string, string> = {}
      parsed.error.issues.forEach(i => { e[String(i.path[0])] = i.message })
      setErrors(e)
      return
    }
    setLoading(true)
    await saveStudentDetails({
      degree: form.degree,
      college_name: form.college_name,
      interests: form.interests ? form.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
      learning_goals: form.learning_goals ? form.learning_goals.split(',').map(s => s.trim()).filter(Boolean) : [],
      preferred_languages: form.preferred_languages ? form.preferred_languages.split(',').map(s => s.trim()).filter(Boolean) : [],
      education_level: form.education_level,
      experience_level: form.experience_level,
    })
    await completeOnboarding()
    router.push('/courses')
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-neutral-900">Student Onboarding</h1>
            <p className="text-neutral-600">Tell us about your background to personalize your learning.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <input className={`w-full px-4 py-3 border rounded-lg ${errors.degree ? 'border-red-500' : 'border-gray-300'}`} value={form.degree} onChange={e => onChange('degree', e.target.value)} />
              {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College/University *</label>
              <input className={`w-full px-4 py-3 border rounded-lg ${errors.college_name ? 'border-red-500' : 'border-gray-300'}`} value={form.college_name} onChange={e => onChange('college_name', e.target.value)} />
              {errors.college_name && <p className="mt-1 text-sm text-red-600">{errors.college_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
              <input className={`w-full px-4 py-3 border rounded-lg ${errors.education_level ? 'border-red-500' : 'border-gray-300'}`} value={form.education_level} onChange={e => onChange('education_level', e.target.value)} />
              {errors.education_level && <p className="mt-1 text-sm text-red-600">{errors.education_level}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
              <input className={`w-full px-4 py-3 border rounded-lg ${errors.experience_level ? 'border-red-500' : 'border-gray-300'}`} value={form.experience_level} onChange={e => onChange('experience_level', e.target.value)} />
              {errors.experience_level && <p className="mt-1 text-sm text-red-600">{errors.experience_level}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma-separated)</label>
              <input className="w-full px-4 py-3 border rounded-lg border-gray-300" value={form.interests} onChange={e => onChange('interests', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals (comma-separated)</label>
              <input className="w-full px-4 py-3 border rounded-lg border-gray-300" value={form.learning_goals} onChange={e => onChange('learning_goals', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Languages (comma-separated)</label>
              <input className="w-full px-4 py-3 border rounded-lg border-gray-300" value={form.preferred_languages} onChange={e => onChange('preferred_languages', e.target.value)} />
            </div>

            <div className="pt-2">
              <Button size="lg" onClick={onSubmit} disabled={loading} className="px-8">
                {loading ? 'Saving...' : 'Save and Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
