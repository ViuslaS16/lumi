import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Trophy,
  HelpCircle,
  Award,
  Headphones,
} from 'lucide-react';

export type QuickActionType =
  | 'courses'
  | 'mandatory'
  | 'skills'
  | 'progress'
  | 'leaderboard'
  | 'quiz'
  | 'certificates'
  | 'hr';

interface QuickActionMenuProps {
  onSelectAction: (action: QuickActionType) => void;
  activeAction?: QuickActionType | null;
}

const ACTIONS: {
  id: QuickActionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'courses', label: 'Courses and Enrollment', icon: BookOpen },
  { id: 'mandatory', label: 'Mandatory Training', icon: ShieldCheck },
  { id: 'skills', label: 'Skills Development', icon: TrendingUp },
  { id: 'progress', label: 'My Progress', icon: UserCheck },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'quiz', label: 'Take a Quiz', icon: HelpCircle },
  { id: 'certificates', label: 'Certificates & Reimbursement', icon: Award },
  { id: 'hr', label: 'Talk to HR', icon: Headphones },
];

export const QuickActionMenu: React.FC<QuickActionMenuProps> = ({
  onSelectAction,
  activeAction,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
          Quick Actions
        </span>
        <span className="text-[11px] text-[#92400E] font-medium">Click to trigger flow</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {ACTIONS.map(action => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <button
              key={action.id}
              onClick={() => onSelectAction(action.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                  : 'bg-white text-[#292524] border-[#E7E5E4] hover:border-[#D97706] hover:bg-[#FFFBF5]'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-white' : 'text-[#D97706]'
                }`}
              />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
