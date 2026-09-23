import { CheckinItem, AlertRecord, DetectionResult } from '@/types/jeda';

/**
 * Deteksi Pola Otomatis berdasarkan instrumen EMA Jeda
 * Referensi: Saragih & Situngkir (2022), GIAT: Teknologi untuk Masyarakat Vol. 1
 */

export function evaluateCheckinAlerts(
  currentCheckin: Omit<CheckinItem, 'id' | 'createdAt' | 'acuteAlertTriggered' | 'chronicAlertTriggered'>,
  pastCheckins: CheckinItem[], // riwayat yang sudah ada, terurut dari terbaru ke terlama
  pastAlerts: AlertRecord[] = []
): DetectionResult {
  // 1. EVALUASI ALERT AKUT
  // skor_kecemasan_gabungan = Item1 + Item2 (range 0 - 6)
  const combinedAnxiety = currentCheckin.anxietyQ1 + currentCheckin.anxietyQ2;
  // rata_rata_kelelahan = (Item3 + Item4) / 2 (range 1 - 10)
  const avgFatigue = (currentCheckin.fatigueMental + currentCheckin.fatiguePhysical) / 2;

  const isAcute = combinedAnxiety >= 5 || avgFatigue >= 8;
  let acuteReason = '';
  if (isAcute) {
    const reasons: string[] = [];
    if (combinedAnxiety >= 5) {
      reasons.push(`Skor kecemasan gabungan mencapai ${combinedAnxiety}/6 (ambang batas: ≥ 5)`);
    }
    if (avgFatigue >= 8) {
      reasons.push(`Rata-rata kelelahan saat ini ${avgFatigue.toFixed(1)}/10 (ambang batas: ≥ 8)`);
    }
    acuteReason = reasons.join(' dan ');
  }

  // 2. EVALUASI ALERT KRONIS
  // Membutuhkan data 5 check-in terakhir (termasuk check-in saat ini)
  // Bentuk array 5 check-in terbaru
  const recentHistory = [currentCheckin, ...pastCheckins].slice(0, 5);
  let isChronic = false;
  let avgProgress5Days = 0;
  let avgFatigue5Days = 0;
  let chronicReason = '';

  if (recentHistory.length >= 5) {
    // Rata-rata progres & efikasi 5 hari
    const totalProgressScores = recentHistory.reduce(
      (acc, c) => acc + (c.progress + c.selfEfficacy) / 2,
      0
    );
    avgProgress5Days = totalProgressScores / recentHistory.length;

    // Rata-rata kelelahan 5 hari
    const totalFatigueScores = recentHistory.reduce(
      (acc, c) => acc + (c.fatigueMental + c.fatiguePhysical) / 2,
      0
    );
    avgFatigue5Days = totalFatigueScores / recentHistory.length;

    // Ambang batas kronis: progres <= 2 AND kelelahan >= 6
    const conditionMet = avgProgress5Days <= 2.0 && avgFatigue5Days >= 6.0;

    if (conditionMet) {
      // Periksa mekanisme peredam (suppression):
      // Jangan trigger jika sudah ada alert kronis belum ditinjau dalam 3 hari terakhir
      const now = new Date(currentCheckin.checkinTime).getTime();
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

      const hasRecentUnreviewedChronicAlert = pastAlerts.some((alert) => {
        if (alert.alertType !== 'chronic') return false;
        const alertTime = new Date(alert.triggeredAt).getTime();
        const within3Days = now - alertTime < threeDaysMs;
        const unreviewed = !alert.reviewedAt;
        return within3Days && unreviewed;
      });

      if (!hasRecentUnreviewedChronicAlert) {
        isChronic = true;
        chronicReason = `Rata-rata progres 5 hari berada di ${avgProgress5Days.toFixed(
          1
        )}/5 (ambang: ≤ 2) dan rata-rata kelelahan berada di ${avgFatigue5Days.toFixed(
          1
        )}/10 (ambang: ≥ 6)`;
      }
    }
  }

  return {
    isAcute,
    acuteDetails: isAcute
      ? {
          combinedAnxiety,
          avgFatigue,
          reason: acuteReason,
        }
      : undefined,
    isChronic,
    chronicDetails: isChronic
      ? {
          avgProgress5Days,
          avgFatigue5Days,
          reason: chronicReason,
        }
      : undefined,
  };
}
