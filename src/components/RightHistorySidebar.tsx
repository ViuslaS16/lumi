import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  PenSquare,
  X,
  Search,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { ChatSession } from '@/lib/chatDb';

interface RightHistorySidebarProps {
  currentChatId?: string | null;
  onSelectChat: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteChat?: (id: string) => void;
  onClose?: () => void;
  refreshTrigger?: number; // to trigger re-fetching when a new message is saved
}

function getPeriodLabel(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - date.getTime());
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return 'Today';
    }
    if (diffHours < 48) {
      return 'Yesterday';
    }
    if (diffHours < 24 * 3) {
      return '3 days ago';
    }
    if (diffHours < 24 * 7) {
      return '7 days ago';
    }
    if (diffHours < 24 * 30) {
      return 'Last 30 days';
    }
    return 'Older';
  } catch {
    return 'Today';
  }
}

export const RightHistorySidebar: React.FC<RightHistorySidebarProps> = ({
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClose,
  refreshTrigger = 0,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Fetch all chats from NoSQL database (CRUD: Read All)
  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chats');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSessions(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching chat history from NoSQL db:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = () => {
      fetch('/api/chats')
        .then(res => res.json())
        .then(json => {
          if (active && json.success && Array.isArray(json.data)) {
            setSessions(json.data);
          }
        })
        .catch(err => console.error('Error fetching chat history:', err));
    };

    load();
    const timer = setInterval(load, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [refreshTrigger]);

  // Handle Delete Chat (CRUD: Delete)
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation from history?')) return;

    try {
      const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (onDeleteChat) onDeleteChat(id);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  // Start editing title
  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  // Save renamed title (CRUD: Update)
  const handleSaveRename = async (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }

    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });

      if (res.ok) {
        setSessions(prev =>
          prev.map(s => (s.id === id ? { ...s, title: editingTitle.trim() } : s))
        );
      }
    } catch (err) {
      console.error('Failed to rename chat:', err);
    } finally {
      setEditingId(null);
    }
  };

  // Filter sessions by search term
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group by timeline period
  const PERIOD_ORDER = ['Today', 'Yesterday', '3 days ago', '7 days ago', 'Last 30 days', 'Older'];
  const groupedSessions: { period: string; items: ChatSession[] }[] = [];

  PERIOD_ORDER.forEach(period => {
    const items = filteredSessions.filter(s => getPeriodLabel(s.updatedAt || s.createdAt) === period);
    if (items.length > 0) {
      groupedSessions.push({ period, items });
    }
  });

  const matchedIds = new Set(groupedSessions.flatMap(g => g.items.map(i => i.id)));
  const remaining = filteredSessions.filter(s => !matchedIds.has(s.id));
  if (remaining.length > 0) {
    groupedSessions.push({ period: 'Previous', items: remaining });
  }

  const handleSelectSession = (session: ChatSession) => {
    onSelectChat(session);
    if (onClose && typeof window !== 'undefined' && window.innerWidth < 1280) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 xl:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container: Slide-over Drawer on < xl, Column on xl+ */}
      <aside className="fixed xl:relative top-0 right-0 h-full w-[88vw] max-w-[320px] sm:max-w-[340px] xl:w-80 py-4 sm:py-5 px-3 sm:px-4 flex flex-col justify-between shrink-0 border-l border-stone-200/80 bg-[#EFE9E2] xl:bg-[#EFE9E2]/60 z-50 xl:z-auto shadow-2xl xl:shadow-none select-none animate-in slide-in-from-right duration-250">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Action Icons */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60 mb-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onNewChat();
                  if (onClose && typeof window !== 'undefined' && window.innerWidth < 1280) {
                    onClose();
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-stone-200/80 text-amber-800 hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Start New Chat"
              >
                <PenSquare className="w-4 h-4 text-[#D97706]" />
                <span>New Chat</span>
              </button>

              <button
                onClick={fetchChats}
                disabled={isLoading}
                className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-600 transition-colors cursor-pointer"
                title="Refresh NoSQL database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-amber-900 bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-amber-300">
                NoSQL
              </span>

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer ml-1"
                  title="Close History Panel"
                  aria-label="Close History Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Bar Capsule */}
          <div className="relative mt-1 mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-white text-xs text-stone-800 placeholder-stone-400 border border-stone-200/80 shadow-2xs outline-none focus:border-amber-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* History Timeline */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-1">
            {groupedSessions.map(group => (
              <div key={group.period}>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <h4 className="text-[11px] font-semibold text-stone-700">
                    {group.period}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {group.items.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {group.items.map(session => {
                    const isActive = currentChatId === session.id;
                    const isEditing = editingId === session.id;

                    if (isEditing) {
                      return (
                        <form
                          key={session.id}
                          onSubmit={e => handleSaveRename(e, session.id)}
                          className="flex items-center gap-1 p-1 bg-white rounded-xl border border-amber-400 shadow-2xs"
                        >
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-stone-800 outline-none"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="p-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-md hover:bg-stone-100 text-stone-500 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      );
                    }

                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session)}
                        className={`group relative w-full text-left py-2 px-3 rounded-2xl border text-xs shadow-2xs transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-[#FEF3C7] border-amber-400 text-amber-950 font-medium shadow-xs'
                            : 'bg-white/90 hover:bg-white border-stone-200/80 hover:border-amber-300 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-1">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-700' : 'text-stone-400 group-hover:text-amber-600'}`} />
                          <span className="truncate">{session.title}</span>
                        </div>

                        {/* Hover Action Buttons: Rename & Delete (CRUD) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                          <button
                            onClick={e => handleStartRename(e, session)}
                            className="p-1 rounded-md hover:bg-stone-200 text-stone-500 hover:text-amber-800 transition-colors cursor-pointer"
                            title="Rename chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => handleDelete(e, session.id)}
                            className="p-1 rounded-md hover:bg-red-100 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {groupedSessions.length === 0 && !isLoading && (
              <div className="py-8 text-center text-xs text-stone-500 italic">
                {searchTerm ? 'No matching conversations.' : 'No saved conversations yet.'}
              </div>
            )}
          </div>
        </div>

        {/* Mascot Assistant Illustration (Bottom Right) */}
        <div className="mt-3 pt-2 flex flex-col items-center shrink-0 border-t border-stone-200/50">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 select-none">
            <Image
              src="/images/lumi-mascot.png"
              alt="Lumi 3D Assistant Robot Mascot"
              fill
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-amber-900 bg-[#FEF3C7]/90 px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
            <Sparkles className="w-3 h-3 text-[#D97706]" />
            <span>MongoDB NoSQL Sync Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
