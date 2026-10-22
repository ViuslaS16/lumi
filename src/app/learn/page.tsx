'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES_DATA, Course } from '@/data/courses';
import {
  BookOpen,
  Search,
  Sparkles,
  Clock,
  Laptop,
  Users,
  CheckCircle2,
  X,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function CourseCataloguePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('lumi_enrolled_courses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [enrollToast, setEnrollToast] = useState<{ courseName: string; format: string } | null>(null);

  // Client-side hydration: check localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('lumi_enrolled_courses');
        if (saved) {
          setEnrolledCourseIds(JSON.parse(saved));
        }
      } catch {}
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Handle simulated enrollment
  const handleEnroll = (course: Course) => {
    if (enrolledCourseIds.includes(course.id)) return;

    const updated = [...enrolledCourseIds, course.id];
    setEnrolledCourseIds(updated);
    try {
      localStorage.setItem('lumi_enrolled_courses', JSON.stringify(updated));
    } catch {}

    setEnrollToast({ courseName: course.name, format: course.format });
    setTimeout(() => {
      setEnrollToast(null);
    }, 4500);
  };

  const categories = ['All', 'Communication', 'Presentation', 'Leadership', 'Security', 'Technical', 'Teamwork'];

  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.skill.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchTerm.trim() === '' ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skill.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="flex-1 bg-[#FFFBF5] text-[#292524] flex flex-col antialiased">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <BookOpen className="w-5 h-5 text-amber-700" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight">
                Course Catalogue
              </h1>
            </div>
            <p className="text-sm text-[#78716C]">
              Browse self-paced online modules, workshops, and leadership cohorts in NovaLearn.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 hover:text-amber-900 text-xs sm:text-sm font-semibold shadow-xs transition-all w-fit cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Ask Lumi in Chat</span>
          </Link>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Simulated Enrollment Environment:</strong> Internal NovaLearn self-paced courses are auto-approved for NovaEdge employees. Enrolling in courses here is simulated for demo purposes and does not modify real corporate HRIS records or course completion counts.
          </div>
        </div>

        {/* Toast Alert for Enrollment */}
        {enrollToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Enrollment Confirmed:</span> You have simulated enrollment in{' '}
                <strong>&quot;{enrollToast.courseName}&quot;</strong> ({enrollToast.format}). Internal modules are auto-approved in NovaLearn!
              </div>
            </div>
            <button
              onClick={() => setEnrollToast(null)}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search courses by title, skill, or keyword..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-stone-400" />
                <span>Skill:</span>
              </span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedCategory.toLowerCase() === category.toLowerCase()
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map(course => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-900 bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-amber-300">
                        {course.skill}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">
                        {course.level}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                      {course.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Format & Duration Meta */}
                    <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {course.format.toLowerCase().includes('workshop') ? (
                          <Users className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{course.format}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Action */}
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-500">
                      ID: <span className="text-stone-700">{course.id}</span>
                    </span>

                    <button
                      onClick={() => handleEnroll(course)}
                      disabled={isEnrolled}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                        isEnrolled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-[#D97706] hover:bg-[#B45309] text-white active:scale-95'
                      }`}
                    >
                      {isEnrolled ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Enrolled</span>
                        </span>
                      ) : (
                        <span>Enroll Now</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-800">No courses match your search</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No courses found for &quot;{searchTerm}&quot; under the &quot;{selectedCategory}&quot; category. Try searching for &quot;Communication&quot;, &quot;Cloud&quot;, or clearing your filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
