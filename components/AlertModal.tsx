'use client';

import React from 'react';
import { AlertRecord } from '@/types/jeda';
import { AlertTriangle, Flame, ShieldAlert, Heart, Download, CheckCircle, ArrowRight } from 'lucide-react';

interface AlertModalProps {
  alert: AlertRecord | null;
  isOpen: boolean;
  onDismiss: () => void;
  onExportData: () => void;
}

export default function AlertModal({
  alert,
  isOpen,
  onDismiss,
  onExportData,
}: AlertModalProps) {
  if (!isOpen || !alert) return null;

  const isChronic = alert.alertType === 'chronic';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-100 flex flex-col gap-5">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              isChronic
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}
          >
            {isChronic ? <ShieldAlert className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isChronic ? 'text-rose-400' : 'text-amber-400'
                }`}
              >
                {isChronic ? 'Pola Kronis Terdeteksi' : 'Peringatan Akut'}
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-400">Deteksi Otomatis EMA</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {isChronic
                ? 'Perhatian: Pola Stagnasi Berkelanjutan'
                : 'Perhatian: Lonjakan Stres Terdeteksi'}
            </h3>
          </div>
        </div>

        {/* Diagnostic Trigger Message */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed">
          <div className="text-slate-400 mb-1 font-medium">Kondisi yang memicu peringatan:</div>
          <div className="text-slate-200 font-semibold">{alert.data.message}</div>
        </div>

        {/* Narrative & Insights */}
        {isChronic ? (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Sistem mendeteksi bahwa Anda telah mengalami <strong>kelelahan tinggi yang berkelanjutan</strong>{' '}
              sambil <strong>progres pengerjaan skripsi terasa mandek</strong> dalam beberapa hari terakhir.
            </p>
            <p className="bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl text-rose-200">
              Ini adalah pola peralihan penting yang perlu diperhatikan, karena dapat mengindikasikan{' '}
              <strong>tahap awal burnout akademik</strong> pada mahasiswa tingkat akhir.
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="font-semibold text-white">Langkah yang dianjurkan:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Urai hambatan nyata: apakah kesulitan teknis metodologi, proses bimbingan, atau kondisi fisik?</li>
                <li>Diskusikan secara terbuka dengan rekan sejawat atau jadwalkan sesi bersama pembimbing.</li>
                <li>Pertimbangkan berkonsultasi ke Unit Layanan Bimbingan & Konseling Kampus.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Sistem mendeteksi adanya <strong>lonjakan intensitas kecemasan atau kelelahan yang tajam</strong>{' '}
              pada saat ini.
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="font-semibold text-white">Saran pemulihan segera:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Ambil jeda sejenak (15-30 menit) dari layar dan naskah skripsi untuk bernapas perlahan.</li>
                <li>Lakukan aktivitas fisik ringan atau relaksasi (jalan santai, peregangan otot).</li>
                <li>Hubungi teman atau orang terpercaya untuk bertukar cerita sejenak.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 flex items-start gap-2">
          <Heart className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Laporan ini hanya untuk kesadaran diri Anda sendiri (self-awareness), bukan diagnosis medis.
            Anda yang memegang kendali atas langkah berikutnya.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          {isChronic && (
            <button
              type="button"
              onClick={onExportData}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Data untuk Konseling</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Saya Paham</span>
          </button>
        </div>
      </div>
    </div>
  );
}
