import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, CourseWithTutor, CourseEnrollment } from "@/lib/types";

interface CoursesState {
  // Courses data
  courses: Course[];
  coursesLoading: boolean;
  coursesError: string | null;
  
  // Course details
  currentCourse: CourseWithTutor | null;
  courseLoading: boolean;
  courseError: string | null;
  
  // Enrollments
  enrollments: CourseEnrollment[];
  enrollmentLoading: boolean;
  enrollmentError: string | null;
  
  // Actions
  fetchCourses: () => Promise<void>;
  fetchCourse: (courseId: string) => Promise<void>;
  fetchEnrollments: () => Promise<void>;
  
  // Course management
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: CourseWithTutor | null) => void;
  addEnrollment: (enrollment: CourseEnrollment) => void;
  updateEnrollment: (enrollmentId: string, updates: Partial<CourseEnrollment>) => void;
  
  // Utility
  getCourseById: (courseId: string) => Course | null;
  isEnrolled: (courseId: string) => boolean;
  getEnrollment: (courseId: string) => CourseEnrollment | null;
  
  // Clear data
  clearCourses: () => void;
  clearCurrentCourse: () => void;
  clearEnrollments: () => void;
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set, get) => ({
      // Initial state
      courses: [],
      coursesLoading: false,
      coursesError: null,
      
      currentCourse: null,
      courseLoading: false,
      courseError: null,
      
      enrollments: [],
      enrollmentLoading: false,
      enrollmentError: null,

      // Actions
      fetchCourses: async () => {
        const state = get();
        if (state.coursesLoading) return; // Prevent duplicate calls
        
        set({ coursesLoading: true, coursesError: null });
        try {
          // TODO: Replace with actual API call when available
          // const courses = await coursesApi.getCourses();
          const courses: Course[] = []; // Placeholder
          set({ courses, coursesLoading: false });
        } catch (error) {
          console.error('Failed to fetch courses:', error);
          set({ 
            courses: [], 
            coursesLoading: false, 
            coursesError: error instanceof Error ? error.message : 'Failed to fetch courses' 
          });
        }
      },

      fetchCourse: async (courseId: string) => {
        const state = get();
        if (state.courseLoading) return; // Prevent duplicate calls
        
        set({ courseLoading: true, courseError: null });
        try {
          // TODO: Replace with actual API call when available
          // const course = await coursesApi.getCourse(courseId);
          const course: CourseWithTutor | null = null; // Placeholder
          set({ currentCourse: course, courseLoading: false });
        } catch (error) {
          console.error('Failed to fetch course:', error);
          set({ 
            currentCourse: null, 
            courseLoading: false, 
            courseError: error instanceof Error ? error.message : 'Failed to fetch course' 
          });
        }
      },

      fetchEnrollments: async () => {
        const state = get();
        if (state.enrollmentLoading) return; // Prevent duplicate calls
        
        set({ enrollmentLoading: true, enrollmentError: null });
        try {
          // TODO: Replace with actual API call when available
          // const enrollments = await coursesApi.getEnrollments();
          const enrollments: CourseEnrollment[] = []; // Placeholder
          set({ enrollments, enrollmentLoading: false });
        } catch (error) {
          console.error('Failed to fetch enrollments:', error);
          set({ 
            enrollments: [], 
            enrollmentLoading: false, 
            enrollmentError: error instanceof Error ? error.message : 'Failed to fetch enrollments' 
          });
        }
      },

      // Course management
      setCourses: (courses) => {
        set({ courses });
      },

      setCurrentCourse: (course) => {
        set({ currentCourse: course });
      },

      addEnrollment: (enrollment) => {
        set((state) => ({
          enrollments: [...state.enrollments, enrollment]
        }));
      },

      updateEnrollment: (enrollmentId, updates) => {
        set((state) => ({
          enrollments: state.enrollments.map(enrollment =>
            enrollment.id === enrollmentId
              ? { ...enrollment, ...updates }
              : enrollment
          )
        }));
      },

      // Utility functions
      getCourseById: (courseId) => {
        const state = get();
        return state.courses.find(course => course.id === courseId) || null;
      },

      isEnrolled: (courseId) => {
        const state = get();
        return state.enrollments.some(enrollment => enrollment.course_id === courseId);
      },

      getEnrollment: (courseId) => {
        const state = get();
        return state.enrollments.find(enrollment => enrollment.course_id === courseId) || null;
      },

      // Clear data
      clearCourses: () => {
        set({ courses: [], coursesError: null });
      },

      clearCurrentCourse: () => {
        set({ currentCourse: null, courseError: null });
      },

      clearEnrollments: () => {
        set({ enrollments: [], enrollmentError: null });
      }
    }),
    {
      name: "courses-store",
      partialize: (state) => ({
        courses: state.courses,
        currentCourse: state.currentCourse,
        enrollments: state.enrollments
      })
    }
  )
);
