'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  UserCheck,
  BookOpen,
  Trophy,
  BarChart3,
  Menu,
  X,
  Sparkles,
  Pencil,
  User,
} from 'lucide-react';

export const MainNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Visula';
    try {
      const stored = localStorage.getItem('lumi_username');
      if (stored && stored.trim()) return stored.trim();
    } catch {
      // ignore
    }
    return 'Visula';
  });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');

  // Listen for username changes across all pages
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

  const navLinks = [
    { href: '/', label: 'Lumi Chat', icon: MessageSquare },
    { href: '/progress', label: 'Dashboard', icon: UserCheck },
    { href: '/learn', label: 'Course Catalogue', icon: BookOpen },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/hr-analytics', label: 'HR Analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const displayName = userName ? (userName.trim().split(' ')[0] || userName.trim()) : 'Visula';

  const handleOpenEditName = () => {
    setTempName(userName || 'Visula');
    setIsNameModalOpen(true);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempName.trim();
    if (!clean) return;
    try {
      localStorage.setItem('lumi_username', clean);
    } catch {
      // ignore
    }
    setUserName(clean);
    setIsNameModalOpen(false);
    window.dispatchEvent(new CustomEvent('lumi_username_changed', { detail: clean }));
  };

  return (
    <>
      <header className="w-full bg-[#EFE9E2]/95 backdrop-blur-md border-b border-stone-200/90 sticky top-0 z-30 select-none shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group cursor-pointer shrink-0">
            <div className="relative w-7 h-7 sm:w-9 sm:h-9 select-none transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/images/lumi-orb.png"
                alt="Lumi Core"
                fill
                className="object-contain drop-shadow-xs"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-[#292524] tracking-tight">Lumi</span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold text-amber-900 bg-[#FEF3C7] px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                  NovaEdge L&D
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden md:block">
                HRIS Assignment (BHRM 32242)
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (Identical across all pages) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-white/80 p-1 rounded-full border border-stone-200/80 shadow-2xs">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-amber-700'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Stack: User Badge + Status + Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Ask Lumi Shortcut (when not on chat page) */}
            {pathname !== '/' && (
              <Link
                href="/"
                className="hidden xl:inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                title="Go to Lumi Chat"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Ask Lumi</span>
              </Link>
            )}

            {/* User Profile Pill (Click to edit name) */}
            <button
              onClick={handleOpenEditName}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-[11px] text-stone-700 hover:text-amber-900 transition-colors cursor-pointer group shadow-2xs shrink-0"
              title="Click to edit your username"
              aria-label="Edit username"
            >
              <div className="w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                {(displayName[0] || 'V').toUpperCase()}
              </div>
              <span className="font-semibold max-w-[64px] sm:max-w-[100px] truncate">{displayName}</span>
              <Pencil className="w-2.5 h-2.5 text-stone-400 group-hover:text-amber-700 shrink-0" />
            </button>

            {/* Online Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200/80 text-[11px] text-stone-600 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Online</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer shadow-2xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 shadow-lg animate-in fade-in duration-150">
            <div className="flex flex-col gap-1.5">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#FEF3C7] text-amber-900 border border-amber-300 shadow-2xs'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-800' : 'text-stone-500'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  NovaEdge Learning Assistant
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenEditName();
                  }}
                  className="text-amber-800 font-semibold underline hover:text-amber-900 cursor-pointer"
                >
                  Edit Name
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Username Edit Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl border border-stone-200">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <User className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#292524]">Update Your Name</h3>
                <p className="text-xs text-stone-500">Personalize your Lumi experience</p>
              </div>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label htmlFor="navbar-name-input" className="block text-xs font-medium text-stone-700 mb-1">
                  Your Full Name or Preferred Name
                </label>
                <input
                  id="navbar-name-input"
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="e.g. Visula"
                  autoFocus
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsNameModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
