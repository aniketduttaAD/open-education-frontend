import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { TrendingUp, Users, BookOpen, Star, Clock, Award } from 'lucide-react'

export function PlatformStats() {
  const features = [
    {
      icon: Users,
      title: "Personalized Learning",
      description: "AI adapts content to your learning style and pace",
      color: "blue"
    },
    {
      icon: BookOpen,
      title: "AI-Generated Content",
      description: "Dynamic courses created based on your needs",
      color: "purple"
    },
    {
      icon: Star,
      title: "Interactive Feedback",
      description: "Real-time insights and progress tracking",
      color: "yellow"
    },
    {
      icon: Clock,
      title: "24/7 AI Assistant",
      description: "Get help anytime with our AI learning companion",
      color: "green"
    },
    {
      icon: Award,
      title: "Goal Tracking",
      description: "Set and achieve your learning objectives",
      color: "red"
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description: "AI learns and improves with every interaction",
      color: "indigo"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            Platform Features
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover the powerful features that make OpenEducation the future of learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 bg-gradient-to-br from-white to-neutral-50">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    {(() => {
                      const IconComponent = feature.icon;
                      const colorClasses = {
                        blue: 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600',
                        purple: 'bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-600',
                        green: 'bg-gradient-to-br from-success-100 to-success-200 text-success-600',
                        yellow: 'bg-gradient-to-br from-warning-100 to-warning-200 text-warning-600',
                        red: 'bg-gradient-to-br from-error-100 to-error-200 text-error-600',
                        indigo: 'bg-gradient-to-br from-primary-100 to-secondary-200 text-primary-600'
                      };
                      return (
                        <div className={`w-16 h-16 ${colorClasses[feature.color as keyof typeof colorClasses]?.split(' ')[0]} ${colorClasses[feature.color as keyof typeof colorClasses]?.split(' ')[1]} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                          <IconComponent className={`w-8 h-8 ${colorClasses[feature.color as keyof typeof colorClasses]?.split(' ')[2]}`} />
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-3">{feature.title}</h3>
                  </div>
                  
                  <p className="text-neutral-600 text-base leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}
