import { db } from '@/lib/firebase/admin'
import { notFound } from 'next/navigation'
import { AdminTable } from './_components/AdminTable'

export const dynamic = 'force-dynamic'

type Entry = {
  email: string
  prenom: string
  ville: string
  type_moto: string | null
  source: string | null
  createdAt: string | null
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: { secret?: string }
}) {
  if (!process.env.ADMIN_SECRET || searchParams.secret !== process.env.ADMIN_SECRET) {
    notFound()
  }

  const snap = await db.collection('waitlist').orderBy('createdAt', 'desc').get()
  const entries: Entry[] = snap.docs.map((d) => {
    const data = d.data()
    return {
      email: data.email ?? d.id,
      prenom: data.prenom ?? '',
      ville: data.ville ?? '',
      type_moto: data.type_moto ?? null,
      source: data.source ?? null,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    }
  })

  return (
    <main className="min-h-screen bg-[#FDFCFA] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2A2A28]">Waitlist Ridly</h1>
            <p className="text-sm text-[#6B6B6B]">{entries.length} inscrits</p>
          </div>
        </header>
        <AdminTable entries={entries} />
      </div>
    </main>
  )
}
