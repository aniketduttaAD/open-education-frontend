"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  MapPin,
  Target,
  Edit3,
} from "lucide-react";
import { usersApi } from "@/lib/api/users";
import { useUserStore } from "@/store/userStore";
import type { User as UserType } from "@/lib/userTypes";

export default function ProfilePage() {
  const { user, userLoading, userError, fetchUser } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Profile - OpenEducation";

    const loadProfile = async () => {
      try {
        setError(null);
        // If user is not already loaded, fetch it
        if (!user) {
          await fetchUser();
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    };

    loadProfile();
  }, [user, fetchUser]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError || error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <p className="text-gray-600 text-sm">{userError || error}</p>
          <Button 
            onClick={() => fetchUser()} 
            className="mt-4"
            variant="primary"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Image
                    src={user.image || "/logo.png"}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    width={80}
                    height={80}
                    unoptimized
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 capitalize">
                      {user.user_type}
                    </p>
                    <div className="flex items-center mt-1">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          user.onboarding_complete
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {user.onboarding_complete
                          ? "Profile Complete"
                          : "Profile Incomplete"}
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
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gender
                    </label>
                    <p className="text-gray-900 capitalize">
                      {user.student_details?.gender ||
                        user.gender ||
                        "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {user.student_details?.dob
                        ? formatDate(user.student_details.dob)
                        : user.dob
                        ? formatDate(user.dob)
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            {user.user_type === "student" && user.student_details && (
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
                      <label className="text-sm font-medium text-gray-600">
                        Degree
                      </label>
                      <p className="text-gray-900">
                        {user.student_details.degree}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        College/University
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {user.student_details.college_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Education Level
                      </label>
                      <p className="text-gray-900 capitalize">
                        {user.student_details.education_level}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Experience Level
                      </label>
                      <p className="text-gray-900 capitalize">
                        {user.student_details.experience_level}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Preferences - Student Only */}
            {user.user_type === "student" && user.student_details && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Learning Preferences
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.student_details.interests?.map(
                        (interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {interest}
                          </span>
                        )
                      ) || <span className="text-gray-500 text-sm">No interests specified</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Learning Goals
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.student_details.learning_goals?.map(
                        (goal, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {goal}
                          </span>
                        )
                      ) || <span className="text-gray-500 text-sm">No learning goals specified</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Preferred Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.student_details.preferred_languages?.map(
                        (language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                          >
                            {language}
                          </span>
                        )
                      ) || <span className="text-gray-500 text-sm">No preferred languages specified</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Professional Information - Tutor Only */}
            {user.user_type === "tutor" && user.tutor_details && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                    Professional Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Bio
                    </label>
                    <p className="text-gray-900">
                      {user.tutor_details.bio || "No bio provided"}
                    </p>
                  </div>
                  
                  {user.tutor_details.teaching_experience && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Teaching Experience
                      </label>
                      <p className="text-gray-900">
                        {user.tutor_details.teaching_experience}
                      </p>
                    </div>
                  )}

                  {user.tutor_details.specializations && user.tutor_details.specializations.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Specializations
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.tutor_details.specializations.map(
                          (specialization, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {specialization}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {user.tutor_details.languages_spoken && user.tutor_details.languages_spoken.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Languages Spoken
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.tutor_details.languages_spoken.map(
                          (language, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                            >
                              {language}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {user.tutor_details.expertise_areas && user.tutor_details.expertise_areas.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Expertise Areas
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.tutor_details.expertise_areas.map(
                          (area, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                            >
                              {area}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Verification Status
                    </label>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          user.tutor_details.verification_status === "verified"
                            ? "bg-green-100 text-green-800"
                            : user.tutor_details.verification_status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.tutor_details.verification_status === "verified"
                          ? "✓ Verified"
                          : user.tutor_details.verification_status === "rejected"
                          ? "✗ Rejected"
                          : "⏳ Pending"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Registration Fees
                    </label>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          user.tutor_details.register_fees_paid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.tutor_details.register_fees_paid
                          ? "✓ Paid"
                          : "✗ Not Paid"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
