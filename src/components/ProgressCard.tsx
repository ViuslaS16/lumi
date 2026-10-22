import React from 'react';
import { EmployeeRecord } from '@/data/employees';
import { Award, Clock, Trophy } from 'lucide-react';

interface ProgressCardProps {
  employee: EmployeeRecord;
  onActionClick?: (action: 'leaderboard' | 'quiz' | 'menu') => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  employee,
  onActionClick,
}) => {
  const completionPercentage = Math.round(
    (employee.coursesCompleted / employee.coursesAssigned) * 100
  );

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Gold':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Bronze':
        return 'bg-amber-100/60 text-amber-900 border-amber-400';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
      {/* Top Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2 pb-3 border-b border-[#F5F5F4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#92400E] font-semibold text-sm">
            {employee.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-[#292524]">{employee.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                {employee.id}
              </span>
            </div>
            <p className="text-xs text-[#78716C]">{employee.department} Department</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getBadgeStyle(employee.badge)}`}>
          <Award className="w-3.5 h-3.5" />
          <span>{employee.badge} Badge</span>
        </div>
      </div>

      {/* Progress Metric */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-medium text-[#292524]">Courses Completed</span>
          <span className="font-semibold text-[#D97706]">
            {employee.coursesCompleted} of {employee.coursesAssigned} ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D97706] rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="p-2.5 rounded-xl bg-[#FFFBF5] border border-[#FEF3C7]">
          <span className="text-[11px] text-[#78716C] block">Learning Points</span>
          <span className="text-base font-bold text-[#92400E] flex items-center gap-1">
            <Trophy className="w-4 h-4 text-[#D97706]" />
            {employee.points} pts
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FFFBF5] border border-[#FEF3C7]">
          <span className="text-[11px] text-[#78716C] block">Company Rank</span>
          <span className="text-base font-bold text-[#92400E]">
            #{employee.rank} of 10
          </span>
        </div>
      </div>

      {/* Pending Course or Top Skill */}
      {employee.pendingCourse && (
        <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-700">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Pending: <strong className="font-medium">{employee.pendingCourse}</strong>
            </span>
          </div>
          {employee.pendingDueDate && (
            <span className="text-[10px] text-stone-500">Due {employee.pendingDueDate}</span>
          )}
        </div>
      )}

      {/* Follow-up Quick Navigation */}
      {onActionClick && (
        <div className="mt-4 pt-3 border-t border-[#F5F5F4] flex flex-wrap gap-2">
          <button
            onClick={() => onActionClick('leaderboard')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trophy className="w-3 h-3 text-[#D97706]" />
            <span>View Leaderboard</span>
          </button>
          <button
            onClick={() => onActionClick('quiz')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Take a Quiz (+20 pts)</span>
          </button>
          <button
            onClick={() => onActionClick('menu')}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer ml-auto"
          >
            Back to Menu
          </button>
        </div>
      )}

      {/* Fictional Data Note */}
      <div className="mt-2 text-[10px] text-stone-400 italic text-center">
        Simulated employee record for demonstration prototype. Not connected to live HRIS.
      </div>
    </div>
  );
};
