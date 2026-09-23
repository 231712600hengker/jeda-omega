import { CheckinItem, AlertRecord, UserSession, StressorCategory } from '@/types/jeda';

const STORAGE_KEYS = {
  CURRENT_USER: 'jeda_user_session',
  CHECKINS_PREFIX: 'jeda_checkins_',
  ALERTS_PREFIX: 'jeda_alerts_',
};

/**
 * Generate anonymous access code (e.g. JD-A7F2K9)
 */
export function generateAccessCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `JD-${code}`;
}

export function getCurrentSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentSession(session: UserSession | null): void {
  if (typeof window === 'undefined') return;
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
  }
}

export function getCheckinsForUser(userId: string): CheckinItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`${STORAGE_KEYS.CHECKINS_PREFIX}${userId}`);
  if (!raw) return [];
  try {
    const list: CheckinItem[] = JSON.parse(raw);
    // Sort descending by checkinDate & checkinTime
    return list.sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime());
  } catch {
    return [];
  }
}

export function saveCheckinForUser(userId: string, item: CheckinItem): CheckinItem[] {
  if (typeof window === 'undefined') return [];
  const existing = getCheckinsForUser(userId);
  // Cek apakah tanggal hari ini sudah ada, jika ya perbarui atau tambahkan
  const index = existing.findIndex((c) => c.checkinDate === item.checkinDate);
  let updated: CheckinItem[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = item;
  } else {
    updated = [item, ...existing];
  }
  localStorage.setItem(`${STORAGE_KEYS.CHECKINS_PREFIX}${userId}`, JSON.stringify(updated));

  // Update session lastCheckinAt
  const session = getCurrentSession();
  if (session && session.userId === userId) {
    session.lastCheckinAt = item.checkinTime;
    saveCurrentSession(session);
  }

  return updated;
}

export function getAlertsForUser(userId: string): AlertRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`${STORAGE_KEYS.ALERTS_PREFIX}${userId}`);
  if (!raw) return [];
  try {
    const list: AlertRecord[] = JSON.parse(raw);
    return list.sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
  } catch {
    return [];
  }
}

export function saveAlertForUser(userId: string, alert: AlertRecord): AlertRecord[] {
  if (typeof window === 'undefined') return [];
  const existing = getAlertsForUser(userId);
  const updated = [alert, ...existing];
  localStorage.setItem(`${STORAGE_KEYS.ALERTS_PREFIX}${userId}`, JSON.stringify(updated));
  return updated;
}

export function markAlertReviewed(userId: string, alertId: string): AlertRecord[] {
  if (typeof window === 'undefined') return [];
  const existing = getAlertsForUser(userId);
  const now = new Date().toISOString();
  const updated = existing.map((a) => (a.id === alertId ? { ...a, reviewedAt: now } : a));
  localStorage.setItem(`${STORAGE_KEYS.ALERTS_PREFIX}${userId}`, JSON.stringify(updated));
  return updated;
}

export function clearUserData(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${STORAGE_KEYS.CHECKINS_PREFIX}${userId}`);
  localStorage.removeItem(`${STORAGE_KEYS.ALERTS_PREFIX}${userId}`);
  const session = getCurrentSession();
  if (session && session.userId === userId) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

/**
 * Generate CSV representation according to PRD 5.6
 */
export function exportCheckinsToCSV(accessCode: string, checkins: CheckinItem[]): string {
  const now = new Date().toISOString();
  const headerLines = [
    `# Ekspor Data Aplikasi Jeda`,
    `# Kode Akses: ${accessCode}`,
    `# Tanggal Export: ${now}`,
    `# Catatan: Data ini adalah riwayat check-in pribadi Anda.`,
    `# Dapat dibawa ke sesi konseling untuk diskusi berbasis data objektif.`,
    `# Referensi: EMA untuk Pemantauan Stres & Pencegahan Burnout (Saragih & Situngkir, 2022)`,
  ];

  const columns = [
    'Timestamp',
    'Tanggal',
    'Kecemasan_1',
    'Kecemasan_2',
    'Kecemasan_Gabungan',
    'Kelelahan_Mental',
    'Kelelahan_Fisik',
    'Rata_Kelelahan',
    'Tidur_Kuantitas',
    'Tidur_Kualitas',
    'Progres',
    'Efikasi_Diri',
    'Rata_Progres',
    'Sumber_Stres_Kategori',
    'Catatan',
    'Peringatan_Akut',
    'Peringatan_Kronis',
  ];

  const rows = checkins.map((c) => {
    const combinedAnxiety = c.anxietyQ1 + c.anxietyQ2;
    const avgFatigue = ((c.fatigueMental + c.fatiguePhysical) / 2).toFixed(1);
    const avgProg = ((c.progress + c.selfEfficacy) / 2).toFixed(1);
    const stressorNames = (c.stressors || []).join(';');
    const safeNote = (c.note || '').replace(/"/g, '""');

    return [
      `"${c.checkinTime}"`,
      `"${c.checkinDate}"`,
      c.anxietyQ1,
      c.anxietyQ2,
      combinedAnxiety,
      c.fatigueMental,
      c.fatiguePhysical,
      avgFatigue,
      `"${c.sleepQuantity}"`,
      `"${c.sleepQuality}"`,
      c.progress,
      c.selfEfficacy,
      avgProg,
      `"${stressorNames}"`,
      `"${safeNote}"`,
      c.acuteAlertTriggered ? 'YA' : 'TIDAK',
      c.chronicAlertTriggered ? 'YA' : 'TIDAK',
    ].join(',');
  });

  return `${headerLines.join('\n')}\n\n${columns.join(',')}\n${rows.join('\n')}`;
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Realistic 30-Day Research Demonstration Data
 * Follows authentic student thesis journey with acute spike and chronic stagnation
 */
export function loadDemoDataset(userId: string): { checkins: CheckinItem[]; alerts: AlertRecord[] } {
  const today = new Date();
  const demoCheckins: CheckinItem[] = [];
  const demoAlerts: AlertRecord[] = [];

  // 30 days back to today
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = new Date(d.setHours(20, 15, 0, 0)).toISOString();

    let anxiety1 = 0;
    let anxiety2 = 0;
    let fatigueM = 3;
    let fatigueP = 3;
    let sleepQty: CheckinItem['sleepQuantity'] = '7-8 jam';
    let sleepQual: CheckinItem['sleepQuality'] = 'baik';
    let prog = 4;
    let eff = 4;
    let stressors: StressorCategory[] = [];
    let note = '';
    let isAcute = false;
    let isChronic = false;

    // Timeline phases:
    if (i >= 20) {
      // Days 1-10: Fase Awal Produktif & Tenang
      anxiety1 = Math.floor(Math.random() * 2); // 0 or 1
      anxiety2 = 0;
      fatigueM = 3 + Math.floor(Math.random() * 2);
      fatigueP = 3 + Math.floor(Math.random() * 2);
      sleepQty = '7-8 jam';
      sleepQual = 'baik';
      prog = 3 + Math.floor(Math.random() * 2);
      eff = 4;
      stressors = ['technical'];
      note = 'Mulai menyusun bab metodologi penelitian.';
    } else if (i >= 15) {
      // Days 11-15: Lonjakan Stres Akut (Bimbingan mendadak revisi total bab 3 & 4)
      anxiety1 = 3; // Berat
      anxiety2 = 2; // Sedang -> combined = 5 (TRIGGERS ACUTE)
      fatigueM = 8;
      fatigueP = 7; // avg = 7.5
      sleepQty = '< 5 jam';
      sleepQual = 'buruk';
      prog = 2;
      eff = 2;
      stressors = ['guidance_bureaucracy', 'technical', 'time_management'];
      note = 'Dosen pembimbing minta ubah metode analisis data secara menyeluruh.';
      isAcute = true;
    } else if (i >= 10) {
      // Days 16-20: Pemulihan parsial
      anxiety1 = 2;
      anxiety2 = 1;
      fatigueM = 5;
      fatigueP = 5;
      sleepQty = '5-6 jam';
      sleepQual = 'cukup';
      prog = 3;
      eff = 3;
      stressors = ['technical'];
      note = 'Mencari dataset alternatif dan membaca literatur.';
    } else if (i >= 5) {
      // Days 21-25: Stagnasi Berkepanjangan + Kelelahan Tinggi (TRIGGERS CHRONIC)
      anxiety1 = 2;
      anxiety2 = 2; // combined = 4
      fatigueM = 7 + (i % 2); // 7-8
      fatigueP = 7; // avg >= 7.0
      sleepQty = '< 5 jam';
      sleepQual = 'buruk';
      prog = 1 + (i % 2 === 0 ? 1 : 0); // 1-2
      eff = 1 + (i % 2 === 0 ? 1 : 0); // 1-2 -> avg <= 2.0
      stressors = ['time_management', 'personal', 'infrastructure'];
      note = 'Analisis coding macet total, merasa buntu dan kehilangan semangat.';
      if (i === 5) {
        isChronic = true; // Hari ke-5 kondisi stagnan
      }
    } else {
      // Days 26-30: Intervensi mandiri / Rehat sejenak
      anxiety1 = 1;
      anxiety2 = 1;
      fatigueM = 4;
      fatigueP = 4;
      sleepQty = '6-7 jam';
      sleepQual = 'cukup';
      prog = 3;
      eff = 3;
      stressors = ['technical'];
      note = 'Konsultasi dengan asisten lab, sudah dapat pencerahan baru.';
    }

    const item: CheckinItem = {
      id: `chk-demo-${i}`,
      userId,
      checkinDate: dateStr,
      checkinTime: timeStr,
      anxietyQ1: anxiety1,
      anxietyQ2: anxiety2,
      fatigueMental: fatigueM,
      fatiguePhysical: fatigueP,
      sleepQuantity: sleepQty,
      sleepQuality: sleepQual,
      progress: prog,
      selfEfficacy: eff,
      stressors,
      note,
      acuteAlertTriggered: isAcute,
      chronicAlertTriggered: isChronic,
      createdAt: timeStr,
    };

    demoCheckins.push(item);

    // Tambahkan alert records sesuai trigger
    if (isAcute) {
      demoAlerts.push({
        id: `alert-acute-${i}`,
        userId,
        alertType: 'acute',
        triggeredAt: timeStr,
        reviewedAt: new Date(d.getTime() + 3600000).toISOString(), // reviewed 1 jam kemudian
        data: {
          anxietyScore: anxiety1 + anxiety2,
          fatigueScore: (fatigueM + fatigueP) / 2,
          message: 'Lonjakan stres sesaat terdeteksi (skor kecemasan 5/6).',
        },
      });
    }

    if (isChronic) {
      demoAlerts.push({
        id: `alert-chronic-${i}`,
        userId,
        alertType: 'chronic',
        triggeredAt: timeStr,
        reviewedAt: null, // belum ditinjau agar tampak aktif di dashboard
        data: {
          avgProgress5Days: 1.6,
          avgFatigue5Days: 7.2,
          message: 'Pola stagnasi terdeteksi: 5 hari berturut-turut progres rendah (1.6/5) dan kelelahan tinggi (7.2/10).',
        },
      });
    }
  }

  // Simpan ke localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEYS.CHECKINS_PREFIX}${userId}`, JSON.stringify(demoCheckins));
    localStorage.setItem(`${STORAGE_KEYS.ALERTS_PREFIX}${userId}`, JSON.stringify(demoAlerts));
  }

  return { checkins: demoCheckins, alerts: demoAlerts };
}
