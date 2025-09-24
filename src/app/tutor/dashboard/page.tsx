'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import VerificationModal from '@/components/tutor/VerificationModal'
import { useVerificationStore } from '@/store/verificationStore'

import { GraduationCap, Users, IndianRupee, Star, Plus, BookOpen } from 'lucide-react'
import { User as UserType, TutorProfile } from '@/lib/types'
import { useAuthStore } from '@/store/authStore'

export default function TutorDashboard() {
  const openVerification = useVerificationStore(s => s.open)
  const router = useRouter()
  const storeUser = useAuthStore(s => s.user)
  const fetchProfile = useAuthStore(s => s.fetchProfile)
  const [user, setUser] = useState<UserType | null>(null)
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        await fetchProfile()
        const u = useAuthStore.getState().user as any
        if (!u || cancelled) {
          setUser(null)
          setTutorProfile(null)
          return
        }
        setUser({
          id: u.id,
          email: u.email,
          role: 'tutor',
          onboarding_completed: !!u.onboarding_complete,
          role_selected_at: null,
          created_at: u.created_at,
          updated_at: u.updated_at,
        })
        const td = u.tutor_details || null
        setTutorProfile(td ? {
          name: u.name || 'Tutor',
          verification_status: td.verification_status || 'pending',
        } as TutorProfile : null)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  // run once on mount
  }, [])

  // Keep tutorProfile in sync when store user changes
  useEffect(() => {
    if (!storeUser) return
    const u: any = storeUser
    const td = u.tutor_details || null
    setTutorProfile(td ? {
      name: u.name || 'Tutor',
      verification_status: td.verification_status || 'pending',
    } as TutorProfile : null)
  }, [storeUser])

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
        {!user && (
          <div className="mb-8 p-4 border border-neutral-200 rounded-lg bg-white">
            <p className="text-neutral-700">Please sign in to view your tutor dashboard.</p>
          </div>
        )}
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {tutorProfile?.name || 'Tutor'}!
          </h1>
          <p className="text-neutral-600">
            Manage your courses and track your teaching success.
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
                  <p className="text-sm text-neutral-600">Total Courses</p>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Students</p>
                  <p className="text-2xl font-bold text-neutral-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                  <IndianRupee className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-neutral-900">₹0</p>
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
                  <p className="text-sm text-neutral-600">Average Rating</p>
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
                <Plus className="w-5 h-5 mr-2" />
                Create New Course
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Manage Courses
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <IndianRupee className="w-5 h-5 mr-2" />
                View Earnings
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
                  <GraduationCap className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600 mb-4">No recent activity</p>
                <Button variant="outline" size="sm">
                  Create Your First Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tutor Profile Details */}
        {tutorProfile && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Profile Details</h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Bio</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{(useAuthStore.getState().user?.tutor_details?.bio) || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Qualifications</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{(useAuthStore.getState().user?.tutor_details?.qualifications) || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Teaching Experience</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%]">{(useAuthStore.getState().user?.tutor_details?.teaching_experience) || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Expertise Areas</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{(useAuthStore.getState().user?.tutor_details?.expertise_areas || []).join(', ') || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Languages</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{(useAuthStore.getState().user?.tutor_details?.languages_spoken || []).join(', ') || '—'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Verification & Bank</h2>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Verification Status</span>
                  <span className="ml-4 text-right font-medium {tutorProfile.verification_status === 'verified' ? 'text-green-700' : 'text-yellow-700'}">{tutorProfile.verification_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Registration Fees</span>
                  <span className="text-neutral-900 ml-4 text-right">{useAuthStore.getState().user?.tutor_details?.register_fees_paid ? 'Paid' : 'Unpaid'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Bank Name</span>
                  <span className="text-neutral-900 ml-4 text-right">{useAuthStore.getState().user?.tutor_details?.bank_details?.bank_name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Account Holder</span>
                  <span className="text-neutral-900 ml-4 text-right">{useAuthStore.getState().user?.tutor_details?.bank_details?.account_holder_name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Account Number</span>
                  <span className="text-neutral-900 ml-4 text-right">{(useAuthStore.getState().user?.tutor_details?.bank_details?.account_number ? '•••• ' + String(useAuthStore.getState().user?.tutor_details?.bank_details?.account_number).slice(-4) : '—')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">IFSC</span>
                  <span className="text-neutral-900 ml-4 text-right">{useAuthStore.getState().user?.tutor_details?.bank_details?.ifsc_code || '—'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Verification Status */}
        {tutorProfile && tutorProfile.verification_status !== 'verified' && (
          <div className="mt-8">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <h2 className="text-xl font-semibold text-yellow-800">Account Verification Required</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 mb-2">
                      You have to verify first using your documents before creating courses.
                    </p>
                    <p className="text-sm text-yellow-600">
                      Status: {tutorProfile.verification_status.charAt(0).toUpperCase() + tutorProfile.verification_status.slice(1)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-yellow-300 text-yellow-700"
                    onClick={() => openVerification()}
                  >
                    Complete Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Getting Started */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Complete Profile</h3>
                  <p className="text-sm text-gray-600">
                    Add your bio, expertise, and verification documents.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Create Course</h3>
                  <p className="text-sm text-gray-600">
                    Use AI assistance to generate comprehensive course content.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Start Earning</h3>
                  <p className="text-sm text-gray-600">
                    Earn 80% of course revenue from student enrollments.
                  </p>
                </div>

        {/* Verification Modal */}
        <VerificationModal />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
