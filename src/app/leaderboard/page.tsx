'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EMPLOYEES_DATA, getEmployeeById, getBadgeForRank, EmployeeRecord } from '@/data/employees';
import {
  Trophy,
  Award,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Search,
} from 'lucide-react';

export default function LeaderboardPage() {
  const [selectedDemoId, setSelectedDemoId] = useState<string>('NE-104'); // default to Anika R.
  const [isOptedOut, setIsOptedOut] = useState<boolean>(false);

  // Top 5 employees (Public named view)
  const topFive = [...EMPLOYEES_DATA].sort((a, b) => a.rank - b.rank).slice(0, 5);

  // Full list sorted for private lookup
  const allSorted = [...EMPLOYEES_DATA].sort((a, b) => a.rank - b.rank);

  // Selected personal employee record
  const selectedEmp: EmployeeRecord | undefined = getEmployeeById(selectedDemoId);

  return (
    <div className="flex-1 bg-[#FFFBF5] text-[#292524] flex flex-col antialiased">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Trophy className="w-5 h-5 text-amber-700" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] tracking-tight">
                Learning Leaderboard
              </h1>
            </div>
            <p className="text-sm text-[#78716C]">
              Recognizing top learner engagement, course achievements, and knowledge badges at NovaEdge.
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

        {/* Privacy & Opt-Out Notice Card */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-600 leading-relaxed">
              <strong className="text-stone-900">Privacy Safeguard (Assignment Policy):</strong> To protect employee privacy, only the <strong>Top 5 Learners</strong> are displayed on the public leaderboard. Ranks 6–10 remain confidential.
              <p className="text-stone-500 mt-0.5">
                Leaderboard participation is optional. You can opt out in NovaLearn settings. (Fictional demo data).
              </p>
            </div>
          </div>

          {/* Local Opt-Out Demo Toggle */}
          <button
            onClick={() => setIsOptedOut(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isOptedOut
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            {isOptedOut ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Opted Out (Demo)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-stone-500" />
                <span>Leaderboard: Active</span>
              </>
            )}
          </button>
        </div>

        {/* Points System Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <span className="font-bold text-amber-900 block mb-0.5">🥇 Gold Badge (Rank 1–3)</span>
            <p className="text-stone-600">Awarded to top 3 learners with highest accumulated points (430–540 pts).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-800 block mb-0.5">🥈 Silver Badge (Rank 4–5)</span>
            <p className="text-stone-600">Awarded to high-achieving learners in top 5 standing (360–400 pts).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/30 border border-stone-200">
            <span className="font-bold text-amber-950 block mb-0.5">🥉 Bronze Badge (Rank 6–10)</span>
            <p className="text-stone-600">Awarded to active learners progressing through their assigned catalog.</p>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {topFive.slice(0, 3).map((learner, idx) => {
            const badge = getBadgeForRank(learner.rank);
            const podiumPositions = [
              { label: '1st Place', border: 'border-amber-400 bg-gradient-to-b from-amber-50/80 to-white' },
              { label: '2nd Place', border: 'border-stone-300 bg-gradient-to-b from-stone-50/80 to-white' },
              { label: '3rd Place', border: 'border-amber-600/40 bg-gradient-to-b from-amber-50/40 to-white' },
            ];
            const pos = podiumPositions[idx];

            return (
              <div
                key={learner.id}
                className={`rounded-2xl p-5 border-2 ${pos.border} shadow-sm flex flex-col items-center text-center relative`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base shadow-inner mb-3 border"
                  style={{ backgroundColor: `${badge.color}30`, borderColor: badge.color }}
                >
                  #{learner.rank}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-0.5">
                  {pos.label}
                </div>
                <h3 className="font-bold text-lg text-stone-900">{learner.name}</h3>
                <p className="text-xs text-stone-500">{learner.department} • {learner.id}</p>

                <div className="mt-4 pt-3 border-t border-stone-200/60 w-full flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-600">{learner.coursesCompleted} of 8 Courses</span>
                  <span className="font-extrabold text-[#D97706] text-sm">{learner.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Public Leaderboard Table: Top 5 Named + Ranks 6-10 Privacy Masked */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>NovaEdge Company Standings (Top 5 Public View)</span>
            </h3>
            <span className="text-xs text-stone-500">Updated: Current Cycle</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50/80 text-stone-500 font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Completed</th>
                  <th className="py-3 px-4 text-right">Points</th>
                  <th className="py-3 px-4 text-center">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {allSorted.map(emp => {
                  const isTopFive = emp.rank <= 5;
                  const isSelectedUser = selectedEmp?.id === emp.id;
                  const badge = getBadgeForRank(emp.rank);

                  // If not top 5, mask name unless it is the currently selected private user viewing their own position
                  const displayName = isTopFive
                    ? emp.name
                    : (isSelectedUser ? `${emp.name} (Your Position)` : 'Private Learner');

                  const displayDept = isTopFive
                    ? emp.department
                    : (isSelectedUser ? emp.department : '—');

                  const isMasked = !isTopFive && !isSelectedUser;

                  return (
                    <tr
                      key={emp.id}
                      className={`transition-colors ${
                        isSelectedUser
                          ? 'bg-amber-50/70 font-semibold'
                          : isMasked
                          ? 'bg-stone-50/40 text-stone-400'
                          : 'hover:bg-stone-50/80'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-stone-800">
                        #{emp.rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={isMasked ? 'text-stone-400 italic' : 'text-stone-900 font-medium'}>
                            {displayName}
                          </span>
                          {isMasked && <Lock className="w-3 h-3 text-stone-300" />}
                          {isSelectedUser && (
                            <span className="text-[9px] font-bold bg-[#FEF3C7] text-amber-900 px-1.5 py-0.2 rounded-full border border-amber-300">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{displayDept}</td>
                      <td className="py-3 px-4 text-center font-medium text-stone-700">
                        {isMasked ? '—' : `${emp.coursesCompleted} / 8`}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-[#D97706]">
                        {isMasked ? '—' : `${emp.points} pts`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border inline-block"
                          style={{
                            backgroundColor: `${badge.color}20`,
                            borderColor: badge.color,
                            color: badge.badge === 'Bronze' ? '#78350F' : '#1C1917',
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Private Personal Position Checker */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Check Your Personal Position (Confidential Lookup)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Select your employee ID to verify your ranking without exposing other colleagues outside the top 5.
              </p>
            </div>

            <select
              value={selectedDemoId}
              onChange={e => setSelectedDemoId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:border-amber-500 bg-white outline-none cursor-pointer sm:w-56"
            >
              {EMPLOYEES_DATA.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} — {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          {selectedEmp && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-amber-950 text-sm">
                  {selectedEmp.name} ({selectedEmp.id})
                </span>
                <span className="text-stone-600 ml-2">• {selectedEmp.department}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Rank: <strong className="text-stone-900 text-sm">#{selectedEmp.rank}</strong> of 10</span>
                <span>Points: <strong className="text-[#D97706] text-sm">{selectedEmp.points} pts</strong></span>
                <span>Badge: <strong className="text-stone-800">{selectedEmp.badge}</strong></span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
