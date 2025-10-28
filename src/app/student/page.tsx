"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookOpen, Compass, GraduationCap, User, ArrowRight, Sparkles } from "lucide-react";
import { Course } from "@/lib/types";
import { CourseGrid } from "@/components/courses/CourseGrid";

export default function StudentHomePage() {
  return (
    <div className="bg-neutral-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Student Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Welcome to your learning space
          </h1>
          <p className="mt-2 text-neutral-600 max-w-2xl">
            Discover courses, track progress, and personalize your journey with our AI-powered platform.
          </p>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mr-4">
                  <Compass className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">Explore Courses</h3>
                  <p className="mt-1 text-sm text-neutral-600">Browse curated content across trending topics.</p>
                  <Link href="/courses" aria-label="Browse all courses">
                    <Button className="mt-4" size="sm" variant="outline">
                      Start exploring
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center mr-4">
                  <GraduationCap className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">Go to Dashboard</h3>
                  <p className="mt-1 text-sm text-neutral-600">See your learning stats and recent activity.</p>
                  <Link href="/student/dashboard" aria-label="Open student dashboard">
                    <Button className="mt-4" size="sm">
                      Open dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-warning-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">Complete Onboarding</h3>
                  <p className="mt-1 text-sm text-neutral-600">Personalize recommendations based on your goals.</p>
                  <Link href="/student/onboarding" aria-label="Open student onboarding">
                    <Button className="mt-4" size="sm" variant="outline">
                      Get started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sample Courses */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">Browse sample courses</h2>
            <p className="text-neutral-600 text-sm">Public preview. Sign in to enroll and track progress.</p>
          </div>

          <CourseGrid courses={SAMPLE_COURSES} />
        </section>
      </main>
    </div>
  );
}


const SAMPLE_COURSES: Course[] = [
  {
    id: "sample-1",
    tutor_id: "tutor-1",
    title: "Introduction to AI with Python",
    description: "Learn the basics of AI and build simple models using Python.",
    price: 0,
    status: "published",
    avg_rating: 4.6,
    total_ratings: 1320,
    total_enrollments: 5821,
    completion_rate: 78,
    estimated_duration: 240,
    total_revisions_requested: 0,
    max_revisions_allowed: 0,
    thumbnail_url: null,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    tutor_id: "tutor-2",
    title: "Modern Web Development Fundamentals",
    description: "A practical intro to HTML, CSS, JavaScript, and modern tooling.",
    price: 499,
    status: "published",
    avg_rating: 4.4,
    total_ratings: 980,
    total_enrollments: 4250,
    completion_rate: 65,
    estimated_duration: 360,
    total_revisions_requested: 0,
    max_revisions_allowed: 0,
    thumbnail_url: null,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    tutor_id: "tutor-3",
    title: "Data Visualization with D3.js",
    description: "Create interactive, data-driven visuals on the web with D3.",
    price: 799,
    status: "published",
    avg_rating: 4.7,
    total_ratings: 540,
    total_enrollments: 2100,
    completion_rate: 72,
    estimated_duration: 300,
    total_revisions_requested: 0,
    max_revisions_allowed: 0,
    thumbnail_url: null,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "sample-4",
    tutor_id: "tutor-4",
    title: "SQL for Analysts",
    description: "Query relational databases efficiently and analyze business data.",
    price: 299,
    status: "published",
    avg_rating: 4.5,
    total_ratings: 760,
    total_enrollments: 3100,
    completion_rate: 69,
    estimated_duration: 180,
    total_revisions_requested: 0,
    max_revisions_allowed: 0,
    thumbnail_url: null,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "sample-5",
    tutor_id: "tutor-5",
    title: "Intro to Cloud with AWS",
    description: "Core AWS services and best practices to deploy your first app.",
    price: 999,
    status: "published",
    avg_rating: 4.3,
    total_ratings: 410,
    total_enrollments: 1700,
    completion_rate: 60,
    estimated_duration: 420,
    total_revisions_requested: 0,
    max_revisions_allowed: 0,
    thumbnail_url: null,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "sample-6",
    tutor_id: "tutor-6",
    title: "Fundamentals of Machine Learning",
    description: "From linear regression to tree-based models with intuition first.",
    price: 1499,
    status: "published",
    avg_rating: 4.8,
    total_ratings: 2200,
    total_enrollments: 9100,
    completion_rate: 81,
    estimated_duration: 540,
    total_revisions_requested: 0,
    max_revisions_allowed: 0,
    thumbnail_url: null,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
];


