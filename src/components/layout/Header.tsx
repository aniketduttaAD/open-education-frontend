import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  User as UserIcon,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { GoogleLoginModal } from "@/components/auth/GoogleLoginModal";
import { useAuthStore } from "@/store/authStore";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const fullText = "AI-Powered Education Platform";

  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // Persisted auth: if access_token exists, fetch profile on mount
    if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
      fetchProfile();
    }
  }, [fetchProfile]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        currentIndex = 0;
        setDisplayText("");
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 w-full'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
        <div className='flex justify-between items-center h-16 w-full'>
          {/* Logo and Badge */}
          <Link href='/' className='flex items-center space-x-4'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden'
            >
              <Image
                src='/logo1.png'
                alt='OpenEducation Logo'
                width={100}
                height={100}
                priority
              />
            </motion.div>
            <div className='flex items-center space-x-3'>
              <span className='text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'>
                OpenEducation
              </span>

              {/* AI Platform Badge with Typing Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='hidden md:flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-200 shadow-sm'
              >
                <Sparkles className='w-3 h-3 mr-1.5' />
                <span className='font-mono'>
                  {displayText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className='inline-block w-0.5 h-3 bg-primary-600 ml-0.5'
                  />
                </span>
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {/* Navigation links removed */}
          </nav>

          {/* User Actions */}
          <div className='flex items-center space-x-4'>
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  href={
                    user.user_type === "tutor"
                      ? "/tutor/dashboard"
                      : "/student/dashboard"
                  }
                >
                  <Button variant='outline' size='sm'>
                    {user.user_type === "tutor" ? (
                      <>
                        <GraduationCap className='w-4 h-4 mr-2' />
                        Teach
                      </>
                    ) : (
                      <>
                        <UserIcon className='w-4 h-4 mr-2' />
                        My Learning
                      </>
                    )}
                  </Button>
                </Link>

                {/* Profile Menu */}
                <div className='relative'>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className='flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors'
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={32}
                        height={32}
                        className='rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-sm font-medium'>
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2'
                    >
                      <div className='px-4 py-2 border-b border-neutral-200'>
                        <p className='text-sm font-medium text-neutral-900'>
                          {user.name || user.email}
                        </p>
                        <p className='text-xs text-neutral-500 capitalize'>
                          {user.user_type}
                        </p>
                      </div>
                      <Link
                        href='/profile'
                        className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100'
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      {user.user_type === 'tutor' ? (
                        <>
                          <Link href='/tutor/courses' className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100' onClick={() => setIsProfileOpen(false)}>
                            My Courses
                          </Link>
                          <Link href='/tutor/earnings' className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100' onClick={() => setIsProfileOpen(false)}>
                            Earnings
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href='/student/courses' className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100' onClick={() => setIsProfileOpen(false)}>
                            Enrolled Courses
                          </Link>
                          <Link href='/wishlist' className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100' onClick={() => setIsProfileOpen(false)}>
                            Wishlist
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => logout()}
                        className='block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100'
                      >
                        <LogOut className='w-4 h-4 inline mr-2' />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => setShowLoginModal(true)}>Sign In</Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors'
            >
              {isMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden border-t border-neutral-200 py-4'
          >
            {/* AI Platform Badge - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='flex items-center justify-center px-3 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-200 shadow-sm mb-4'
            >
              <Sparkles className='w-3 h-3 mr-1.5' />
              AI-Powered Education Platform
            </motion.div>

            <nav className='flex flex-col space-y-4'>
              {/* Navigation links removed */}
              {user && (
                <>
                  <Link
                    href={
                      user.user_type === "tutor"
                        ? "/tutor/dashboard"
                        : "/student/dashboard"
                    }
                    className='text-gray-700 hover:text-blue-600 transition-colors font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.user_type === "tutor" ? "Teach" : "My Learning"}
                  </Link>
                  <Link
                    href='/profile'
                    className='text-gray-700 hover:text-blue-600 transition-colors font-medium'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => logout()}
                    className='text-left text-gray-700 hover:text-blue-600 transition-colors font-medium'
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
        }}
      />
    </header>
  );
}
