import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { auth } from '@/lib/auth'
import { ArrowRight, Brain, Target, Zap } from 'lucide-react'

export function CTASection() {
  const handleGetStarted = () => {
    auth.signInWithGoogle()
  }

  return (
    <section className="py-24 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/20 via-transparent to-secondary-800/20"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the future of learning with AI-powered education. 
            Get personalized courses with 24/7 AI assistance and real-time feedback.
          </p>
          
          <div className="flex justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-white hover:bg-neutral-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              Start Learning Today
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-white/80 text-sm">Personalized learning experience</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Goal-Oriented</h3>
              <p className="text-white/80 text-sm">Set and track your learning goals</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Instant Feedback</h3>
              <p className="text-white/80 text-sm">Real-time progress insights</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
