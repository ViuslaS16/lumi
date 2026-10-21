import React from 'react';
import { Plus, Search, RotateCcw, LayoutGrid, Clock } from 'lucide-react';

interface SidebarDockProps {
  onNewChat: () => void;
  onToggleSearch?: () => void;
  onToggleQuickActions?: () => void;
  onToggleHistory?: () => void;
  isHistoryOpen?: boolean;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({
  onNewChat,
  onToggleSearch,
  onToggleQuickActions,
  onToggleHistory,
  isHistoryOpen,
}) => {
  return (
    <aside className="hidden md:flex w-16 lg:w-18 py-6 flex-col items-center justify-between shrink-0 select-none">
      {/* Top action: Black + Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onNewChat}
          className="w-11 h-11 rounded-full bg-[#1C1917] hover:bg-black active:scale-95 text-white flex items-center justify-center shadow-md transition-all cursor-pointer group"
          title="New Conversation"
          aria-label="New Conversation"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Action icons stack */}
        <div className="flex flex-col items-center gap-2.5 mt-2">
          <button
            onClick={onToggleSearch}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 flex items-center justify-center shadow-xs border border-stone-200/60 hover:shadow-sm transition-all cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-stone-600" />
          </button>

          <button
            onClick={onNewChat}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 flex items-center justify-center shadow-xs border border-stone-200/60 hover:shadow-sm transition-all cursor-pointer"
            title="Reset / Clear Chat"
            aria-label="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4 text-stone-600" />
          </button>

          <button
            onClick={onToggleQuickActions}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 flex items-center justify-center shadow-xs border border-stone-200/60 hover:shadow-sm transition-all cursor-pointer"
            title="Quick Action Menu"
            aria-label="Quick Actions"
          >
            <LayoutGrid className="w-4 h-4 text-stone-600" />
          </button>

          <button
            onClick={onToggleHistory}
            className={`w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-xs border cursor-pointer ${
              isHistoryOpen
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                : 'bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200/60'
            }`}
            title="History Timeline"
            aria-label="History Timeline"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Subtle Brand Indicator */}
      <div className="flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 text-xs shadow-2xs select-none">
          ✦
        </div>
      </div>
    </aside>
  );
};
