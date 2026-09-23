import { NextRequest, NextResponse } from 'next/server';
import { evaluateCheckinAlerts } from '@/lib/detection';
import { CheckinItem, AlertRecord } from '@/types/jeda';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      anxietyQ1,
      anxietyQ2,
      fatigueMental,
      fatiguePhysical,
      sleepQuantity,
      sleepQuality,
      progress,
      selfEfficacy,
      stressors = [],
      note = '',
      pastCheckins = [],
      pastAlerts = [],
    } = body;

    // Validasi 9 item
    if (
      anxietyQ1 === undefined ||
      anxietyQ2 === undefined ||
      fatigueMental === undefined ||
      fatiguePhysical === undefined ||
      !sleepQuantity ||
      !sleepQuality ||
      progress === undefined ||
      selfEfficacy === undefined
    ) {
      return NextResponse.json(
        { error: 'Semua 9 item check-in wajib diisi.' },
        { status: 400 }
      );
    }

    const checkinTime = new Date().toISOString();
    const checkinDate = checkinTime.split('T')[0];

    const currentCheckin = {
      userId: userId || 'anonymous',
      checkinDate,
      checkinTime,
      anxietyQ1: Number(anxietyQ1),
      anxietyQ2: Number(anxietyQ2),
      fatigueMental: Number(fatigueMental),
      fatiguePhysical: Number(fatiguePhysical),
      sleepQuantity,
      sleepQuality,
      progress: Number(progress),
      selfEfficacy: Number(selfEfficacy),
      stressors: Array.isArray(stressors) ? stressors : [],
      note: String(note || ''),
    };

    // Jalankan evaluasi alert otomatis (Saragih & Situngkir, 2022)
    const detection = evaluateCheckinAlerts(
      currentCheckin,
      pastCheckins as CheckinItem[],
      pastAlerts as AlertRecord[]
    );

    const generatedAlerts: AlertRecord[] = [];

    if (detection.isAcute && detection.acuteDetails) {
      generatedAlerts.push({
        id: `alert-acute-${Date.now()}`,
        userId: currentCheckin.userId,
        alertType: 'acute',
        triggeredAt: checkinTime,
        reviewedAt: null,
        data: {
          anxietyScore: detection.acuteDetails.combinedAnxiety,
          fatigueScore: detection.acuteDetails.avgFatigue,
          message: detection.acuteDetails.reason,
        },
      });
    }

    if (detection.isChronic && detection.chronicDetails) {
      generatedAlerts.push({
        id: `alert-chronic-${Date.now()}`,
        userId: currentCheckin.userId,
        alertType: 'chronic',
        triggeredAt: checkinTime,
        reviewedAt: null,
        data: {
          avgProgress5Days: detection.chronicDetails.avgProgress5Days,
          avgFatigue5Days: detection.chronicDetails.avgFatigue5Days,
          message: detection.chronicDetails.reason,
        },
      });
    }

    const fullCheckin: CheckinItem = {
      ...currentCheckin,
      id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      acuteAlertTriggered: detection.isAcute,
      chronicAlertTriggered: detection.isChronic,
      createdAt: checkinTime,
    };

    return NextResponse.json({
      success: true,
      checkin: fullCheckin,
      detection,
      alerts: generatedAlerts,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
