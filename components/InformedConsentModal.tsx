'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, FileText, Lock, HeartHandshake } from 'lucide-react';

interface InformedConsentModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onDecline: () => void;
  accessCode: string;
}

export default function InformedConsentModal({
  isOpen,
  onAgree,
  onDecline,
  accessCode,
}: InformedConsentModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Persetujuan Partisipasi & Etika Data
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aplikasi Ecological Momentary Assessment (EMA) untuk Mahasiswa Skripsi
            </p>
          </div>
        </div>

        {/* Access Code Reminder Card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Kode Akses Anonim Anda
            </div>
            <div className="font-mono text-xl font-bold text-emerald-400 tracking-wider mt-0.5">
              {accessCode}
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Simpan kode ini untuk kembali ke akun Anda sewaktu-waktu. Tanpa email, tanpa password.
          </div>
        </div>

        {/* 6 Informed Consent Points */}
        <div className="space-y-3 text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 max-h-64 overflow-y-auto">
          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Pemantauan Mandiri:</strong> Data yang diisikan ditujukan semata-mata untuk evaluasi kondisi psikologis harian Anda selama masa penyusunan skripsi.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Anonim & Privat:</strong> Sistem tidak meminta nama, NIM, email, nomor ponsel, atau identitas pribadi apa pun.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Bukan Diagnosis Klinis:</strong> Indikasi stres atau risiko kelelahan (burnout) yang tampil merupakan refleksi kesadaran diri, bukan diagnosis psikologis/medis formal.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Tanpa Pelaporan Pihak Ketiga:</strong> Data Anda tidak pernah dikirimkan secara otomatis ke dosen pembimbing, fakultas, atau pihak eksternal mana pun.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Kedaulatan Data:</strong> Anda dapat mengekspor data riwayat Anda ke format CSV kapan pun untuk dibawa sendiri ke sesi konseling jika Anda menginginkannya.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p>
              <strong className="text-slate-200">Hak Berhenti:</strong> Anda berhak berhenti menggunakan aplikasi atau menghapus seluruh catatan Anda kapan saja tanpa sanksi apa pun.
            </p>
          </div>
        </div>

        {/* Checkbox agreement */}
        <label className="flex items-start gap-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">
            Saya telah membaca, memahami, dan menyetujui seluruh ketentuan di atas untuk menggunakan Jeda sebagai alat bantu pemantauan diri.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onDecline}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={onAgree}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              agreed
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Saya Setuju & Mulai Check-in</span>
          </button>
        </div>
      </div>
    </div>
  );
}
