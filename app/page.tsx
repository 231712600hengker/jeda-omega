'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LandingHero from '@/components/LandingHero';
import InformedConsentModal from '@/components/InformedConsentModal';
import CheckInForm from '@/components/CheckInForm';
import DashboardView from '@/components/DashboardView';
import HistoryTable from '@/components/HistoryTable';
import AlertModal from '@/components/AlertModal';
import GuideFaqModal from '@/components/GuideFaqModal';
import SettingsModal from '@/components/SettingsModal';
import {
  UserSession,
  CheckinItem,
  AlertRecord,
  DetectionResult,
} from '@/types/jeda';
import {
  getCurrentSession,
  saveCurrentSession,
  getCheckinsForUser,
  saveCheckinForUser,
  getAlertsForUser,
  saveAlertForUser,
  markAlertReviewed,
  clearUserData,
  generateAccessCode,
  loadDemoDataset,
  exportCheckinsToCSV,
  downloadCSV,
} from '@/lib/storage';
import { evaluateCheckinAlerts } from '@/lib/detection';

export default function HomePage() {
  const [session, setSession] = useState<UserSession | null>(() => {
    if (typeof window !== 'undefined') {
      return getCurrentSession();
    }
    return null;
  });
  const [checkins, setCheckins] = useState<CheckinItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cur = getCurrentSession();
      if (cur) return getCheckinsForUser(cur.userId);
    }
    return [];
  });
  const [alerts, setAlerts] = useState<AlertRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const cur = getCurrentSession();
      if (cur) return getAlertsForUser(cur.userId);
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'checkin' | 'history'>('dashboard');

  // Modals
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingAccessCode, setPendingAccessCode] = useState<string>('');
  const [activeAlert, setActiveAlert] = useState<AlertRecord | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mulai akun baru
  const handleStartNew = () => {
    const code = generateAccessCode();
    setPendingAccessCode(code);
    setShowConsentModal(true);
  };

  // Setuju informed consent
  const handleAgreeConsent = () => {
    const userId = `usr_${pendingAccessCode.replace('JD-', '').toLowerCase()}`;
    const newSession: UserSession = {
      userId,
      accessCode: pendingAccessCode,
      consentAgreed: true,
      consentAgreedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveCurrentSession(newSession);
    setSession(newSession);
    setCheckins([]);
    setAlerts([]);
    setShowConsentModal(false);
    setActiveTab('checkin'); // langsung arahkan ke check-in pertama
    showToast(`Akun anonim ${pendingAccessCode} aktif. Selamat datang di Jeda.`);
  };

  // Masuk dengan kode yang sudah ada
  const handleLogin = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const userId = `usr_${cleanCode.replace('JD-', '').toLowerCase()}`;
    const existing = getCurrentSession();
    if (existing && existing.accessCode === cleanCode) {
      setSession(existing);
      setCheckins(getCheckinsForUser(existing.userId));
      setAlerts(getAlertsForUser(existing.userId));
      setActiveTab('dashboard');
      showToast(`Selamat datang kembali, ${cleanCode}.`);
      return;
    }

    // Buat session baru atau pulihkan dari storage
    const newSession: UserSession = {
      userId,
      accessCode: cleanCode,
      consentAgreed: true,
      consentAgreedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveCurrentSession(newSession);
    setSession(newSession);
    const loadedCheckins = getCheckinsForUser(userId);
    const loadedAlerts = getAlertsForUser(userId);
    setCheckins(loadedCheckins);
    setAlerts(loadedAlerts);
    setActiveTab(loadedCheckins.length > 0 ? 'dashboard' : 'checkin');
    showToast(`Berhasil masuk dengan kode ${cleanCode}.`);
  };

  // Load Demo Data 30 Hari
  const handleLoadDemo = () => {
    const demoCode = 'JD-SKRIPSI30';
    const demoUserId = 'usr_demo_skripsi30';
    const demoSession: UserSession = {
      userId: demoUserId,
      accessCode: demoCode,
      consentAgreed: true,
      consentAgreedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveCurrentSession(demoSession);
    setSession(demoSession);

    const { checkins: demoC, alerts: demoA } = loadDemoDataset(demoUserId);
    setCheckins(demoC);
    setAlerts(demoA);
    setActiveTab('dashboard');
    showToast('30 hari data sampel skripsi berhasil dimuat ke dasbor.');
  };

  // Logout
  const handleLogout = () => {
    saveCurrentSession(null);
    setSession(null);
    setCheckins([]);
    setAlerts([]);
    setActiveTab('dashboard');
    showToast('Anda telah keluar. Kode akses Anda tetap aman tersimpan di perangkat ini.');
  };

  // Clear data
  const handleClearData = () => {
    if (!session) return;
    clearUserData(session.userId);
    setSession(null);
    setCheckins([]);
    setAlerts([]);
    setActiveTab('dashboard');
    showToast('Seluruh data dan riwayat check-in telah dihapus.');
  };

  // Simpan check-in 9 item
  const handleSaveCheckin = async (
    checkinPayload: Omit<CheckinItem, 'id' | 'createdAt'>
  ): Promise<DetectionResult> => {
    // 1. Jalankan deteksi alert otomatis
    const detection = evaluateCheckinAlerts(checkinPayload, checkins, alerts);

    const newCheckin: CheckinItem = {
      ...checkinPayload,
      id: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      acuteAlertTriggered: detection.isAcute,
      chronicAlertTriggered: detection.isChronic,
      createdAt: checkinPayload.checkinTime,
    };

    // 2. Simpan check-in ke storage
    const updatedCheckins = saveCheckinForUser(session!.userId, newCheckin);
    setCheckins(updatedCheckins);

    // 3. Simpan alert jika ada yang terpola
    let latestCreatedAlert: AlertRecord | null = null;
    if (detection.isChronic && detection.chronicDetails) {
      const chronicAlert: AlertRecord = {
        id: `alert-chr-${Date.now()}`,
        userId: session!.userId,
        alertType: 'chronic',
        triggeredAt: checkinPayload.checkinTime,
        reviewedAt: null,
        data: {
          avgProgress5Days: detection.chronicDetails.avgProgress5Days,
          avgFatigue5Days: detection.chronicDetails.avgFatigue5Days,
          message: detection.chronicDetails.reason,
        },
      };
      saveAlertForUser(session!.userId, chronicAlert);
      setAlerts((prev) => [chronicAlert, ...prev]);
      latestCreatedAlert = chronicAlert;
    } else if (detection.isAcute && detection.acuteDetails) {
      const acuteAlert: AlertRecord = {
        id: `alert-act-${Date.now()}`,
        userId: session!.userId,
        alertType: 'acute',
        triggeredAt: checkinPayload.checkinTime,
        reviewedAt: null,
        data: {
          anxietyScore: detection.acuteDetails.combinedAnxiety,
          fatigueScore: detection.acuteDetails.avgFatigue,
          message: detection.acuteDetails.reason,
        },
      };
      saveAlertForUser(session!.userId, acuteAlert);
      setAlerts((prev) => [acuteAlert, ...prev]);
      latestCreatedAlert = acuteAlert;
    }

    // 4. Buka modal alert jika memicu lonjakan atau stagnasi
    if (latestCreatedAlert) {
      setActiveAlert(latestCreatedAlert);
      setShowAlertModal(true);
    } else {
      showToast('Check-in hari ini berhasil disimpan. Kondisi dalam batas wajar.');
    }

    // Kembali ke tab dasbor
    setActiveTab('dashboard');
    return detection;
  };

  // Review / mark alert as acknowledged
  const handleReviewAlert = (alertId: string) => {
    if (!session) return;
    const updated = markAlertReviewed(session.userId, alertId);
    setAlerts(updated);
    showToast('Peringatan ditandai sudah ditinjau.');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!session) return;
    const csvContent = exportCheckinsToCSV(session.accessCode, checkins);
    const dateTag = new Date().toISOString().split('T')[0];
    downloadCSV(`jeda_${session.accessCode}_${dateTag}.csv`, csvContent);
    showToast('Berkas CSV berhasil diunduh.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/60 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Top Bar Contract */}
      <Navbar
        session={session}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onLogout={handleLogout}
        onLoadDemo={handleLoadDemo}
        totalCheckins={checkins.length}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {!session ? (
          <LandingHero
            onStartNew={handleStartNew}
            onLogin={handleLogin}
            onLoadDemo={handleLoadDemo}
            onOpenGuide={() => setShowGuideModal(true)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                checkins={checkins}
                alerts={alerts}
                onOpenCheckin={() => setActiveTab('checkin')}
                onExportCSV={handleExportCSV}
                onReviewAlert={handleReviewAlert}
                onLoadDemo={handleLoadDemo}
              />
            )}

            {activeTab === 'checkin' && (
              <CheckInForm
                userId={session.userId}
                onSave={handleSaveCheckin}
                onCancel={() => setActiveTab('dashboard')}
                existingTodayCheckin={
                  checkins.find(
                    (c) => c.checkinDate === new Date().toISOString().split('T')[0]
                  ) || null
                }
              />
            )}

            {activeTab === 'history' && (
              <HistoryTable
                checkins={checkins}
                onExportCSV={handleExportCSV}
                onOpenCheckin={() => setActiveTab('checkin')}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <InformedConsentModal
        isOpen={showConsentModal}
        accessCode={pendingAccessCode}
        onAgree={handleAgreeConsent}
        onDecline={() => setShowConsentModal(false)}
      />

      <AlertModal
        isOpen={showAlertModal}
        alert={activeAlert}
        onDismiss={() => setShowAlertModal(false)}
        onExportData={() => {
          handleExportCSV();
          setShowAlertModal(false);
        }}
      />

      <GuideFaqModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        session={session}
        checkins={checkins}
        onLoadDemo={handleLoadDemo}
        onExportCSV={handleExportCSV}
        onClearData={handleClearData}
      />

      {/* Clean Unboxed Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Jeda</span>
            <span aria-hidden="true">·</span>
            <span>Ecological Momentary Assessment untuk Mahasiswa Skripsi</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Saragih &amp; Situngkir (2022)</span>
            <span aria-hidden="true">·</span>
            <span>Anonim &amp; Privat</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setShowGuideModal(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Panduan Instrumen
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
