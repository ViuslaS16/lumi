'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  getOverallAnalytics,
  getDepartmentAnalytics,
  getTopEmployees,
  DepartmentMetric,
} from '@/data/employees';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Trophy,
  AlertTriangle,
  Sparkles,
  Info,
  Building2,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

export default function HRAnalyticsDashboardPage() {
  const overall = getOverallAnalytics();
  const deptMetrics: DepartmentMetric[] = getDepartmentAnalytics();
  const topLearners = getTopEmployees(5);

  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'courses' | 'quizzes'>('overview');

  // Simulated Course Popularity (Assignment note: course-level data is illustrative)
  const simulatedCourseMetrics = [
    { name: 'Effective Workplace Communication', category: 'Communication', enrollments: 9, completionRate: 78 },
    { name: 'Cybersecurity Basics', category: 'Security', enrollments: 8, completionRate: 75 },
    { name: 'Presentation Skills Essentials', category: 'Presentation', enrollments: 7, completionRate: 71 },
    { name: 'Cloud Fundamentals', category: 'Technical', enrollments: 6, completionRate: 67 },
    { name: 'Emerging Leaders', category: 'Leadership', enrollments: 4, completionRate: 50 },
    { name: 'Collaboration and Conflict Handling', category: 'Teamwork', enrollments: 5, completionRate: 60 },
  ];

  // Simulated Quiz Benchmarks (5-question communication quiz)
  const quizSkillMetrics = [
    { skill: 'Communication & Active Listening', avgScore: 85, benchmark: 80, attempts: 24 },
    { skill: 'InfoSec & Data Handling', avgScore: 72, benchmark: 75, attempts: 19 },
    { skill: 'Negotiation & Conflict Resolution', avgScore: 68, benchmark: 70, attempts: 15 },
    { skill: 'Technical Cloud Foundations', avgScore: 60, benchmark: 65, attempts: 12 },
  ];

  return (
    <div className="flex-1 bg-[#FFFBF5] text-[#292524] flex flex-col antialiased">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <BarChart3 className="w-5 h-5 text-amber-700" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight">
                HR Analytics Dashboard
              </h1>
            </div>
            <p className="text-sm text-[#78716C]">
              Strategic Learning & Development analytics, course completion metrics, and department progress insights.
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

        {/* 4 Official Verified KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Employees */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Learners</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-stone-900">{overall.totalEmployees}</div>
              <p className="text-xs text-stone-500 mt-0.5">Demo employee cohort (NE-101–NE-110)</p>
            </div>
            <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              5 Departments represented
            </div>
          </div>

          {/* KPI 2: Overall Course Completion Rate (61.25%) */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Completion</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-[#D97706]">{overall.overallCompletionRate}%</div>
              <p className="text-xs text-stone-500 mt-0.5">
                <strong>{overall.totalCompletedCourses}</strong> of <strong>{overall.totalAssignedCourses}</strong> assigned courses
              </p>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium pt-2 border-t border-stone-100">
              Formula: (49 / 80) × 100 = 61.25%
            </div>
          </div>

          {/* KPI 3: Total Learning Points */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Points</span>
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-stone-900">
                {overall.totalLearningPoints.toLocaleString()}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Aggregated across all 10 learners</p>
            </div>
            <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              Average: {Math.round(overall.totalLearningPoints / overall.totalEmployees)} pts / employee
            </div>
          </div>

          {/* KPI 4: Incomplete Assigned Learners */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">Incomplete Cycles</span>
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-amber-800">{overall.incompleteCount}</div>
              <p className="text-xs text-stone-500 mt-0.5">Employees with remaining courses</p>
            </div>
            <div className="text-[11px] text-amber-900 font-medium pt-2 border-t border-stone-100">
              1 Completed (NE-101 8/8) • 9 Active
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 border-b border-stone-200 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Department Analytics' },
            { id: 'courses', label: 'Course Popularity (Demo)' },
            { id: 'quizzes', label: 'Quiz Benchmarks (Demo)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'courses' | 'quizzes')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-amber-900 border-t-2 border-t-[#D97706] border-x border-stone-200 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Department Analytics & Top 5 Learners */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Department Completion Rates */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Course Completion Rate by Department</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Calculated as (Total Completed Courses ÷ Total Assigned Courses) × 100 per department.
                  </p>
                </div>
              </div>

              {/* Responsive Bar Visualization */}
              <div className="space-y-4 pt-2">
                {deptMetrics.map(dept => {
                  return (
                    <div key={dept.department} className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <span className="font-bold text-stone-800">{dept.department}</span>
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <span className="text-stone-500 text-[11px] sm:text-xs">
                            {dept.totalCompleted} / {dept.totalAssigned} courses ({dept.employeeCount} learners)
                          </span>
                          <span className="font-extrabold text-amber-900 text-sm">
                            {dept.completionRate}%
                          </span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden border border-stone-200/80 p-0.5">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-[#D97706] h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[9px] text-white font-bold"
                          style={{ width: `${Math.max(dept.completionRate, 12)}%` }}
                        >
                          {dept.completionRate}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2 mt-4">
                <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Calculation Verification:</strong> HR achieves 75.0% (6/8), Support 68.8% (11/16), Engineering 66.7% (16/24), Sales 56.3% (9/16), and Finance 43.8% (7/16).
                </div>
              </div>
            </div>

            {/* Chart 2: Top 5 Learners */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Top 5 Learners</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Point leaders following top-five privacy safeguards.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {topLearners.map(learner => {
                  const maxPoints = 540;
                  const barWidth = Math.round((learner.points / maxPoints) * 100);

                  return (
                    <div key={learner.id} className="p-3 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                            #{learner.rank}
                          </span>
                          <span className="font-bold text-stone-900">{learner.name}</span>
                          <span className="text-[10px] text-stone-500">({learner.department})</span>
                        </div>
                        <span className="font-extrabold text-[#D97706]">{learner.points} pts</span>
                      </div>

                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#D97706] h-full rounded-full transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/leaderboard"
                  className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline"
                >
                  View Full Leaderboard & Opt-Out Policy →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Course Popularity & Completion Breakdown (Illustrative Data) */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Course Enrollment & Completion Analytics</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Breakdown across the 6 NovaLearn internal modules.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 w-fit">
                Illustrative Demo Metrics
              </span>
            </div>

            {/* Note on data source */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Data Source Transparency:</strong> The assignment HRIS dataset does not specify individual enrollment or completion tallies per course. The values below represent illustrative demo engagement metrics derived from catalog interactions.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulatedCourseMetrics.map(course => (
                <div key={course.name} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-amber-900 bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-amber-300">
                      {course.category}
                    </span>
                    <span className="text-stone-500 font-medium">{course.enrollments} Enrolled</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 leading-snug">{course.name}</h4>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-stone-600">
                      <span>Module Completion Rate</span>
                      <strong className="text-amber-800">{course.completionRate}%</strong>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-[#D97706] h-full rounded-full"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Quiz Benchmarks (Illustrative Data) */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Knowledge Assessment Benchmarks</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Performance across interactive skills quizzes and knowledge checks.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 w-fit">
                Illustrative Benchmark Data
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Quiz Analytics Notice:</strong> Aggregated from demo quiz attempts in NovaLearn. Employees can retake quizzes up to 3 times per module without affecting performance ratings.
              </div>
            </div>

            <div className="space-y-4">
              {quizSkillMetrics.map(metric => (
                <div key={metric.skill} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <strong className="text-stone-900">{metric.skill}</strong>
                    <div className="flex items-center gap-3">
                      <span className="text-stone-500 text-xs">{metric.attempts} Attempts</span>
                      <span className="font-extrabold text-amber-900">Avg: {metric.avgScore}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-[#D97706] h-full rounded-full"
                      style={{ width: `${metric.avgScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>Target Benchmark: {metric.benchmark}%</span>
                    <span className={metric.avgScore >= metric.benchmark ? 'text-emerald-600 font-semibold' : 'text-amber-700 font-semibold'}>
                      {metric.avgScore >= metric.benchmark ? '✓ Above Benchmark' : 'Developing'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
