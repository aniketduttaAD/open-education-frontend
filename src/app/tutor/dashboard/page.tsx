'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GraduationCap, Users, IndianRupee, Star, Plus, BookOpen, Download, FileText, Calendar } from 'lucide-react'
import { User as UserType, TutorDetails, TutorDocumentItem } from '@/lib/userTypes'
import { useUserStore } from '@/store/userStore'
import { usersApi } from '@/lib/api/users'

export default function TutorDashboard() {
  const router = useRouter()
  // Use centralized stores
  const { user, userLoading, tutorDocuments, documentsLoading, fetchUser, fetchTutorDocuments } = useUserStore()
  const [tutorProfile, setTutorProfile] = useState<TutorDetails | null>(null)

  useEffect(() => {
    document.title = "Tutor Dashboard - OpenEducation";
  }, []);


  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const blob = await usersApi.downloadTutorDocument(documentId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  const handleCreateCourse = () => {
    router.push('/tutor/courses/create')
  }

  useEffect(() => {
    if (!user && !userLoading) {
      fetchUser()
    }
    if (user?.user_type === 'tutor' && tutorDocuments.length === 0 && !documentsLoading) {
      fetchTutorDocuments()
    }
  }, [user, userLoading, tutorDocuments.length, documentsLoading, fetchUser, fetchTutorDocuments])

  // Keep tutorProfile in sync when user changes
  useEffect(() => {
    if (!user) return
    const td = user.tutor_details || null
    setTutorProfile(td)
  }, [user])

  if (userLoading) {
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
            Welcome back, {user?.name || 'Tutor'}!
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
              <Button className="w-full justify-start" size="lg" onClick={handleCreateCourse}>
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
                <Button variant="outline" size="sm" onClick={handleCreateCourse}>
                  Create Your First Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Tutor Profile Details */}
        {tutorProfile && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Personal Information</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Name</span>
                  <span className="text-neutral-900 ml-4 text-right font-medium">{user?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Email</span>
                  <span className="text-neutral-900 ml-4 text-right">{user?.email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Gender</span>
                  <span className="text-neutral-900 ml-4 text-right capitalize">{tutorProfile.gender || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Date of Birth</span>
                  <span className="text-neutral-900 ml-4 text-right">{tutorProfile.dob || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Bio</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">{tutorProfile.bio || '—'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Professional Details</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Qualifications</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">
                    {tutorProfile.qualifications?.degree || '—'}
                  </span>
                </div>
                {tutorProfile.qualifications?.institution && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Institution</span>
                    <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">
                      {tutorProfile.qualifications.institution}
                    </span>
                  </div>
                )}
                {tutorProfile.qualifications?.year && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Year</span>
                    <span className="text-neutral-900 ml-4 text-right">
                      {tutorProfile.qualifications.year}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600">Teaching Experience</span>
                  <span className="text-neutral-900 ml-4 text-right">{tutorProfile.teaching_experience || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Specializations</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">
                    {(tutorProfile.specializations || []).join(', ') || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Expertise Areas</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">
                    {(tutorProfile.expertise_areas || []).join(', ') || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Languages</span>
                  <span className="text-neutral-900 ml-4 text-right max-w-[60%] truncate">
                    {(tutorProfile.languages_spoken || []).join(', ') || '—'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Verification & Bank Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900">Verification & Bank</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Verification Status</span>
                  <span className={`ml-4 text-right font-medium ${
                    tutorProfile.verification_status === 'verified' 
                      ? 'text-green-700' 
                      : tutorProfile.verification_status === 'pending'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  }`}>
                    {tutorProfile.verification_status?.charAt(0).toUpperCase() + tutorProfile.verification_status?.slice(1) || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Registration Fees</span>
                  <span className={`ml-4 text-right font-medium ${
                    tutorProfile.register_fees_paid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {tutorProfile.register_fees_paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                {tutorProfile.bank_details && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Bank Name</span>
                      <span className="text-neutral-900 ml-4 text-right">{tutorProfile.bank_details.bank_name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Account Holder</span>
                      <span className="text-neutral-900 ml-4 text-right">{tutorProfile.bank_details.account_holder_name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Account Number</span>
                      <span className="text-neutral-900 ml-4 text-right">
                        {tutorProfile.bank_details.account_number 
                          ? '•••• ' + String(tutorProfile.bank_details.account_number).slice(-4) 
                          : '—'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">IFSC Code</span>
                      <span className="text-neutral-900 ml-4 text-right">{tutorProfile.bank_details.ifsc_code || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Account Type</span>
                      <span className="text-neutral-900 ml-4 text-right capitalize">{tutorProfile.bank_details.account_type || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Bank Verified</span>
                      <span className={`ml-4 text-right font-medium ${
                        tutorProfile.bank_details.verified ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {tutorProfile.bank_details.verified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}



        {/* Documents Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Verification Documents
              </h2>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-neutral-600">Loading documents...</p>
                </div>
              ) : !Array.isArray(tutorDocuments) || tutorDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">No documents uploaded yet</p>
                  <Button variant="outline" size="sm">
                    Upload Documents
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(tutorDocuments) && tutorDocuments.map((doc) => (
                    <div key={doc.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-neutral-900">{doc.original_name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-neutral-600">
                              <span>{(parseInt(doc.file_size) / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc.id, doc.original_name)}
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
