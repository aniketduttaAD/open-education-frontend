import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Course } from '@/lib/api/courses'
import { Play, Clock, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

const gradientVariants = [
  "from-violet-500 via-purple-500 to-indigo-600",
  "from-blue-500 via-cyan-500 to-teal-600",
  "from-emerald-500 via-green-500 to-lime-600",
  "from-orange-500 via-amber-500 to-yellow-600",
  "from-rose-500 via-pink-500 to-fuchsia-600",
  "from-indigo-500 via-blue-500 to-cyan-600",
];

export function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  // Generate consistent gradient based on course ID
  const gradientIndex = course.id
    ? parseInt(course.id.replace(/\D/g, "").slice(0, 6) || "0") %
      gradientVariants.length
    : 0;
  const gradient = gradientVariants[gradientIndex];

  const isFree = course.price === 0;

  return (
    <Card className="group h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-200">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden h-56">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white rounded-full animate-pulse delay-75" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full animate-pulse delay-150" />
        </div>

        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {/* Course info overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 drop-shadow-lg">
            {course.title}
          </h3>
          <p className="text-sm text-white/90 drop-shadow">
            By {course.tutor?.name || 'Expert Tutor'}
          </p>
        </div>

        {/* Featured badge */}
        {course.is_featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        )}

        {/* Free badge */}
        {isFree && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            FREE
          </div>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col p-6">
        {/* Description */}
        <p className="text-gray-600 mb-5 line-clamp-2 flex-1 leading-relaxed">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="space-y-4 mb-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                {course.sections?.length || 0} sections
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
              <Play className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                {course.sections?.reduce((sum, section) => sum + (section.subtopics?.length || 0), 0) || 0} videos
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                {formatDuration(course.estimated_duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Price and Status */}
        <div className="flex items-center justify-between mb-5">
          <div>
            {!isFree && (
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(course.price)}
              </div>
            )}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              course.status === "published"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {course.status === "published" ? "✓ Available" : "Coming Soon"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/courses/${course.id}`} className="flex-1">
            <Button
              className="w-full border-2 hover:bg-gray-50"
              variant="outline"
            >
              View Details
            </Button>
          </Link>
          {course.status === "published" && (
            <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
              {isFree ? "Access Now" : "Enroll Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
