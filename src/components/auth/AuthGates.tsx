'use client'

import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal'
import { StudentOnboardingModal } from '@/components/auth/StudentOnboardingModal'
import { useAuthStore } from '@/store/authStore'

export function AuthGates() {
  const showRole = useAuthStore(s => s.showRoleModal)
  const showStudent = useAuthStore(s => s.showStudentOnboarding)
  const user = useAuthStore(s => s.user)
  const loading = useAuthStore(s => s.loading)

  return (
    <>
      <RoleSelectionModal
        isOpen={!!showRole && !loading && !!user && !user.user_type}
        loading={loading}
      />
      <StudentOnboardingModal
        isOpen={!!showStudent && !loading}
        onComplete={() => {}}
        loading={loading}
      />
    </>
  )
}
