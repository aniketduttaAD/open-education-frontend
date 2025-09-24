import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { animations } from "@/lib/animations";
import { ArrowRight } from "lucide-react";
import { GoogleLoginModal } from "@/components/auth/GoogleLoginModal";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGetStarted = () => {
    setShowLoginModal(true);
  };

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50' />

      {/* Animated Background Shapes */}
      <motion.div
        className='absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70'
        {...animations.floating}
      />

      <motion.div
        className='absolute top-40 right-20 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70'
        {...animations.floating}
        transition={{ duration: 3, delay: 1 }}
      />

      <motion.div
        className='absolute bottom-20 left-1/3 w-48 h-48 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-60'
        {...animations.floating}
        transition={{ duration: 3, delay: 2 }}
      />

      {/* Content */}
      <div className='relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Heading */}
        <motion.h1
          className='text-5xl md:text-7xl lg:text-8xl font-bold mb-6'
          {...animations.fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <span className='bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-800 bg-clip-text text-transparent'>
            Learn with AI
          </span>
          <br />
          <span className='text-neutral-800'>Master Anything</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className='text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed'
          {...animations.fadeInUp}
          transition={{ delay: 0.4 }}
        >
          Experience the future of learning with AI-generated courses,
          <span className='font-semibold text-primary-600'>
            {" "}
            personalized tutoring
          </span>
          , and interactive content that
          <span className='font-semibold text-secondary-600'>
            {" "}
            adapts to your pace
          </span>
          .
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className='flex flex-col sm:flex-row gap-6 justify-center mb-16'
          {...animations.fadeInUp}
          transition={{ delay: 0.6 }}
        >
          <Button
            size='lg'
            onClick={handleGetStarted}
            className='px-10 py-5 text-lg font-semibold group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
          >
            Start Learning
            <ArrowRight className='ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300' />
          </Button>
        </motion.div>
      </div>

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          // The auth state change listener in the main page will handle the user state update
        }}
      />
    </section>
  );
}
