import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  const { email, prenom, ville, type_moto, source } = await req.json()

  if (!email || !prenom || !ville) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const docRef = db.collection('waitlist').doc(email.toLowerCase())
  const existing = await docRef.get()

  if (existing.exists) {
    const snap = await db.collection('waitlist').count().get()
    return NextResponse.json({ success: true, already: true, rank: snap.data().count })
  }

  await docRef.set({
    email: email.toLowerCase(),
    prenom,
    ville,
    type_moto: type_moto || null,
    source: source || 'landing',
    createdAt: FieldValue.serverTimestamp(),
    notified: false,
  })

  const snap = await db.collection('waitlist').count().get()
  return NextResponse.json({ success: true, rank: snap.data().count })
}
