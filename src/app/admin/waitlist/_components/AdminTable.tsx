'use client'

import { useMemo, useState } from 'react'

type Entry = {
  email: string
  prenom: string
  ville: string
  type_moto: string | null
  source: string | null
  createdAt: string | null
}

export function AdminTable({ entries }: { entries: Entry[] }) {
  const [villeFilter, setVilleFilter] = useState('')

  const villes = useMemo(
    () => Array.from(new Set(entries.map((e) => e.ville).filter(Boolean))).sort(),
    [entries]
  )

  const filtered = useMemo(
    () => (villeFilter ? entries.filter((e) => e.ville === villeFilter) : entries),
    [entries, villeFilter]
  )

  function exportCsv() {
    const header = ['prenom', 'email', 'ville', 'type_moto', 'source', 'createdAt']
    const rows = filtered.map((e) =>
      header.map((k) => JSON.stringify((e as any)[k] ?? '')).join(',')
    )
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ridly-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <select
          value={villeFilter}
          onChange={(e) => setVilleFilter(e.target.value)}
          className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-sm"
        >
          <option value="">Toutes les villes</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <button
          onClick={exportCsv}
          className="rounded-lg bg-[#2A2A28] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Export CSV ({filtered.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E8E4DC] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F1EA] text-left text-[#6B6B6B]">
            <tr>
              <th className="px-4 py-3">Prénom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Moto</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.email} className="border-t border-[#E8E4DC]">
                <td className="px-4 py-3 font-medium text-[#2A2A28]">{e.prenom}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">{e.email}</td>
                <td className="px-4 py-3">{e.ville}</td>
                <td className="px-4 py-3">{e.type_moto ?? '—'}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">{e.source ?? '—'}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">
                  {e.createdAt ? new Date(e.createdAt).toLocaleString('fr-FR') : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#6B6B6B]">
                  Aucun inscrit
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
