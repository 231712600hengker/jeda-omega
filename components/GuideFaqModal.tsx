'use client';

import React from 'react';
import { X, BookOpen, Brain, Shield, PhoneCall, HelpCircle, FileCheck, Layers } from 'lucide-react';

interface GuideFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideFaqModal({ isOpen, onClose }: GuideFaqModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col gap-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Panduan EMA &amp; Dasar Ilmiah Jeda
              </h2>
              <p className="text-xs text-slate-400">
                Referensi: Saragih &amp; Situngkir (2022) · GIAT: Teknologi untuk Masyarakat Vol. 1
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6 overflow-y-auto pr-2 text-xs leading-relaxed text-slate-300">
          {/* Section 1: Apa itu EMA? */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span>1. Mengapa Ecological Momentary Assessment (EMA)?</span>
            </h3>
            <p>
              Penelitian psikologi menunjukkan bahwa kuesioner stres retrospektif (misal menanyakan
              kondisi selama 2-4 minggu terakhir) rentan mengalami <strong>bias ingatan (recall bias)</strong>.
              Mahasiswa cenderung hanya mengingat momen paling berkesan atau paling ekstrem saja.
            </p>
            <p>
              Pendekatan <strong>EMA</strong> meminta mahasiswa melaporkan pengalaman afektif dan
              kelelahan secara berulang sedekat mungkin dengan waktu terjadinya dalam konteks kehidupan
              sehari-hari. Ini memungkinkan penangkapan dinamika fluktuasi harian dan identifikasi pola
              peralihan menuju burnout secara dini.
            </p>
          </section>

          {/* Section 2: Struktur 9 Item Instrumen */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>2. Instrumen Pengukuran 9 Item Jeda</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white mb-1">Item 1-2: Kecemasan (GAD-2)</div>
                <p className="text-[11px] text-slate-400">
                  Diadaptasi dari Generalized Anxiety Disorder 2-item (Kroenke et al., 2007) dari
                  pengukuran frekuensi mingguan menjadi <em>intensitas saat ini</em> (skala 0-3).
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white mb-1">Item 3-4: Kelelahan (Chalder Fatigue)</div>
                <p className="text-[11px] text-slate-400">
                  Mengukur kelelahan mental/kognitif dan fisik secara terpisah pada skala numerik 1-10
                  (Chalder et al., 1993).
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white mb-1">Item 5-6: Kuantitas &amp; Kualitas Tidur</div>
                <p className="text-[11px] text-slate-400">
                  Diadaptasi dari Pittsburgh Sleep Quality Index (PSQI) untuk menilai pemulihan tubuh
                  dan gangguan tidur akibat stres.
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white mb-1">Item 7-9: Progres &amp; Sumber Stres</div>
                <p className="text-[11px] text-slate-400">
                  Menilai kemajuan penulisan skripsi (1-5), efikasi diri, dan pemetaan 5 kategori
                  sumber stres kontekstual (teknis, birokrasi, waktu, fasilitas, personal).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Logika Ambang Batas Peringatan */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>3. Ambang Batas Deteksi (Thresholds)</span>
            </h3>
            <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div>
                <strong className="text-amber-400">Peringatan Akut (Acute Alert):</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Dipicu jika <code className="text-emerald-300">skor kecemasan gabungan (Item 1 + Item 2) &ge; 5</code>{' '}
                  ATAU <code className="text-emerald-300">rata-rata kelelahan saat ini &ge; 8.0</code>.
                  Menandakan perlunya rehat sejenak hari ini.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <strong className="text-rose-400">Peringatan Kronis (Chronic Alert):</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Dipicu jika dalam 5 check-in terakhir, <code className="text-emerald-300">rata-rata progres 5 hari &le; 2.0</code>{' '}
                  DAN <code className="text-emerald-300">rata-rata kelelahan 5 hari &ge; 6.0</code>.
                  Dilengkapi mekanisme peredam (tidak memicu ulang jika ada peringatan serupa yang belum
                  ditinjau dalam 3 hari).
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Kontak Bantuan & Dukungan Kampus */}
          <section className="space-y-2 bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>4. Saluran Dukungan Psikologis &amp; Konseling</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Jika Anda merasakan kelelahan berkepanjangan atau kecemasan yang mengganggu aktivitas
              sehari-hari, Anda tidak sendirian:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pt-1">
              <li>
                <strong>Unit Layanan Bimbingan &amp; Konseling Kampus:</strong> Biasanya tersedia gratis
                di rektorat atau fakultas psikologi universitas Anda.
              </li>
              <li>
                <strong>Layanan SEJIWA (Kemenkes RI):</strong> Hubungi Hotline <strong>119</strong> (ekstensi 8).
              </li>
              <li>
                <strong>Yayasan Pulih:</strong> Layanan konseling psikososial daring (+62 811-8436-633).
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
