export type SleepQuantity = '< 5 jam' | '5-6 jam' | '6-7 jam' | '7-8 jam' | '> 8 jam';
export type SleepQuality = 'buruk' | 'cukup' | 'baik';

export type StressorCategory =
  | 'technical' // Beban teknis/kognitif (riset, analisis data, menulis)
  | 'guidance_bureaucracy' // Bimbingan & birokrasi (proses bimbingan, revisi dosen, administrasi)
  | 'time_management' // Manajemen waktu (deadline, prioritas, prokrastinasi)
  | 'infrastructure' // Infrastruktur & lingkungan (tempat kerja, koneksi, akses jurnal)
  | 'personal'; // Personal (keluarga, pertemanan, kesehatan)

export interface CheckinItem {
  id: string;
  userId: string;
  checkinDate: string; // YYYY-MM-DD
  checkinTime: string; // ISO string
  
  // 9 Item EMA Data
  anxietyQ1: number; // 0-3 (Merasa cemas/gelisah saat ini)
  anxietyQ2: number; // 0-3 (Tidak mampu mengendalikan rasa khawatir)
  fatigueMental: number; // 1-10 (Kelelahan kognitif/mental)
  fatiguePhysical: number; // 1-10 (Kelelahan fisik tubuh)
  sleepQuantity: SleepQuantity; // Kuantitas tidur
  sleepQuality: SleepQuality; // Kualitas tidur
  progress: number; // 1-5 (Progres pengerjaan skripsi hari ini)
  selfEfficacy: number; // 1-5 (Keyakinan dapat menyelesaikan skripsi tepat waktu)
  stressors: StressorCategory[]; // Sumber stres (multi-choice)
  
  // Catatan singkat opsional mahasiswa
  note?: string;

  // Flags calculated at submission
  acuteAlertTriggered?: boolean;
  chronicAlertTriggered?: boolean;
  
  createdAt: string;
}

export type AlertType = 'acute' | 'chronic';

export interface AlertRecord {
  id: string;
  userId: string;
  alertType: AlertType;
  triggeredAt: string;
  reviewedAt?: string | null;
  data: {
    anxietyScore?: number;
    fatigueScore?: number;
    avgProgress5Days?: number;
    avgFatigue5Days?: number;
    message: string;
  };
}

export interface UserSession {
  userId: string;
  accessCode: string;
  consentAgreed: boolean;
  consentAgreedAt?: string;
  createdAt: string;
  lastCheckinAt?: string;
}

export interface DetectionResult {
  isAcute: boolean;
  acuteDetails?: {
    combinedAnxiety: number;
    avgFatigue: number;
    reason: string;
  };
  isChronic: boolean;
  chronicDetails?: {
    avgProgress5Days: number;
    avgFatigue5Days: number;
    reason: string;
  };
}
