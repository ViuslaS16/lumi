import React, { useState } from 'react';
import { COURSES_DATA, Course } from '@/data/courses';
import {
  TrendingUp,
  RotateCcw,
  Sparkles,
  Clock,
  Laptop,
} from 'lucide-react';

interface SkillAssessmentWidgetProps {
  onEnroll?: (course: Course) => void;
  onActionClick?: (action: 'menu') => void;
}

type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export const SkillAssessmentWidget: React.FC<SkillAssessmentWidgetProps> = ({
  onEnroll,
  onActionClick,
}) => {
  const [step, setStep] = useState<number>(0);
  const [communicationConfidence, setCommunicationConfidence] = useState<ConfidenceLevel | null>(null);
  const [presentationConfidence, setPresentationConfidence] = useState<ConfidenceLevel | null>(null);
  const [securityConfidence, setSecurityConfidence] = useState<ConfidenceLevel | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>({});

  const handleSelectConfidence = (level: ConfidenceLevel) => {
    if (step === 0) {
      setCommunicationConfidence(level);
      setStep(1);
    } else if (step === 1) {
      setPresentationConfidence(level);
      setStep(2);
    } else if (step === 2) {
      setSecurityConfidence(level);
      setStep(3); // Complete
    }
  };

  const handleReset = () => {
    setStep(0);
    setCommunicationConfidence(null);
    setPresentationConfidence(null);
    setSecurityConfidence(null);
  };

  const handleSimulatedEnroll = (course: Course) => {
    setEnrolledCourses(prev => ({ ...prev, [course.id]: true }));
    if (onEnroll) onEnroll(course);
  };

  // Generate recommendations based on the 3 questions
  const getRecommendedCourses = (): Course[] => {
    const list: Course[] = [];

    // Low communication -> Effective Workplace Communication
    if (communicationConfidence === 'Low' || communicationConfidence === 'Medium') {
      const commCourse = COURSES_DATA.find(c => c.name.includes('Effective Workplace Communication'));
      if (commCourse) list.push(commCourse);
    }

    // Low presentation -> Presentation Skills Essentials
    if (presentationConfidence === 'Low' || presentationConfidence === 'Medium') {
      const presCourse = COURSES_DATA.find(c => c.name.includes('Presentation Skills Essentials'));
      if (presCourse) list.push(presCourse);
    }

    // Low security -> Cybersecurity Basics
    if (securityConfidence === 'Low' || securityConfidence === 'Medium') {
      const secCourse = COURSES_DATA.find(c => c.name.includes('Cybersecurity Basics'));
      if (secCourse) list.push(secCourse);
    }

    // If user selected High for all, recommend advanced leadership or cloud
    if (list.length === 0) {
      const advanced = COURSES_DATA.filter(
        c => c.name.includes('Emerging Leaders') || c.name.includes('Cloud Fundamentals')
      );
      list.push(...advanced);
    }

    return list;
  };

  // Questions configuration
  const questions = [
    {
      skill: 'Workplace Communication',
      description: 'Handling everyday active listening, team feedback, and cross-departmental correspondence.',
    },
    {
      skill: 'Presentation & Public Speaking',
      description: 'Delivering technical pitches, slide deck structuring, and speaking before leadership.',
    },
    {
      skill: 'Cybersecurity & Technical Knowledge',
      description: 'Identifying phishing threats, cloud systems, and secure workplace digital protocols.',
    },
  ];

  // Completed Step: Display Course Recommendations
  if (step === 3) {
    const recommendedCourses = getRecommendedCourses();

    return (
      <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#292524]">Personalized Recommendations</h3>
              <p className="text-[11px] text-[#78716C]">Based on your 3-skill self-assessment</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retake</span>
          </button>
        </div>

        {/* Confidence Summary Pills */}
        <div className="my-3 flex flex-wrap gap-1.5 text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
            Comm: <strong>{communicationConfidence}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
            Presentation: <strong>{presentationConfidence}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
            Security: <strong>{securityConfidence}</strong>
          </span>
        </div>

        {/* Course Cards */}
        <div className="space-y-2.5 mt-3">
          {recommendedCourses.map(course => {
            const isEnrolled = enrolledCourses[course.id];
            return (
              <div
                key={course.id}
                className="p-3 rounded-xl border border-[#E7E5E4] bg-[#FFFBF5] text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#292524] text-xs">{course.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-[#E7E5E4] text-[#D97706] font-medium">
                      {course.skill}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-1 leading-snug">{course.description}</p>
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

        {/* Educational Disclaimer */}
        <div className="mt-3 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[10px] text-stone-500 text-center leading-snug">
          Recommendations are educational suggestions for your personal development, not performance evaluations.
        </div>

        {/* Actions */}
        {onActionClick && (
          <div className="mt-3 pt-2.5 border-t border-[#F5F5F4] flex justify-between">
            <button
              onClick={handleReset}
              className="text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Start Again
            </button>
            <button
              onClick={() => onActionClick('menu')}
              className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    );
  }

  // Active Question Steps 0, 1, 2
  const currentQ = questions[step];

  return (
    <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
      <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#292524]">Skill-Gap Assessment</h3>
            <p className="text-[11px] text-[#78716C]">Question {step + 1} of 3</p>
          </div>
        </div>

        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-6 h-1.5 rounded-full ${
                i <= step ? 'bg-[#D97706]' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="my-4">
        <h4 className="text-sm font-semibold text-[#292524]">
          How confident are you in {currentQ.skill}?
        </h4>
        <p className="text-xs text-[#78716C] mt-1 leading-snug">{currentQ.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['Low', 'Medium', 'High'] as ConfidenceLevel[]).map(level => (
          <button
            key={level}
            onClick={() => handleSelectConfidence(level)}
            className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-[#D97706] hover:bg-[#FFFBF5] text-xs font-semibold text-[#292524] transition-all text-center cursor-pointer"
          >
            {level}
          </button>
        ))}
      </div>

      <div className="mt-3 text-[10px] text-stone-400 italic text-center">
        Honest answers help Lumi pinpoint the most effective course recommendations for you.
      </div>
    </div>
  );
};
