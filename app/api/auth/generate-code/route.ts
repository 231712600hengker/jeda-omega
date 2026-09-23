import { NextResponse } from 'next/server';

export async function POST() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const accessCode = `JD-${code}`;
  
  return NextResponse.json({
    success: true,
    accessCode,
    generatedAt: new Date().toISOString(),
  });
}
