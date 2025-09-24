import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { animations } from "@/lib/animations";
import {
  Target,
  Zap,
  Brain,
  BookOpen,
  Award,
  Users,
  Star,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function WhyChooseSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Personalized learning experiences with AI-generated content that adapts to your pace and learning style.",
      category: "core",
    },
    {
      icon: BookOpen,
      title: "Expert Content",
      description:
        "High-quality courses created by verified tutors with AI assistance for comprehensive learning materials.",
      category: "core",
    },
    {
      icon: Award,
      title: "Certified Learning",
      description:
        "Earn verifiable certificates upon course completion with QR code verification for authenticity.",
      category: "core",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description:
        "Get immediate feedback on quizzes and assignments with AI-powered analysis and recommendations.",
      category: "engagement",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description:
        "Set learning goals and track your progress with detailed analytics and achievement systems.",
      category: "engagement",
    },
    {
      icon: Clock,
      title: "24/7 AI Assistant",
      description:
        "Get help anytime with our AI learning companion that understands your course content.",
      category: "support",
    },
    {
      icon: Users,
      title: "Community Learning",
      description:
        "Connect with fellow learners and tutors in a supportive educational community.",
      category: "social",
    },
    {
      icon: Star,
      title: "Gamified Experience",
      description:
        "Earn achievements, maintain streaks, and compete on leaderboards to stay motivated.",
      category: "engagement",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with encrypted data and reliable infrastructure for uninterrupted learning.",
      category: "security",
    },
  ];

  const cardsPerView = 2;
  const totalSlides = Math.ceil(features.length / cardsPerView);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < totalSlides - 1;

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      const scrollPosition = index * (cardWidth + gap) * cardsPerView;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const scrollLeft = () => {
    if (canScrollLeft) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 320;
      const gap = 24;
      const newIndex = Math.round(
        scrollLeft / ((cardWidth + gap) * cardsPerView)
      );
      setCurrentIndex(Math.max(0, Math.min(newIndex, totalSlides - 1)));
    }
  };

  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          {...animations.fadeInUp}
          transition={{ delay: 0.2 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6'>
            Why Choose OpenEducation?
          </h2>
          <p className='text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed'>
            Experience the future of learning with our AI-powered platform
            designed to make education accessible, efficient, and engaging.
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className='relative flex items-center'>
          {/* Left Arrow */}
          <motion.button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center transition-all duration-300 z-10 ${
              canScrollLeft
                ? "hover:bg-neutral-50 hover:shadow-xl text-neutral-600"
                : "opacity-50 cursor-not-allowed text-neutral-400"
            }`}
          >
            <ChevronLeft className='w-6 h-6' />
          </motion.button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className='flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-6 flex-1'
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='flex-shrink-0 w-80'
              >
                <Card className='h-full group hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-neutral-200 bg-gradient-to-br from-white to-neutral-50'>
                  <CardContent className='p-8 text-center'>
                    <div className='w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg'>
                      <feature.icon className='w-8 h-8 text-primary-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-neutral-800 mb-4'>
                      {feature.title}
                    </h3>
                    <p className='text-sm text-neutral-600 leading-relaxed'>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <motion.button
            onClick={scrollRight}
            disabled={!canScrollRight}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-neutral-200 flex items-center justify-center transition-all duration-300 z-10 ${
              canScrollRight
                ? "hover:bg-neutral-50 hover:shadow-xl text-neutral-600"
                : "opacity-50 cursor-not-allowed text-neutral-400"
            }`}
          >
            <ChevronRight className='w-6 h-6' />
          </motion.button>
        </div>

        {/* Clickable Slide Indicators */}
        <motion.div
          className='flex justify-center mt-6 space-x-2'
          {...animations.fadeIn}
          transition={{ delay: 0.4 }}
        >
          {Array.from({ length: totalSlides }, (_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollToIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "bg-primary-600 scale-125 shadow-md"
                  : "bg-neutral-400 hover:bg-neutral-500"
              }`}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
