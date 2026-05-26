'use client'
import { useState } from 'react'
import { MotoToggle } from './MotoToggle'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const VILLES = [
  'Lyon (69000-69009)',
  'Villeurbanne',
  'Caluire-et-Cuire',
  'Vénissieux',
  'Bron',
  'Saint-Priest',
  'Décines-Charpieu',
  'Autre ville (hors Lyon)',
]

export function WaitlistForm() {
  const [state, setState] = useState<FormState>('idle')
  const [rank, setRank] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [ville, setVille] = useState('')
  const [typesMoto, setTypesMoto] = useState<string[]>([])
  const [rgpd, setRgpd] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rgpd) return
    setState('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom,
          email,
          ville,
          type_moto: typesMoto.join(', ') || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setRank(data.rank ?? null)
        setState('success')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ridly — Rejoins la liste d\'attente', url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-10 px-6" style={{ animation: 'ridlyFadeUp 0.4s ease both' }}>
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#B85633] text-white mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        {rank && (
          <h2 className="text-2xl font-semibold text-[#2A2A28] mb-2">
            Tu es #{rank} sur la liste.
          </h2>
        )}

        <p className="text-[15px] text-[#6B6B6B] mb-8">
          On te prévient dès que Ridly est dispo à Lyon.<br />
          Vérifie ton email (et tes spams).
        </p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a
            href="https://instagram.com/ridly.app"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#2A2A28] text-white text-center py-3.5 px-6 rounded-xl text-[15px] no-underline font-medium hover:opacity-90 transition-opacity"
          >
            Suivre Ridly sur Instagram →
          </a>
          <button
            onClick={handleShare}
            className="w-full bg-transparent border border-[#E8E4DC] text-[#2A2A28] py-3.5 px-6 rounded-xl text-[15px] cursor-pointer hover:border-[#2A2A28] transition-colors"
          >
            {copied ? 'Lien copié ✓' : 'Partager la page'}
          </button>
        </div>

        <p className="text-xs text-[#6B6B6B] mt-4">
          Plus la liste est grande, plus Lyon décolle vite.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Micro-réassurances */}
      <div className="flex gap-4 justify-center mb-6 flex-wrap">
        {['✓ Aucune CB requise', '✓ 30 secondes', '✓ Lyon en avant-première'].map(item => (
          <span key={item} className="text-[13px] text-[#6B6B6B] flex items-center gap-1">{item}</span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Prénom */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A28] mb-1.5">
            Prénom <span className="text-[#B85633]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Maxime"
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            disabled={state === 'loading'}
            className="w-full h-12 px-4 rounded-xl border border-[#E8E4DC] bg-white text-[#2A2A28] placeholder-[#6B6B6B] focus:outline-none focus:border-[#B85633] transition-colors disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A28] mb-1.5">
            Email <span className="text-[#B85633]">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={state === 'loading'}
            className="w-full h-12 px-4 rounded-xl border border-[#E8E4DC] bg-white text-[#2A2A28] placeholder-[#6B6B6B] focus:outline-none focus:border-[#B85633] transition-colors disabled:opacity-50"
          />
        </div>

        {/* Ville */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A28] mb-1.5">
            Ta ville <span className="text-[#B85633]">*</span>
          </label>
          <select
            required
            value={ville}
            onChange={e => setVille(e.target.value)}
            disabled={state === 'loading'}
            className="w-full h-12 px-4 rounded-xl border border-[#E8E4DC] bg-white text-[#2A2A28] focus:outline-none focus:border-[#B85633] transition-colors disabled:opacity-50 appearance-none"
          >
            <option value="" disabled>Sélectionne ta ville</option>
            {VILLES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Type moto */}
        <div>
          <label className="block text-sm font-semibold text-[#2A2A28] mb-1.5">
            Ta moto <span className="text-[#6B6B6B] font-normal">(optionnel)</span>
          </label>
          <MotoToggle value={typesMoto} onChange={setTypesMoto} />
        </div>

        {/* RGPD */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={rgpd}
            onChange={e => setRgpd(e.target.checked)}
            disabled={state === 'loading'}
            className="mt-0.5 h-4 w-4 rounded border-[#E8E4DC] accent-[#B85633] flex-shrink-0"
          />
          <span className="text-sm text-[#6B6B6B] leading-snug">
            Je veux être prévenu(e) en avant-première quand Ridly est dispo à Lyon.{' '}
            <span className="text-[#2A2A28]">Max 1 email/mois.</span>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={state === 'loading' || !rgpd}
          className="w-full bg-[#B85633] text-white font-medium text-base rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_6px_20px_rgba(184,86,51,0.35)] hover:-translate-y-px transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          style={{ height: '52px', borderRadius: '12px' }}
        >
          {state === 'loading' ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Inscription en cours…
            </>
          ) : (
            'Rejoindre la liste · Lyon en premier →'
          )}
        </button>

        <p className="text-center text-xs text-[#6B6B6B]">
          Tu seras notifié(e) dès que Ridly est disponible à Lyon.
        </p>

        {/* Error toast */}
        {state === 'error' && (
          <div className="text-center text-sm text-[#B85633] bg-[#FBE9DD] border border-[#E8855A]/30 rounded-xl py-3 px-4">
            Une erreur s&apos;est produite. Réessaie.
          </div>
        )}
      </form>
    </>
  )
}
