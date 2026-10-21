import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ProgressCard } from './ProgressCard';
import { LeaderboardCard } from './LeaderboardCard';
import { QuizWidget } from './QuizWidget';
import { SkillAssessmentWidget } from './SkillAssessmentWidget';
import { CourseCatalogWidget } from './CourseCatalogWidget';
import { HRContactCard } from './HRContactCard';
import { EmployeeRecord } from '@/data/employees';
import { Course } from '@/data/courses';

export interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'deepseek' | 'local';
  widgetType?: 'progress' | 'leaderboard' | 'quiz' | 'assessment' | 'courses' | 'hr' | 'id_prompt';
  employeeData?: EmployeeRecord | null;
  filterSkill?: string;
  suggestedFollowUps?: string[];
  isFallback?: boolean;
}

interface ChatMessageProps {
  message: MessageItem;
  onSelectSuggestion?: (text: string) => void;
  onSelectId?: (id: string) => void;
  onEnrollCourse?: (course: Course) => void;
  userName?: string;
  onCardAction?: (action: 'progress' | 'leaderboard' | 'quiz' | 'skills' | 'menu') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userName,
  onSelectSuggestion,
  onSelectId,
  onEnrollCourse,
  onCardAction,
}) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex gap-3 mb-4 ${
        isUser ? 'flex-row-reverse items-end' : 'items-start'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs ${
          isUser
            ? 'bg-[#D97706] text-white'
            : 'bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706]'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Bubble Container */}
      <div className={`w-full max-w-[calc(100%-44px)] sm:max-w-xl md:max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name and timestamp */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] mb-1 px-1">
          <span className="font-medium text-[#292524]">
            {isUser ? (userName || 'You') : 'Lumi'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>

          {!isUser && message.source && (
            <>
              <span>•</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                  message.source === 'deepseek'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                {message.source === 'deepseek' ? 'DeepSeek AI' : 'Local Knowledge'}
              </span>
            </>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
            isUser
              ? 'bg-[#D97706] text-white rounded-br-xs'
              : 'bg-white text-[#292524] border border-[#E7E5E4] rounded-tl-xs'
          }`}
        >
          <div className="whitespace-pre-line">{message.text}</div>
        </div>

        {/* ID Prompt Sample Pills */}
        {message.widgetType === 'id_prompt' && onSelectId && (
          <div className="mt-2.5 p-3 rounded-xl bg-white border border-[#E7E5E4] w-full max-w-md">
            <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block mb-2">
              Try a demo employee ID:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'NE-104', label: 'NE-104 (Anika R. • HR)' },
                { id: 'NE-101', label: 'NE-101 (Nimal P. • Eng)' },
                { id: 'NE-102', label: 'NE-102 (Sara F. • Support)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onSelectId(item.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E7E5E4] hover:border-[#D97706] bg-[#FFFBF5] text-xs font-mono font-medium text-[#92400E] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inline Rich Widgets */}
        {message.widgetType === 'progress' && message.employeeData && (
          <ProgressCard
            employee={message.employeeData}
            onActionClick={onCardAction}
          />
        )}

        {message.widgetType === 'leaderboard' && (
          <LeaderboardCard
            currentEmployee={message.employeeData}
            onActionClick={onCardAction}
          />
        )}

        {message.widgetType === 'quiz' && (
          <QuizWidget
            onActionClick={onCardAction}
          />
        )}

        {message.widgetType === 'assessment' && (
          <SkillAssessmentWidget
            onEnroll={onEnrollCourse}
            onActionClick={onCardAction}
          />
        )}

        {message.widgetType === 'courses' && (
          <CourseCatalogWidget
            filterSkill={message.filterSkill}
            onEnroll={onEnrollCourse}
            onActionClick={onCardAction}
          />
        )}

        {message.widgetType === 'hr' && (
          <HRContactCard
            onActionClick={onCardAction}
          />
        )}

        {/* Follow-up Suggestion Chips */}
        {!isUser && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSelectSuggestion && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.suggestedFollowUps.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(suggestion)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFFBF5] border border-[#E7E5E4] hover:border-[#D97706] hover:bg-white text-[#92400E] transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
