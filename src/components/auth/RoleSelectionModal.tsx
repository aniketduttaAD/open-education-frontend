'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, GraduationCap, BookOpen, Users, Award } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/ToastProvider'

interface RoleSelectionModalProps {
  isOpen: boolean
  onRoleSelect?: (role: 'student' | 'tutor') => void
  loading?: boolean
}

export function RoleSelectionModal({ isOpen, onRoleSelect, loading = false }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>(null)
  const selectRole = useAuthStore(s => s.selectRole)
  const { showToast } = useToast()
  const router = useRouter()

  const handleContinue = async () => {
    if (!selectedRole) return
    await selectRole(selectedRole)
    showToast(`Continuing as ${selectedRole === 'student' ? 'Student' : 'Tutor'}`, 'success')
    onRoleSelect?.(selectedRole)
    // Navigate to details page explicitly
    if (selectedRole === 'student') router.push('/student/onboarding')
    if (selectedRole === 'tutor') router.push('/tutor/onboarding')
  }

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn from expert tutors and access high-quality courses',
      icon: User,
      features: [
        'Access to AI-generated courses',
        'Interactive learning experience',
        'Progress tracking and certificates',
        'AI buddy support',
        'Gamified learning with achievements'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'tutor',
      title: 'Tutor',
      description: 'Create and sell courses with AI assistance',
      icon: GraduationCap,
      features: [
        'AI-powered course creation',
        'Automated content generation',
        'Earnings from course sales',
        'Student analytics and insights',
        'Professional verification process'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
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
            className="w-full max-w-4xl mx-4"
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to OpenEducation!
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose your role to get started. This will help us personalize your learning experience.
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {roles.map((role) => {
                    const Icon = role.icon
                    const isSelected = selectedRole === role.id
                    
                    return (
                      <motion.div
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? `${role.borderColor} shadow-lg` 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${role.bgColor}`}
                        onClick={() => setSelectedRole(role.id as 'student' | 'tutor')}
                      >
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-lg flex items-center justify-center mr-4`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>

                          <ul className="space-y-2">
                            {role.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    disabled={!selectedRole || loading}
                    onClick={handleContinue}
                    className="px-8 py-3 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Setting up your account...
                      </div>
                    ) : (
                      `Continue as ${selectedRole === 'student' ? 'Student' : selectedRole === 'tutor' ? 'Tutor' : 'User'}`
                    )}
                  </Button>
                  {!selectedRole && (
                    <p className="text-sm text-gray-500 mt-3">
                      Please select a role to continue
                    </p>
                  )}
                </div>

                <div className="mt-8 text-center">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Join as Early Adopter</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      <span>AI-Powered Learning</span>
                    </div>
                    <div className="flex items-center">
                      <span>₹ 500-1000 per course</span>
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
