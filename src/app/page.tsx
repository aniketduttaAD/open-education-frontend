"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = user
        ? ["hero", "courses"]
        : ["hero", "why-choose", "cta"];
      const scrollPosition = window.scrollY + 150; // Increased offset for better detection

      let activeSectionFound = false;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionStart = offsetTop;
          const sectionEnd = offsetTop + offsetHeight;

          // Check if section is visible in viewport
          const isVisible =
            scrollPosition >= sectionStart && scrollPosition < sectionEnd;

          if (isVisible) {
            setActiveSection(section);
            activeSectionFound = true;
            break;
          }
        }
      }

      // Fallback: if no section is found, find the closest one
      if (!activeSectionFound) {
        let closestSection = sections[0];
        let minDistance = Infinity;

        sections.forEach((section) => {
          const element = document.getElementById(section);
          if (element) {
            const distance = Math.abs(element.offsetTop - scrollPosition);
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = section;
            }
          }
        });

        setActiveSection(closestSection);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    }, 300); // Increased delay for better reliability

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [user]);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: "student",
          onboarding_completed: false,
          role_selected_at: null,
          created_at: session.user.created_at || new Date().toISOString(),
          updated_at: session.user.updated_at || new Date().toISOString(),
        });
      } else {
        setUser(null);
      }

      // Role selection and onboarding are now handled in the main layout
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: "student",
            onboarding_completed: false,
            role_selected_at: null,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.updated_at || new Date().toISOString(),
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading OpenEducation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white w-full'>
      <main className='w-full'>
        <section id='hero' className='scroll-mt-20'>
          <HeroSection />
        </section>

        {/* Interactive Navigation */}
        <div className='fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block'>
          <div className='bg-white/90 backdrop-blur-sm rounded-full shadow-xl p-3 flex flex-col space-y-3 border border-white/20'>
            {(user
              ? ["hero", "why-choose", "courses", "cta"]
              : ["hero", "why-choose", "cta"]
            ).map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === section
                    ? "bg-primary-600 scale-125 shadow-md"
                    : "bg-neutral-400 hover:bg-neutral-500"
                }`}
                title={section
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              />
            ))}
          </div>
        </div>

        <section id='why-choose' className='scroll-mt-20'>
          <WhyChooseSection />
        </section>

        <section id='courses' className='scroll-mt-20'>
          <FeaturedCourses user={user} />
        </section>

        <section id='cta' className='scroll-mt-20'>
          <CTASection />
        </section>
      </main>
    </div>
  );
}
