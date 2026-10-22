'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EMPLOYEES_DATA, getEmployeeById, EmployeeRecord, getBadgeForRank } from '@/data/employees';
import {
  UserCheck,
  Search,
  Award,
  Trophy,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function EmployeeLearningDashboardPage() {
  const [selectedId, setSelectedId] = useState<string>('NE-104');
  const [searchInput, setSearchInput] = useState<string>('NE-104');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentEmployee: EmployeeRecord | undefined = getEmployeeById(selectedId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const found = EMPLOYEES_DATA.find(
      emp => emp.id.toUpperCase() === query ||
      emp.name.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setSelectedId(found.id);
      setSearchInput(found.id);
      setErrorMsg(null);
    } else {
      setErrorMsg(`No employee found matching "${query}". Valid demo IDs are NE-101 through NE-110.`);
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedId(id);
    setSearchInput(id);
    setErrorMsg(null);
  };

  // Calculations for current employee
  const completed = currentEmployee?.coursesCompleted ?? 0;
  const assigned = currentEmployee?.coursesAssigned ?? 8;
  const completionRate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;
  const remainingCourses = Math.max(0, assigned - completed);
  const badgeInfo = currentEmployee ? getBadgeForRank(currentEmployee.rank) : null;

  return (
    <div className="flex-1 bg-[#FFFBF5] text-[#292524] flex flex-col antialiased">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <UserCheck className="w-5 h-5 text-amber-700" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight">
                Employee Learning Dashboard
              </h1>
            </div>
            <p className="text-sm text-[#78716C]">
              Track learning progress, course completion, and development goals across NovaEdge Technologies.
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

        {/* Employee Selector Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label htmlFor="emp-search" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Select Employee (Demo IDs: NE-101 to NE-110)
              </label>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="emp-search"
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Enter ID (e.g. NE-104) or name (e.g. Anika)..."
                  className="w-full pl-10 pr-24 py-2 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Lookup
                </button>
              </form>
            </div>

            {/* Quick dropdown */}
            <div className="sm:w-56">
              <label htmlFor="emp-dropdown" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Or Select from Dropdown
              </label>
              <select
                id="emp-dropdown"
                value={selectedId}
                onChange={e => handleSelectEmployee(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white outline-none cursor-pointer"
              >
                {EMPLOYEES_DATA.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.id} — {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Select Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-stone-400 mr-1">Quick Select:</span>
            {EMPLOYEES_DATA.map(emp => (
              <button
                key={emp.id}
                onClick={() => handleSelectEmployee(emp.id)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedId === emp.id
                    ? 'bg-[#FEF3C7] text-amber-900 border border-amber-400 font-bold shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                }`}
              >
                {emp.id} ({emp.name.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {currentEmployee ? (
          <div className="space-y-6">
            {/* Identity & KPI Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Identity */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-amber-300">
                      {currentEmployee.id}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {currentEmployee.department}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">{currentEmployee.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">NovaEdge Technologies (Pvt) Ltd</p>
                </div>
                <div className="pt-3 border-t border-stone-100 mt-3 text-xs text-stone-600 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>Primary Skill: <strong className="text-stone-800">{currentEmployee.topSkill || 'L&D'}</strong></span>
                </div>
              </div>

              {/* Card 2: Completion Rate */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Completion</span>
                  <BookOpen className="w-4 h-4 text-amber-600" />
                </div>
                <div className="my-2">
                  <div className="text-3xl font-extrabold text-[#D97706]">{completionRate}%</div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    <strong>{completed}</strong> of <strong>{assigned}</strong> courses completed
                  </p>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#D97706] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Learning Points */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Points</span>
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>
                <div className="my-2">
                  <div className="text-3xl font-extrabold text-stone-900">{currentEmployee.points}</div>
                  <p className="text-xs text-stone-600 mt-0.5">Earned from courses & quizzes</p>
                </div>
                <div className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                  Calculated from 50 pts/course
                </div>
              </div>

              {/* Card 4: Rank & Badge */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Standing</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <div className="text-3xl font-extrabold text-stone-900">Rank #{currentEmployee.rank}</div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: `${badgeInfo?.color}20`,
                      borderColor: badgeInfo?.color,
                      color: currentEmployee.badge === 'Bronze' ? '#78350F' : '#1C1917',
                    }}
                  >
                    {badgeInfo?.label}
                  </span>
                </div>
                <div className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                  {currentEmployee.rank <= 5 ? 'Top 5 NovaEdge Learner' : 'Active NovaEdge Learner'}
                </div>
              </div>
            </div>

            {/* Detailed Progress & Pending Items Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Progress Visualization & Breakdown */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>Course Completion Breakdown</span>
                </h3>

                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-stone-700">Assigned Curriculum:</span>
                    <strong className="text-stone-900">{assigned} Courses</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-stone-700">Completed to Date:</span>
                    <strong className="text-emerald-700">{completed} Courses ({completionRate}%)</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-stone-700">Remaining Courses:</span>
                    <strong className="text-amber-800">{remainingCourses} Courses</strong>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-stone-600 font-medium">
                    <span>Overall Curriculum Progress</span>
                    <span>{completed} / {assigned} Completed</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-4 p-0.5 border border-stone-200">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-[#D97706] h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[9px] text-white font-bold"
                      style={{ width: `${Math.max(completionRate, 8)}%` }}
                    >
                      {completionRate}%
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Target: 100% compliance by year-end</span>
                  <Link href="/learn" className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1">
                    <span>Browse Courses</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Pending Learning Information */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Pending Learning Status</span>
                </h3>

                {remainingCourses === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">All assigned courses completed!</div>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        {currentEmployee.name} has completed 100% of assigned learning modules for this cycle.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs leading-relaxed space-y-2">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Pending Course Allocation ({remainingCourses} Remaining)</span>
                      </div>
                      <p>
                        Individual pending course details for all modules are not included in this demo dataset. Remaining course count is derived as ({assigned} assigned - {completed} completed).
                      </p>
                      {currentEmployee.pendingCourse && (
                        <div className="pt-2 border-t border-stone-200/80 mt-2">
                          <span className="font-medium text-stone-800">Assigned demo follow-up: </span>
                          <span className="font-bold text-amber-900">{currentEmployee.pendingCourse}</span>
                          {currentEmployee.pendingDueDate && (
                            <span className="text-stone-500 ml-1">(Due by {currentEmployee.pendingDueDate})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/?msg=Check+progress+for+${currentEmployee.id}`}
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 transition-colors"
                      >
                        Ask Lumi About {currentEmployee.id}
                      </Link>
                      <Link
                        href="/learn"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        Enroll in Remaining
                      </Link>
                    </div>
                  </div>
                )}

                {/* Assignment compliance note */}
                <div className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/60 text-[11px] text-stone-500">
                  <strong>Assignment Verification Note:</strong> For NE-104 (Anika R.), completion is verified as 6/8 (75.0%), 400 points, Rank #4, Silver Badge.
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
