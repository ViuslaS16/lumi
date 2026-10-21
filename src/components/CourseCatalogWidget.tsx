import React, { useState } from 'react';
import { COURSES_DATA, Course } from '@/data/courses';
import { BookOpen, Laptop, Clock } from 'lucide-react';

interface CourseCatalogWidgetProps {
  filterSkill?: string;
  onEnroll?: (course: Course) => void;
  onActionClick?: (action: 'menu') => void;
}

export const CourseCatalogWidget: React.FC<CourseCatalogWidgetProps> = ({
  filterSkill,
  onEnroll,
  onActionClick,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(filterSkill || 'All');
  const [enrolledMap, setEnrolledMap] = useState<Record<string, boolean>>({});

  const skills = ['All', 'Communication', 'Presentation', 'Security', 'Technical', 'Leadership', 'Teamwork'];

  const filteredCourses = selectedFilter === 'All'
    ? COURSES_DATA
    : COURSES_DATA.filter(c => c.skill.toLowerCase() === selectedFilter.toLowerCase());

  const handleSimulatedEnroll = (course: Course) => {
    setEnrolledMap(prev => ({ ...prev, [course.id]: true }));
    if (onEnroll) onEnroll(course);
  };

  return (
    <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
      <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#292524]">NovaLearn Course Catalog</h3>
            <p className="text-[11px] text-[#78716C]">{COURSES_DATA.length} featured internal programs</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 custom-scrollbar text-[11px]">
        {skills.map(skill => (
          <button
            key={skill}
            onClick={() => setSelectedFilter(skill)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === skill
                ? 'bg-[#D97706] text-white font-medium'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="space-y-2 mt-2">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledMap[course.id];
          return (
            <div
              key={course.id}
              className="p-3 rounded-xl border border-stone-200 bg-[#FFFBF5] text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-[#292524]">{course.name}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-stone-200 text-[#92400E] font-medium shrink-0">
                    {course.skill}
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                  {course.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#FEF3C7] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3 h-3 text-[#D97706]" />
                    {course.format}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D97706]" />
                    {course.duration}
                  </span>
                </div>

                <button
                  onClick={() => handleSimulatedEnroll(course)}
                  disabled={isEnrolled}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    isEnrolled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#D97706] hover:bg-[#92400E] text-white'
                  }`}
                >
                  {isEnrolled ? 'Enrolled (Simulated)' : 'Enroll'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[10px] text-stone-500 text-center leading-snug">
        Simulated course catalog for demonstration. Enrollment is recorded in local demo session only.
      </div>

      {onActionClick && (
        <div className="mt-3 pt-2 border-t border-[#F5F5F4] flex justify-end">
          <button
            onClick={() => onActionClick('menu')}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};
