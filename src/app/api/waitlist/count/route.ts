import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const snap = await db.collection('waitlist').count().get()
  return NextResponse.json({ count: snap.data().count })
}
