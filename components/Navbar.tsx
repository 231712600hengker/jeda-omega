'use client';

import React, { useState } from 'react';
import { UserSession } from '@/types/jeda';
import { Check, Copy, LogOut, Info, Sparkles, BookOpen, BarChart3, PlusCircle, History } from 'lucide-react';

interface NavbarProps {
  session: UserSession | null;
  activeTab: 'checkin' | 'dashboard' | 'history';
  onSelectTab: (tab: 'checkin' | 'dashboard' | 'history') => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onLoadDemo: () => void;
  totalCheckins: number;
}

export default function Navbar({
  session,
  activeTab,
  onSelectTab,
  onOpenGuide,
  onOpenSettings,
  onLogout,
  onLoadDemo,
  totalCheckins,
}: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!session?.accessCode) return;
    try {
      await navigator.clipboard.writeText(session.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold tracking-tight text-sm">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Jeda
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 hidden sm:inline">
                EMA Mahasiswa Skripsi
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, clean text) */}
        {session ? (
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('checkin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'checkin'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Check-in Hari Ini</span>
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dasbor Tren</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Riwayat</span>
              {totalCheckins > 0 && (
                <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                  ({totalCheckins})
                </span>
              )}
            </button>

            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Panduan Instrumen & FAQ"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Panduan</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Metode Ecological Momentary Assessment</span>
            <span aria-hidden="true">·</span>
            <span>Anonim & Bebas Akses</span>
          </div>
        )}

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {/* Access code copy button */}
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer group"
                title="Klik untuk menyalin kode akses Anda"
              >
                <span className="text-[11px] text-slate-400 hidden lg:inline">Kode:</span>
                <span className="font-mono font-medium text-emerald-400 text-xs">
                  {session.accessCode}
                </span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-white shrink-0" />
                )}
              </button>

              {/* Demo button if less than 5 checkins */}
              {totalCheckins < 5 && (
                <button
                  onClick={onLoadDemo}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/60 text-sky-300 text-xs transition-colors"
                  title="Muat 30 hari data sampel untuk melihat grafik dan simulasi alert"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Isi Data Demo</span>
                </button>
              )}

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Keluar (Kode akses Anda tetap tersimpan di perangkat ini)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tentang Jeda</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
