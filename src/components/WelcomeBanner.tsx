import React from 'react';
import { HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

interface WelcomeBannerProps {
  onSelectSuggestion: (question: string) => void;
  compact?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'How do I enroll in a course?',
  'What training is mandatory?',
  'How do I get a certificate?',
  'How can I improve my skills?',
];

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onSelectSuggestion,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="py-2 px-4 rounded-xl bg-white border border-[#E7E5E4] text-xs text-[#78716C] flex items-center justify-between shadow-xs mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D97706]" />
          <span>Ask anything about NovaLearn training, policies, or certifications.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E7E5E4] p-5 sm:p-6 mb-4 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-[#D97706]" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#292524] tracking-tight">
            Your learning journey starts here.
          </h2>
          <p className="text-sm text-[#78716C] mt-1 leading-relaxed">
            I&apos;m Lumi, your NovaEdge Learning Assistant. Ask me about courses, training policies,
            certifications, or your learning progress.
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#F5F5F4]">
        <p className="text-xs font-medium text-[#78716C] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Suggested Questions</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_QUESTIONS.map((question, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(question)}
              className="text-left px-3.5 py-2.5 rounded-xl border border-[#E7E5E4] hover:border-[#D97706] hover:bg-[#FFFBF5] text-xs text-[#292524] font-medium transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="line-clamp-1">{question}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#D97706] transition-colors shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
