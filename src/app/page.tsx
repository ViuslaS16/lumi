'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SidebarDock } from '@/components/SidebarDock';
import { RightHistorySidebar } from '@/components/RightHistorySidebar';
import { ChatMessage, MessageItem } from '@/components/ChatMessage';
import { QuickActionType } from '@/components/QuickActionMenu';
import { getEmployeeById, EmployeeRecord, EMPLOYEES_DATA } from '@/data/employees';
import { Course } from '@/data/courses';
import { findBestFAQMatch } from '@/lib/faqMatcher';
import { ChatSession } from '@/lib/chatDb';
import {
  Send,
  Sparkles,
  CheckCircle2,
  Globe,
  Layers,
  Headphones,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Trophy,
  HelpCircle,
  Award,
  ChevronDown,
  Plus,
  Clock,
  Pencil,
  User,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('lumi_username') || '';
    } catch {
      return '';
    }
  });
  const [nameInput, setNameInput] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('lumi_username') || '';
    } catch {
      return '';
    }
  });
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !localStorage.getItem('lumi_username');
    } catch {
      return true;
    }
  });
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeRecord | null>(() => {
    if (typeof window === 'undefined') return getEmployeeById('NE-104') || null;
    try {
      const stored = localStorage.getItem('lumi_username');
      if (stored) {
        const found = EMPLOYEES_DATA.find(e =>
          e.name.toLowerCase().includes(stored.toLowerCase()) ||
          stored.toLowerCase().includes(e.name.toLowerCase().split(' ')[0]) ||
          e.id.toLowerCase() === stored.toLowerCase()
        );
        if (found) return found;
      }
    } catch {}
    return getEmployeeById('NE-104') || null;
  });
  // Client-side hydration: check localStorage on mount and prompt for username if not set
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('lumi_username');
        if (stored && stored.trim()) {
          const trimmed = stored.trim();
          setUserName(trimmed);
          setNameInput(trimmed);
          const found = EMPLOYEES_DATA.find(e =>
            e.name.toLowerCase().includes(trimmed.toLowerCase()) ||
            trimmed.toLowerCase().includes(e.name.toLowerCase().split(' ')[0]) ||
            e.id.toLowerCase() === trimmed.toLowerCase()
          );
          if (found) setCurrentEmployee(found);
          setIsNameModalOpen(false);
        } else {
          // If no username exists in localStorage, automatically prompt user on open!
          setIsNameModalOpen(true);
        }
      } catch {
        setIsNameModalOpen(true);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Handler to persist username and map to employee
  const handleSaveName = (nameToSave?: string) => {
    const raw = (nameToSave !== undefined ? nameToSave : nameInput).trim();
    if (!raw) return;

    setUserName(raw);
    setNameInput(raw);
    try {
      localStorage.setItem('lumi_username', raw);
    } catch {}

    const found = EMPLOYEES_DATA.find(e =>
      e.name.toLowerCase().includes(raw.toLowerCase()) ||
      raw.toLowerCase().includes(e.name.toLowerCase().split(' ')[0]) ||
      e.id.toLowerCase() === raw.toLowerCase()
    );
    if (found) {
      setCurrentEmployee(found);
    } else if (!currentEmployee) {
      setCurrentEmployee(getEmployeeById('NE-104') || null);
    }

    setIsNameModalOpen(false);
    window.dispatchEvent(new CustomEvent('lumi_username_changed', { detail: raw }));
  };

  useEffect(() => {
    const handleNameChange = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom && custom.detail) {
        setUserName(custom.detail);
      } else {
        const stored = localStorage.getItem('lumi_username');
        if (stored) setUserName(stored);
      }
    };
    window.addEventListener('lumi_username_changed', handleNameChange);
    return () => window.removeEventListener('lumi_username_changed', handleNameChange);
  }, []);

  const displayName = userName
    ? (userName.trim().split(' ')[0] || userName.trim())
    : currentEmployee
    ? currentEmployee.name.split(' ')[0]
    : 'there';

  const [enrollToast, setEnrollToast] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1280;
  });
  const [showAllQuickActions, setShowAllQuickActions] = useState(false);
  const [activeModel, setActiveModel] = useState<'deepseek' | 'local'>('deepseek');

  // NoSQL Database chat session tracking
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounterRef = useRef(100);
  const currentChatIdRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Format current time
  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Track which chat sessions have been created in the NoSQL database
  const savedChatIdsRef = useRef<Set<string>>(new Set());

  // Helper to persist conversation to NoSQL database (MongoDB / JSON fallback)
  const syncToDatabase = useCallback(async (
    chatId: string,
    msgs: MessageItem[],
    initialTitle?: string
  ) => {
    try {
      const isAlreadySaved = savedChatIdsRef.current.has(chatId);
      const title = initialTitle
        ? (initialTitle.length > 38 ? initialTitle.slice(0, 38) + '...' : initialTitle)
        : 'New Conversation';

      if (!isAlreadySaved) {
        savedChatIdsRef.current.add(chatId);
        await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: chatId,
            title,
            messages: msgs,
            employeeId: currentEmployee?.id || 'NE-104',
          }),
        });
      } else {
        await fetch(`/api/chats/${chatId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: msgs,
            employeeId: currentEmployee?.id,
          }),
        });
      }
      setHistoryRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to sync conversation to NoSQL database:', err);
    }
  }, [currentEmployee]);

  // Helper to append assistant response & sync with NoSQL database
  const appendAssistantMessage = useCallback(async (
    activeId: string,
    currentList: MessageItem[],
    msgData: Omit<MessageItem, 'id' | 'timestamp'>,
    titleForNew?: string
  ) => {
    idCounterRef.current += 1;
    const assistantMsg: MessageItem = {
      ...msgData,
      id: `msg-${idCounterRef.current}`,
      timestamp: getTimeString(),
    };
    const updatedList = [...currentList, assistantMsg];
    setMessages(updatedList);
    setIsLoading(false);
    await syncToDatabase(activeId, updatedList, titleForNew);
  }, [syncToDatabase]);

  // Pure ID generator for active chat sessions
  const getOrCreateActiveChatId = () => {
    if (currentChatIdRef.current) return currentChatIdRef.current;
    idCounterRef.current += 1;
    const newId = `chat_${idCounterRef.current}`;
    currentChatIdRef.current = newId;
    setCurrentChatId(newId);
    return newId;
  };

  // Handle User Input Submission
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    const userTimestamp = getTimeString();
    idCounterRef.current += 1;

    // Determine or generate active session ID
    const activeChatId = getOrCreateActiveChatId();

    // 1. Add User Message
    const userMsg: MessageItem = {
      id: `user-${idCounterRef.current}`,
      sender: 'user',
      text: query,
      timestamp: userTimestamp,
    };
    const listWithUser = [...messages, userMsg];
    setMessages(listWithUser);
    setIsLoading(true);

    // 2. Check if the query is an Employee ID (e.g., NE-101, NE-104)
    const upperQuery = query.toUpperCase();
    const matchedEmployee = getEmployeeById(upperQuery);
    if (matchedEmployee) {
      setCurrentEmployee(matchedEmployee);
      setTimeout(() => {
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: `Found employee record for ${matchedEmployee.name} (${matchedEmployee.id}). Here is your latest learning progress summary:`,
            source: 'local',
            widgetType: 'progress',
            employeeData: matchedEmployee,
            suggestedFollowUps: ['View Leaderboard', 'Take a Quiz', 'What training is mandatory?'],
          },
          query
        );
      }, 400);
      return;
    }

    // Check if query is looking for progress with an ID keyword like "NE-xxx"
    const neMatch = query.match(/\bNE-\d{3}\b/i);
    if (neMatch) {
      const found = getEmployeeById(neMatch[0]);
      if (found) {
        setCurrentEmployee(found);
        setTimeout(() => {
          appendAssistantMessage(
            activeChatId,
            listWithUser,
            {
              sender: 'assistant',
              text: `Here is the training summary for ${found.name} (${found.id}):`,
              source: 'local',
              widgetType: 'progress',
              employeeData: found,
              suggestedFollowUps: ['View Leaderboard', 'Take a Quiz', 'Back to Menu'],
            },
            query
          );
        }, 400);
        return;
      } else {
        setTimeout(() => {
          appendAssistantMessage(
            activeChatId,
            listWithUser,
            {
              sender: 'assistant',
              text: `I couldn't find an employee record for ${neMatch[0].toUpperCase()}. Please verify the ID format (valid demo IDs are NE-101 through NE-110).`,
              source: 'local',
              suggestedFollowUps: ['NE-104', 'NE-101', 'Talk to HR'],
            },
            query
          );
        }, 400);
        return;
      }
    }

    // 3. Check for specific natural commands
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('leaderboard') || lowerQuery.includes('rankings') || lowerQuery.includes('top learners')) {
      setTimeout(() => {
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: "Here is the current NovaEdge learning leaderboard showing the top 5 learners and badge standings:",
            source: 'local',
            widgetType: 'leaderboard',
            employeeData: currentEmployee || getEmployeeById('NE-104'),
            suggestedFollowUps: ['How are learning points calculated?', 'Check My Progress', 'Take a Quiz'],
          },
          query
        );
      }, 400);
      return;
    }

    if (lowerQuery.includes('quiz') || (lowerQuery.includes('assessment') && !lowerQuery.includes('skill'))) {
      setTimeout(() => {
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: "You can take our 5-question Communication Skills Quiz right here to test your knowledge and earn up to 20 learning points!",
            source: 'local',
            widgetType: 'quiz',
            suggestedFollowUps: ['How many attempts do I get?', 'Can I retake a quiz?', 'Leaderboard'],
          },
          query
        );
      }, 400);
      return;
    }

    if (lowerQuery.includes('skill') && (lowerQuery.includes('improve') || lowerQuery.includes('gap') || lowerQuery.includes('confidence') || lowerQuery.includes('recommend'))) {
      setTimeout(() => {
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: "Let's identify your skill priorities. Answer 3 quick confidence questions below to receive personalized course recommendations:",
            source: 'local',
            widgetType: 'assessment',
            suggestedFollowUps: ['Where can I see the list of available courses?', 'How do I enroll in a course?'],
          },
          query
        );
      }, 400);
      return;
    }

    if (lowerQuery.includes('catalog') || lowerQuery.includes('courses available') || lowerQuery.includes('show courses') || lowerQuery.includes('course list')) {
      setTimeout(() => {
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: "Here is our internal course catalog. You can filter by skill and simulate enrollment directly:",
            source: 'local',
            widgetType: 'courses',
            suggestedFollowUps: ['How do I enroll in a course?', 'Can I enroll in courses outside my job role?'],
          },
          query
        );
      }, 400);
      return;
    }

    if (lowerQuery.includes('talk to hr') || lowerQuery.includes('contact hr') || lowerQuery.includes('contact l&d') || lowerQuery.includes('speak to human')) {
      setTimeout(() => {
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: "You can reach out directly to the NovaEdge Learning & Development team using the contact details below:",
            source: 'local',
            widgetType: 'hr',
            suggestedFollowUps: ['What training is mandatory?', 'Does NovaEdge pay for external certifications?'],
          },
          query
        );
      }, 400);
      return;
    }

    // 4. Send to /api/chat route (DeepSeek grounded with local FAQ fallback)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (response.ok) {
        const data = await response.json();
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: data.answer,
            source: data.source || 'local',
            isFallback: data.isFallback,
            suggestedFollowUps: data.suggestedFollowUps || ['How do I enroll in a course?', 'Talk to HR'],
          },
          query
        );
      } else {
        const localMatch = findBestFAQMatch(query);
        appendAssistantMessage(
          activeChatId,
          listWithUser,
          {
            sender: 'assistant',
            text: localMatch.answer,
            source: 'local',
            isFallback: localMatch.isFallback,
            suggestedFollowUps: localMatch.suggestedFollowUps,
          },
          query
        );
      }
    } catch {
      const localMatch = findBestFAQMatch(query);
      appendAssistantMessage(
        activeChatId,
        listWithUser,
        {
          sender: 'assistant',
          text: localMatch.answer,
          source: 'local',
          isFallback: localMatch.isFallback,
          suggestedFollowUps: localMatch.suggestedFollowUps,
        },
        query
      );
    }
  };

  // Handle Quick Action Selection
  const handleQuickAction = (action: QuickActionType) => {
    const activeChatId = getOrCreateActiveChatId();

    let title = 'Quick Action';
    let msgData: Omit<MessageItem, 'id' | 'timestamp'> | null = null;

    switch (action) {
      case 'courses':
        title = 'Browse Course Catalog';
        msgData = {
          sender: 'assistant',
          text: "Here is the NovaEdge Course Catalog. You can browse internal self-paced programs, workshops, and simulate course enrollment:",
          source: 'local',
          widgetType: 'courses',
          suggestedFollowUps: ['How do I enroll in a course?', 'How many courses can I take at the same time?'],
        };
        break;

      case 'mandatory':
        title = 'Mandatory Training Policy';
        msgData = {
          sender: 'assistant',
          text: "All NovaEdge employees must complete Code of Conduct, Information Security Awareness, Data Privacy, and Workplace Health and Safety. Managers also complete Leadership Essentials.\n\n• New joiners: Complete within 30 days of start date.\n• Existing staff: Annual refresher due by 30 November.\n• InfoSec is repeated every 6 months.",
          source: 'local',
          suggestedFollowUps: [
            'When is the deadline for mandatory training?',
            'What happens if I miss a mandatory training deadline?',
            'How often do I need to repeat mandatory training?',
          ],
        };
        break;

      case 'skills':
        title = 'Skill-Gap Assessment';
        msgData = {
          sender: 'assistant',
          text: "Let's check your skill development priorities. Complete this short 3-question assessment to receive targeted course recommendations:",
          source: 'local',
          widgetType: 'assessment',
          suggestedFollowUps: ['How can I improve my communication skills?', 'Do you offer presentation skills training?'],
        };
        break;

      case 'progress':
        title = 'My Progress Summary';
        msgData = {
          sender: 'assistant',
          text: "Please enter your Employee ID (examples: NE-101, NE-102, NE-104) to look up your training completion summary and current rank:",
          source: 'local',
          widgetType: 'id_prompt',
          suggestedFollowUps: ['NE-104', 'NE-101', 'NE-102'],
        };
        break;

      case 'leaderboard':
        title = 'Learning Leaderboard';
        msgData = {
          sender: 'assistant',
          text: "Here is the current NovaEdge learning leaderboard. Only the top 5 names are displayed to protect privacy:",
          source: 'local',
          widgetType: 'leaderboard',
          employeeData: currentEmployee || getEmployeeById('NE-104'),
          suggestedFollowUps: [
            'How are learning points calculated?',
            'What do the gold, silver and bronze badges mean?',
            'Can others see my ranking?',
          ],
        };
        break;

      case 'quiz':
        title = 'Knowledge Check Quiz';
        msgData = {
          sender: 'assistant',
          text: "Welcome to the NovaEdge Knowledge Check! Select a topic below to begin. Communication Skills is currently available for practice:",
          source: 'local',
          widgetType: 'quiz',
          suggestedFollowUps: ['Can I retake a quiz?', 'Will a low score affect me negatively?'],
        };
        break;

      case 'certificates':
        title = 'Certificates & Reimbursement';
        msgData = {
          sender: 'assistant',
          text: "NovaEdge supports your professional growth through certifications and reimbursements:\n\n• Certificates: Issued in NovaLearn upon completing courses (downloadable as PDF).\n• External Certifications: Reimbursed up to LKR 150,000 per employee per year with manager & HR pre-approval.\n• Study Leave: Up to 2 days of study leave per year for exams.\n• Claims: Submit receipt and certificate within 30 days of completion.",
          source: 'local',
          suggestedFollowUps: [
            'Does NovaEdge pay for external certifications?',
            'How do I claim reimbursement for a course fee?',
            'Do I need to stay with the company after an expensive course?',
          ],
        };
        break;

      case 'hr':
        title = 'Contact HR L&D Team';
        msgData = {
          sender: 'assistant',
          text: "Here are the contact details for the NovaEdge Human Resources L&D team:",
          source: 'local',
          widgetType: 'hr',
          suggestedFollowUps: ['Who do I contact for L&D questions?', 'I cannot log in to NovaLearn. What should I do?'],
        };
        break;
    }

    if (msgData) {
      appendAssistantMessage(activeChatId, messages, msgData, title);
    }
  };

  // Card sub-action handler
  const handleCardAction = (action: 'progress' | 'leaderboard' | 'quiz' | 'skills' | 'menu') => {
    if (action === 'progress') handleQuickAction('progress');
    else if (action === 'leaderboard') handleQuickAction('leaderboard');
    else if (action === 'quiz') handleQuickAction('quiz');
    else if (action === 'skills') handleQuickAction('skills');
    else if (action === 'menu') {
      const activeChatId = getOrCreateActiveChatId();
      appendAssistantMessage(activeChatId, messages, {
        sender: 'assistant',
        text: "How else can I assist your learning journey? Choose an option from the quick actions or type any question.",
        source: 'local',
        suggestedFollowUps: [
          'How do I enroll in a course?',
          'Which trainings are mandatory?',
          'My Progress',
          'Leaderboard',
        ],
      }, 'Learning Assistant Menu');
    }
  };

  // Handle simulated course enrollment
  const handleEnrollCourse = (course: Course) => {
    setEnrollToast(`Simulated enrollment confirmed for "${course.name}". In NovaLearn, internal courses are auto-approved!`);
    setTimeout(() => {
      setEnrollToast(null);
    }, 4500);

    const activeChatId = getOrCreateActiveChatId();
    appendAssistantMessage(activeChatId, messages, {
      sender: 'assistant',
      text: `✓ You have been enrolled in "${course.name}" (${course.format}, ${course.duration}). You can access it anytime in NovaLearn under My Learning. (Note: Simulated enrollment for demo).`,
      source: 'local',
      suggestedFollowUps: ['How do I check my training progress?', 'Where can I see the list of available courses?'],
    }, `Enrolled in ${course.name}`);
  };

  // Clear / Reset Chat action (CRUD: New Chat)
  const handleNewChat = () => {
    currentChatIdRef.current = null;
    setCurrentChatId(null);
    setMessages([]);
    setInputText('');
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  // Select a Chat from History (CRUD: Read One)
  const handleSelectChat = async (session: ChatSession) => {
    currentChatIdRef.current = session.id;
    setCurrentChatId(session.id);
    savedChatIdsRef.current.add(session.id);

    // Immediately display session messages
    if (session.messages && session.messages.length > 0) {
      setMessages(session.messages);
    }

    if (session.employeeId) {
      const emp = getEmployeeById(session.employeeId);
      if (emp) setCurrentEmployee(emp);
    }

    // Always fetch fresh full message history from NoSQL database
    try {
      const res = await fetch(`/api/chats/${session.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && Array.isArray(json.data.messages)) {
          setMessages(json.data.messages);
          if (json.data.employeeId) {
            const emp = getEmployeeById(json.data.employeeId);
            if (emp) setCurrentEmployee(emp);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load complete chat messages:', err);
    }
  };

  // Delete a Chat from History (CRUD: Delete)
  const handleDeleteChat = (deletedId: string) => {
    savedChatIdsRef.current.delete(deletedId);
    if (currentChatIdRef.current === deletedId) {
      currentChatIdRef.current = null;
      setCurrentChatId(null);
      setMessages([]);
    }
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] w-full flex items-center justify-center p-0 sm:p-2 md:p-3 lg:p-4 bg-[#EBE4DC] overflow-hidden">
      {/* Outer Application Window Capsule */}
      <div className="w-full max-w-[1440px] h-full bg-[#EFE9E2] rounded-none sm:rounded-[28px] md:rounded-[36px] shadow-none sm:shadow-xl border-0 sm:border border-white/60 flex overflow-hidden relative">
        
        {/* Left Slim Navigation Dock (Hidden on mobile < md, visible on md+) */}
        <SidebarDock
          onNewChat={handleNewChat}
          onToggleSearch={() => inputRef.current?.focus()}
          onToggleQuickActions={() => setShowAllQuickActions(prev => !prev)}
          onToggleHistory={() => setIsHistoryOpen(prev => !prev)}
          isHistoryOpen={isHistoryOpen}
        />

        {/* Center Main Stage (Chat Canvas) */}
        <div className="flex-1 m-0 sm:my-2 md:my-3 sm:mr-2 md:mr-3 rounded-none sm:rounded-[24px] md:rounded-[30px] bg-white flex flex-col overflow-hidden relative shadow-none sm:shadow-sm border-0 sm:border border-stone-100">
          
          {/* Subtle Ambient Radial Amber Glow at the Center */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-none sm:rounded-[30px]">
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] md:w-[540px] h-[300px] sm:h-[480px] md:h-[540px] rounded-full bg-gradient-to-b from-amber-300/25 via-amber-100/20 to-transparent blur-3xl opacity-80" />
          </div>

          {/* Chat Session Status Bar (Sub-header) */}
          <div className="px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between z-10 shrink-0 border-b border-stone-100 bg-white/90 backdrop-blur-xs w-full overflow-hidden gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-semibold shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>NovaEdge Assistant</span>
              </div>
              <span className="text-[11px] text-stone-500 truncate hidden sm:inline">
                42 NovaEdge FAQs & Policies Grounded
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors shadow-2xs border border-stone-200/80"
                title="Start New Conversation"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>

              <button
                onClick={() => setIsHistoryOpen(prev => !prev)}
                className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer border shadow-2xs transition-all text-xs font-medium ${
                  isHistoryOpen
                    ? 'bg-[#FEF3C7] text-amber-900 border-amber-300 ring-1 ring-amber-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200/80'
                }`}
                title="Chat History"
              >
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>History</span>
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="px-2.5 sm:px-6 py-1.5 sm:py-2 z-10 shrink-0 bg-white/80 backdrop-blur-xs border-b border-stone-100 w-full overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Quick Actions
              </span>
              <button
                onClick={() => setShowAllQuickActions(prev => !prev)}
                className="text-[10px] sm:text-[11px] font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{showAllQuickActions ? 'Hide' : 'View All (8)'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllQuickActions ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className={`mt-1.5 flex gap-1 sm:gap-1.5 pb-0.5 custom-scrollbar ${
              showAllQuickActions ? 'flex-wrap' : 'flex-nowrap overflow-x-auto scrollbar-none'
            }`}>
              {[
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'mandatory', label: 'Mandatory', icon: ShieldCheck },
                { id: 'skills', label: 'Skill Gap', icon: TrendingUp },
                { id: 'progress', label: 'My Progress', icon: UserCheck },
                ...(showAllQuickActions ? [
                  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                  { id: 'quiz', label: 'Take Quiz', icon: HelpCircle },
                  { id: 'certificates', label: 'Certificates', icon: Award },
                  { id: 'hr', label: 'Talk to HR', icon: Headphones },
                ] : []),
              ].map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id as QuickActionType)}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-stone-50 hover:bg-[#FEF3C7] text-stone-700 hover:text-amber-900 border border-stone-200/80 hover:border-amber-300 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Icon className="w-3 h-3 text-amber-600" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toast Notification */}
          {enrollToast && (
            <div className="mx-3 sm:mx-6 mt-2.5 p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 shadow-xs transition-all z-20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-xs sm:text-sm">{enrollToast}</span>
            </div>
          )}

          {/* Main Stage Content: Initial Landing vs Chat Stream */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2.5 sm:px-6 py-3 sm:py-4 flex flex-col z-10">
            {!hasMessages ? (
              /* Hero View */
              <div className="flex-1 flex flex-col items-center justify-center my-auto text-center px-1 sm:px-4 py-2 sm:py-4">
                
                {/* 3D Glowing Amber Orb (Static, Transparent Background) */}
                <div className="relative mb-2 sm:mb-4 flex items-center justify-center">
                  <div className="absolute w-32 sm:w-48 md:w-56 h-32 sm:h-48 md:h-56 rounded-full bg-gradient-to-tr from-amber-400/30 via-amber-300/20 to-transparent blur-3xl pointer-events-none" />
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 select-none">
                    <Image
                      src="/images/lumi-orb.png"
                      alt="Lumi Luminous Amber Core"
                      fill
                      className="object-contain drop-shadow-xl"
                      priority
                    />
                  </div>
                </div>

                {/* Greeting Title with Personalized Display & Edit Button */}
                <div className="flex items-center justify-center gap-2 group flex-wrap">
                  <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-[#D97706] tracking-tight">
                    Welcome back <span className="underline decoration-amber-300/80 decoration-wavy decoration-2 underline-offset-4">{displayName}</span>!
                  </h1>
                  <button
                    onClick={() => {
                      setNameInput(userName || displayName);
                      setIsNameModalOpen(true);
                    }}
                    className="p-1 sm:p-1.5 rounded-full hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors cursor-pointer inline-flex items-center justify-center"
                    title="Change your username"
                    aria-label="Change username"
                  >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-[#78716C] mt-1 sm:mt-2 max-w-lg font-normal leading-relaxed px-2">
                  Which training program, policy, or progress record do you want to explore today?
                </p>

                {/* 3 Floating Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3.5 mt-4 sm:mt-7 w-full max-w-2xl text-left">
                  <button
                    onClick={() => handleQuickAction('courses')}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all flex items-start gap-2.5 sm:gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#292524] group-hover:text-amber-800 transition-colors">
                        Browse Course Catalog
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#78716C] mt-0.5 leading-snug line-clamp-2">
                        Explore self-paced online modules & live workshops.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('mandatory')}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all flex items-start gap-2.5 sm:gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#292524] group-hover:text-amber-800 transition-colors">
                        Mandatory Training
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#78716C] mt-0.5 leading-snug line-clamp-2">
                        Compliance deadlines, Code of Conduct & InfoSec.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('skills')}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all flex items-start gap-2.5 sm:gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 transition-colors">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#292524] group-hover:text-amber-800 transition-colors">
                        Skill-Gap Assessment
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#78716C] mt-0.5 leading-snug line-clamp-2">
                        Answer 3 quick questions for personalized suggestions.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Conversation Messages Stream */
              <div className="space-y-3 sm:space-y-4">
                {messages.map(msg => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    userName={displayName}
                    onSelectSuggestion={handleSendMessage}
                    onSelectId={(id) => handleSendMessage(id)}
                    onEnrollCourse={handleEnrollCourse}
                    onCardAction={handleCardAction}
                  />
                ))}

                {/* Thinking Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#78716C] p-2.5 sm:p-3 rounded-2xl bg-stone-50 border border-stone-200 w-fit">
                    <Sparkles className="w-4 h-4 text-[#D97706] animate-spin" />
                    <span>Lumi is consulting the knowledge base...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Floating Chat Input Capsule */}
          <div className="p-2 sm:p-3.5 md:p-5 z-20 shrink-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-1">
            <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-md p-2 sm:p-2.5 md:p-3 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200/50">
              
              {/* Top Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Lumi about courses, mandatory training, certificates..."
                disabled={isLoading}
                className="w-full px-2 sm:px-3 py-1 text-xs sm:text-sm text-[#292524] placeholder-stone-400 bg-transparent outline-none"
              />

              {/* Bottom Bar inside Capsule: Model Pill & Send Button */}
              <div className="flex items-center justify-between pt-1.5 sm:pt-2 px-1 mt-1 border-t border-stone-100">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setActiveModel(prev => prev === 'deepseek' ? 'local' : 'deepseek')}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-stone-100 hover:bg-amber-50 text-[10px] sm:text-[11px] font-medium text-stone-700 hover:text-amber-900 border border-stone-200/70 transition-colors cursor-pointer"
                    title="Toggle AI Model / Knowledge Source"
                  >
                    <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[7px] sm:text-[8px] text-white font-bold">
                      ✦
                    </div>
                    <span className="hidden sm:inline">
                      {activeModel === 'deepseek' ? 'OpenAI / DeepSeek AI' : 'Local Knowledge Engine'}
                    </span>
                    <span className="sm:hidden">
                      {activeModel === 'deepseek' ? 'DeepSeek' : 'Local'}
                    </span>
                  </button>
                  <span className="text-[10px] text-stone-400 hidden lg:inline">
                    Grounded in 42 NovaEdge FAQs
                  </span>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputText.trim()}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    inputText.trim() && !isLoading
                      ? 'bg-[#D97706] hover:bg-[#92400E] text-white active:scale-95'
                      : 'bg-amber-500/20 text-stone-300 cursor-not-allowed'
                  }`}
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Conversation History Sidebar (Responsive Slide-over Drawer on < xl, Column on xl+) */}
        {isHistoryOpen && (
          <RightHistorySidebar
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onClose={() => setIsHistoryOpen(false)}
            refreshTrigger={historyRefreshTrigger}
          />
        )}

        {/* Username Setup / Edit Modal Prompt on Launch */}
        {isNameModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200/90 relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button (available if username already set) */}
              {userName && (
                <button
                  type="button"
                  onClick={() => setIsNameModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Modal Core Graphic & Title */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center mb-3 shadow-inner relative">
                  <div className="relative w-10 h-10 select-none">
                    <Image
                      src="/images/lumi-orb.png"
                      alt="Lumi Core"
                      fill
                      className="object-contain drop-shadow-sm"
                    />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  {userName ? 'Update Your Username' : 'Welcome to Lumi!'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-xs leading-relaxed">
                  What is your name? Lumi will personalize your learning dashboard and training records.
                </p>
              </div>

              {/* Name Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveName();
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label htmlFor="user-name-field" className="block text-xs font-semibold text-stone-700 mb-1.5 text-left">
                    Enter your name or employee ID:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="user-name-field"
                      type="text"
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Visula, Anika, Nimal..."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium text-stone-900 outline-none transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Quick Select Demo Employee Profiles */}
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5 text-left">
                    Or select demo profile:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: 'Anika Rajendra', short: 'Anika', role: 'HR Specialist', id: 'NE-104' },
                      { name: 'Nimal Perera', short: 'Nimal', role: 'Dev Lead', id: 'NE-101' },
                      { name: 'Sara Fernando', short: 'Sara', role: 'Support Eng', id: 'NE-103' },
                    ].map((demo) => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => {
                          setNameInput(demo.name);
                          handleSaveName(demo.name);
                        }}
                        className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/50 text-left transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-bold text-stone-800 group-hover:text-amber-900 truncate">
                          {demo.short}
                        </div>
                        <div className="text-[9px] text-stone-500 truncate">
                          {demo.id}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={!nameInput.trim()}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer ${
                    nameInput.trim()
                      ? 'bg-[#D97706] hover:bg-[#B45309] text-white active:scale-98 shadow-amber-600/20'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Lumi
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
