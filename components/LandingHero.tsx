'use client';

import React, { useState } from 'react';
import {
  Clock,
  Shield,
  BarChart2,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Brain,
} from 'lucide-react';

interface LandingHeroProps {
  onStartNew: () => void;
  onLogin: (code: string) => void;
  onLoadDemo: () => void;
  onOpenGuide: () => void;
}

export default function LandingHero({
  onStartNew,
  onLogin,
  onLoadDemo,
  onOpenGuide,
}: LandingHeroProps) {
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [showLoginInput, setShowLoginInput] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = accessCodeInput.trim().toUpperCase();
    if (!clean) {
      setLoginError('Silakan masukkan kode akses Anda.');
      return;
    }
    if (!clean.startsWith('JD-') && clean.length < 5) {
      setLoginError('Format kode akses umumnya seperti JD-XXXXXX');
      return;
    }
    setLoginError('');
    onLogin(clean);
  };

  return (
    <div className="relative overflow-hidden text-slate-100 py-12 lg:py-16">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Subheader */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-400 mb-4 tracking-wide uppercase">
          <span>Ecological Momentary Assessment (EMA)</span>
          <span aria-hidden="true">·</span>
          <span>Pencegahan Burnout Skripsi</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Pantau stres skripsi Anda{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
            secara nyata & anonim
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-300 text-center max-w-2xl mx-auto leading-relaxed">
          Kuesioner retrospektif bulanan kerap bias ingatan. Dengan Jeda, catat kondisi kecemasan,
          kelelahan, dan progres harian Anda dalam waktu kurang dari 2 menit untuk deteksi dini
          risiko stagnasi sebelum menjadi burnout.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={onStartNew}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Mulai Baru (Buat Kode)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowLoginInput(!showLoginInput)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-slate-400" />
            <span>Masuk Kembali</span>
          </button>
        </div>

        {/* Access Code Input Panel (Expands when clicked) */}
        {showLoginInput && (
          <form
            onSubmit={handleLoginSubmit}
            className="mt-4 max-w-sm mx-auto p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-3 animate-fade-in"
          >
            <label className="text-xs text-slate-300 font-medium">
              Masukkan Kode Akses Jeda Anda:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.target.value)}
                placeholder="Contoh: JD-A7F2K9"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Masuk
              </button>
            </div>
            {loginError && <p className="text-[11px] text-rose-400">{loginError}</p>}
          </form>
        )}

        {/* Quick Demo Option */}
        <div className="mt-4 text-center">
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 hover:underline cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atau jelajahi dengan 30 Hari Data Demo Skripsi</span>
          </button>
        </div>

        {/* 4 Feature Value Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">9 Item &lt; 2 Menit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ringkas dan minim friksi. Diadaptasi dari GAD-2, Chalder Fatigue Scale, dan PSQI khusus
              konteks skripsi.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">Deteksi Akut & Kronis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Membedakan lonjakan stres sesaat (akut) dengan pola stagnasi berulang (5 hari
              kelelahan tinggi + progres mandek).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">Dasbor Tren 30 Hari</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualisasi grafik interaktif kecemasan, kelelahan, efikasi diri, dan pemetaan sumber
              stres utama Anda.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">Anonim & Siap Konseling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tanpa email/password, tanpa pihak ketiga. Data dapat diekspor ke CSV untuk dibawa ke
              sesi konseling kampus.
            </p>
          </div>
        </div>

        {/* Scientific Context Card */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Landasan Penelitian Ilmiah
            </div>
            <h4 className="text-base font-semibold text-white">
              Mengapa Ecological Momentary Assessment (EMA)?
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Metode survei retrospektif tradisional yang menanyakan &quot;bagaimana stres Anda dalam 2
              minggu terakhir&quot; rentan terhadap bias ingatan (hanya mengingat kejadian paling ekstrem).
              EMA mengukur kondisi saat ini sedekat mungkin dengan waktu kejadian, sehingga akurat
              menangkap dinamika emosi dan titik awal peralihan menuju burnout (Saragih &amp; Situngkir, 2022).
            </p>
          </div>
          <button
            onClick={onOpenGuide}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 whitespace-nowrap transition-colors"
          >
            Baca Panduan & Rujukan
          </button>
        </div>
      </div>
    </div>
  );
}
