import React from 'react';
import { getTopEmployees, EmployeeRecord } from '@/data/employees';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardCardProps {
  currentEmployee?: EmployeeRecord | null;
  onActionClick?: (action: 'progress' | 'quiz' | 'menu') => void;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  currentEmployee,
  onActionClick,
}) => {
  const topEmployees = getTopEmployees(5);

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Medal className="w-3 h-3 text-[#D97706]" />
          Gold
        </span>
      );
    }
    if (rank <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-300">
          <Medal className="w-3 h-3 text-slate-500" />
          Silver
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
        <Medal className="w-3 h-3 text-amber-700" />
        Bronze
      </span>
    );
  };

  return (
    <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#292524]">
              NovaEdge Learning Leaderboard
            </h3>
            <p className="text-[11px] text-[#78716C]">Weekly update (Mon 8:00 AM)</p>
          </div>
        </div>

        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFFBF5] text-[#92400E] border border-[#FEF3C7] font-medium">
          Top 5 Only
        </span>
      </div>

      {/* Current User Standing Highlight */}
      {currentEmployee && (
        <div className="my-3 p-3 rounded-xl bg-[#FFFBF5] border border-[#FDE68A]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#78716C]">Your Position</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#92400E]">
                #{currentEmployee.rank} • {currentEmployee.name}
              </span>
              {getRankBadge(currentEmployee.rank)}
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#78716C] mt-1 pt-1 border-t border-[#FEF3C7]">
            <span>{currentEmployee.points} Learning Points</span>
            <span>{currentEmployee.coursesCompleted} of 8 Courses Completed</span>
          </div>
        </div>
      )}

      {/* Top 5 Table */}
      <div className="mt-2 divide-y divide-[#F5F5F4]">
        {topEmployees.map(emp => {
          const isCurrentUser = currentEmployee?.id === emp.id;
          return (
            <div
              key={emp.id}
              className={`py-2 px-2 rounded-lg flex items-center justify-between transition-colors ${
                isCurrentUser ? 'bg-[#FFFBF5] font-semibold' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-center text-xs font-bold text-stone-500">
                  #{emp.rank}
                </span>
                <div>
                  <span className="text-xs text-[#292524]">{emp.name}</span>
                  <span className="text-[10px] text-stone-400 ml-1.5 font-normal">
                    ({emp.department})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#D97706]">
                  {emp.points} pts
                </span>
                {getRankBadge(emp.rank)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy Notice Required by Assignment */}
      <div className="mt-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-snug">
        <p className="font-medium text-stone-700 mb-0.5">Privacy Notice:</p>
        <p>
          Leaderboard participation is optional. You can opt out in NovaLearn settings.
          Ranks 6–10 and other employees are hidden to protect learner privacy.
        </p>
      </div>

      {/* Action buttons */}
      {onActionClick && (
        <div className="mt-4 pt-3 border-t border-[#F5F5F4] flex flex-wrap gap-2">
          <button
            onClick={() => onActionClick('progress')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors cursor-pointer"
          >
            Check My Progress
          </button>
          <button
            onClick={() => onActionClick('quiz')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-medium transition-colors cursor-pointer"
          >
            Take Quiz for +20 Points
          </button>
          <button
            onClick={() => onActionClick('menu')}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer ml-auto"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};
