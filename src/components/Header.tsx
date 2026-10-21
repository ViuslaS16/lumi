import React from 'react';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onClearChat, messageCount }) => {
  return (
    <header className="border-b border-[#E7E5E4] bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FBBF24] flex items-center justify-center shadow-xs">
            {/* Custom SVG Lumi Brand Mark */}
            <svg
              className="w-6 h-6 text-[#D97706]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="4" fill="#D97706" fillOpacity="0.2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-[#292524] tracking-tight flex items-center gap-1.5">
                Lumi
                <span className="text-xs font-normal text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  L&D Assistant
                </span>
              </h1>
            </div>
            <p className="text-xs text-[#78716C]">
              NovaEdge Technologies • Learning & Development
            </p>
          </div>
        </div>

        {/* Status indicator & Clear conversation */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFBF5] border border-[#E7E5E4] text-xs text-[#78716C]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
            <span className="text-stone-300">|</span>
            <span className="text-[#92400E] font-medium">Demo Prototype</span>
          </div>

          {messageCount > 0 && (
            <button
              onClick={onClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5E4] hover:bg-stone-50 active:bg-stone-100 text-[#78716C] hover:text-[#292524] text-xs font-medium transition-colors cursor-pointer"
              title="Reset conversation to start"
              aria-label="Clear chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
