'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Mail, Calendar, GraduationCap, MapPin, Target, Edit3 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'

interface UserProfile {
  id: string
  email: string
  name: string
  image: string
  gender: string | null
  bio: string | null
  dob: string | null
  user_type: 'student' | 'tutor'
  tutor_details: any | null
  student_details: {
    dob: string
    degree: string
    gender: string
    interests: string[]
    college_name: string
    learning_goals: string[]
    education_level: string
    experience_level: string
    preferred_languages: string[]
  } | null
  onboarding_complete: boolean
  document_verification: any | null
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useUserStore()

  useEffect(() => {
    document.title = "Profile - OpenEducation"
    
    // Simulate API call with the provided data
    const fetchProfile = async () => {
      try {
        // In real implementation, this would be an API call
        const mockResponse = {
          "success": true,
          "data": {
            "id": "8af0f5b5-c61c-4649-b45c-ac01b5d2ef03",
            "email": "helloaniketdutta@gmail.com",
            "name": "Aniket Dutta",
            "image": "https://lh3.googleusercontent.com/a/ACg8ocJ2xBYsHakSnflfsWmTgd8fi69D2G6v2YIYA8e8hMenC3LY2g=s96-c",
            "gender": null,
            "bio": null,
            "dob": null,
            "user_type": "student",
            "tutor_details": null,
            "student_details": {
              "dob": "2002-07-02",
              "degree": "mca, bca",
              "gender": "male",
              "interests": ["mathematics"],
              "college_name": "srm university",
              "learning_goals": ["python learing"],
              "education_level": "undergraduate",
              "experience_level": "beginer",
              "preferred_languages": ["english"]
            },
            "onboarding_complete": true,
            "document_verification": null,
            "created_at": "2025-10-27T23:24:51.004Z",
            "updated_at": "2025-10-27T23:36:24.170Z"
          },
          "message": "Operation completed successfully",
          "timestamp": "2025-10-27T23:38:21.925Z"
        }
        
        setProfile(mockResponse.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600 capitalize">{profile.user_type}</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        profile.onboarding_complete ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-600">
                        {profile.onboarding_complete ? 'Profile Complete' : 'Profile Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="primary" className="w-full">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{profile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-900 capitalize">
                      {profile.student_details?.gender || profile.gender || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {profile.student_details?.dob ? formatDate(profile.student_details.dob) : 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            {profile.user_type === 'student' && profile.student_details && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                    Academic Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Degree</label>
                      <p className="text-gray-900">{profile.student_details.degree}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">College/University</label>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.student_details.college_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Education Level</label>
                      <p className="text-gray-900 capitalize">{profile.student_details.education_level}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Experience Level</label>
                      <p className="text-gray-900 capitalize">{profile.student_details.experience_level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Preferences */}
            {profile.user_type === 'student' && profile.student_details && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Learning Preferences
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Interests</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.student_details.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Learning Goals</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.student_details.learning_goals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferred Languages</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.student_details.preferred_languages.map((language, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
