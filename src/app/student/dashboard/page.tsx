'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

import { useAuthStore } from '@/store/authStore'

import { BookOpen, Trophy, Clock, Star, User } from 'lucide-react'
import { User as UserType, StudentProfile } from '@/lib/types'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchProfile = useAuthStore(s => s.fetchProfile)

  const checkUserAndLoadProfile = useCallback(async () => {
    try {
      await fetchProfile()
      const u: any = useAuthStore.getState().user
      if (!u) {
        router.push('/')
        return
      }
      setUser({
        id: u.id,
        email: u.email,
        role: 'student',
        onboarding_completed: !!u.onboarding_complete,
        role_selected_at: null,
        created_at: u.created_at,
        updated_at: u.updated_at
      })
      setStudentProfile(u.student_details || null)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
    }, [router, fetchProfile])

  useEffect(() => {
    checkUserAndLoadProfile()
  }, [checkUserAndLoadProfile])

  



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {studentProfile?.name || 'Student'}!
          </h1>
          <p className="text-neutral-600">
            Continue your learning journey with AI-powered education.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Courses Enrolled</p>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Achievements</p>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Study Time</p>
                  <p className="text-2xl font-bold text-neutral-900">0h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Average Score</p>
                  <p className="text-2xl font-bold text-neutral-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Courses
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Trophy className="w-5 h-5 mr-2" />
                View Achievements
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <User className="w-5 h-5 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600 mb-4">No recent activity</p>
                <Button variant="outline" size="sm">
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Profile Details */}
        {studentProfile && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Profile Details</h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Degree</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{(studentProfile as any).degree || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">College</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{(studentProfile as any).college_name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Experience Level</span>
                  <span className="text-neutral-900 ml-4 text-right">{(studentProfile as any).experience_level || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Interests</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{((studentProfile as any).interests || []).join(', ') || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Learning Goals</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{((studentProfile as any).learning_goals || []).join(', ') || '—'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Getting Started Tips</h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-neutral-700">Complete your profile to get personalized course recommendations.</p>
                <p className="text-neutral-700">Enroll in a course to start tracking your progress.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommended Courses */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900">Recommended for You</h2>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-neutral-600 mb-4">No recommendations yet</p>
                <p className="text-sm text-neutral-500 mb-4">
                  Complete your profile and start learning to get personalized recommendations.
                </p>
                <Button>
                  Explore Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
