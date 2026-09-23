'use client';

import React, { useState } from 'react';
import { UserSession, CheckinItem } from '@/types/jeda';
import { X, Copy, Check, Trash2, Download, Sparkles, Key, Shield, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession | null;
  checkins: CheckinItem[];
  onLoadDemo: () => void;
  onExportCSV: () => void;
  onClearData: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  session,
  checkins,
  onLoadDemo,
  onExportCSV,
  onClearData,
}: SettingsModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !session) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(session.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const firstDate = checkins.length > 0 ? checkins[checkins.length - 1].checkinDate : '-';
  const latestDate = checkins.length > 0 ? checkins[0].checkinDate : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-100 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Pengaturan &amp; Akun</h3>
              <p className="text-xs text-slate-400">Kelola kredensial anonim dan data pribadi Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access Code Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Kode Akses Anonim Anda
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xl font-bold text-emerald-400 tracking-wider">
              {session.accessCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Simpan kode ini di catatan pribadi Anda agar dapat masuk kembali dari perangkat lain atau
            setelah browser dibersihkan.
          </p>
        </div>

        {/* Data Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Total Log</div>
            <div className="font-mono text-base font-bold text-white tabular-nums mt-0.5">
              {checkins.length}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Log Pertama</div>
            <div className="font-mono text-xs text-slate-300 mt-1">{firstDate}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Log Terakhir</div>
            <div className="font-mono text-xs text-slate-300 mt-1">{latestDate}</div>
          </div>
        </div>

        {/* Action Options */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onExportCSV();
              onClose();
            }}
            className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-white">Ekspor Data Lengkap (CSV)</div>
                <div className="text-[11px] text-slate-400">Unduh berkas spreadsheet untuk konseling</div>
              </div>
            </div>
            <span className="text-xs text-slate-400">&rarr;</span>
          </button>

          <button
            onClick={() => {
              onLoadDemo();
              onClose();
            }}
            className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-semibold text-white">Muat 30 Hari Data Demo Skripsi</div>
                <div className="text-[11px] text-slate-400">Simulasi realistis pola akut &amp; kronis</div>
              </div>
            </div>
            <span className="text-xs text-slate-400">&rarr;</span>
          </button>
        </div>

        {/* Danger Zone: Delete Data */}
        <div className="pt-2 border-t border-slate-800">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 rounded-xl border border-rose-900/60 hover:border-rose-700 bg-rose-950/20 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Hapus Akun &amp; Seluruh Data Saya</span>
            </button>
          ) : (
            <div className="bg-rose-950/40 border border-rose-800/80 p-3.5 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2 text-rose-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  Apakah Anda yakin? Seluruh riwayat check-in Anda akan dihapus secara permanen dari perangkat ini.
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onClearData();
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
