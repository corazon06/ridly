'use client'
import { useEffect, useRef, useState } from 'react'

function QuotesCarousel() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const [animating, setAnimating] = useState(false)
  const perPage = 2
  const total = quotes.length
  const maxIndex = total - perPage

  const go = (newIndex: number, direction: 'left' | 'right') => {
    if (animating) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => {
      setIndex(newIndex)
      setAnimating(false)
    }, 300)
  }

  const prev = () => go(Math.max(index - perPage, 0), 'left')
  const next = () => go(Math.min(index + perPage, maxIndex), 'right')

  const visible = quotes.slice(index, index + perPage)

  return (
    <div>
      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        .slide-right { animation: slideInRight 0.3s ease both; }
        .slide-left  { animation: slideInLeft  0.3s ease both; }
      `}</style>

      <div className="relative flex items-center gap-3">
        {/* Flèche gauche */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex-shrink-0 h-9 w-9 rounded-full border border-[#3D3D39] flex items-center justify-center text-white hover:border-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Précédent"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 ${!animating ? (dir === 'right' ? 'slide-right' : 'slide-left') : 'opacity-0'}`}>
          {visible.map((q, i) => (
            <div key={index + i} className="bg-[#33332F] border border-[#3D3D39] rounded-2xl p-5">
              <p className="text-white text-sm italic leading-relaxed mb-3">
                &ldquo;{q.text}&rdquo;
              </p>
              <p className="text-[#6B6B6B] text-xs">— {q.author}</p>
            </div>
          ))}
        </div>

        {/* Flèche droite */}
        <button
          onClick={next}
          disabled={index >= maxIndex}
          className="flex-shrink-0 h-9 w-9 rounded-full border border-[#3D3D39] flex items-center justify-center text-white hover:border-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Suivant"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Indicateur */}
      <div className="flex justify-center mt-4 gap-1.5">
        {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === Math.floor(index / perPage) ? 'w-5 bg-[#E8855A]' : 'w-1.5 bg-[#3D3D39]'}`}
          />
        ))}
      </div>
    </div>
  )
}

const stats = [
  { target: 86, suffix: '%', label: 'trouvent l\'app utile' },
  { target: 81, suffix: '%', label: 'prêts à beta-tester' },
  { target: 40, suffix: '%', label: 'aucun frein à rider avec un inconnu' },
]

const quotes = [
  {
    text: 'J\'ai déménagé à Lyon l\'an dernier. J\'ai mis 4 mois à trouver quelqu\'un avec qui rouler via Facebook. Avec un truc comme Ridly ça aurait pris 10 minutes.',
    author: 'Thomas, 31 ans · Trail · Lyon',
  },
  {
    text: 'Le groupe WhatsApp c\'est bien mais quand t\'es nouveau dans une ville, t\'as pas de groupe. T\'es seul.',
    author: 'Léa, 27 ans · Roadster · Villeurbanne',
  },
  {
    text: 'J\'ai le permis depuis 6 mois. Tous mes amis roulent en voiture. J\'attendais une app comme ça.',
    author: 'Camille, 24 ans · Naked · Lyon',
  },
  {
    text: 'Les sorties organisées sur Facebook, c\'est soit trop loin de mon niveau, soit personne se pointe. Ridly c\'est exactement ce qu\'il manquait.',
    author: 'Maxime, 34 ans · Sportive · Villeurbanne',
  },
  {
    text: 'Nouveau à Lyon depuis 3 mois. J\'ai une moto mais personne avec qui rouler. Hate que ça sorte.',
    author: 'Romain, 29 ans · Touring · Caluire-et-Cuire',
  },
  {
    text: 'En tant que femme motarde, trouver des riders de confiance c\'est encore plus compliqué. Le concept me parle vraiment.',
    author: 'Sophie, 27 ans · Trail · Lyon',
  },
  {
    text: 'Je roule seul depuis 2 ans. Pas par choix, juste parce que c\'est galère à organiser. Ridly c\'est la solution.',
    author: 'Antoine, 38 ans · Roadster · Bron',
  },
  {
    text: 'L\'idée de filtrer par niveau c\'est génial. Marre de se retrouver avec des pilotes qui te larguent sur l\'autoroute.',
    author: 'Julie, 31 ans · Café Racer · Saint-Priest',
  },
]

function SlotNumber({ target, suffix }: { target: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return
      fired.current = true

      const duration = 2200
      const start = performance.now()

      function tick(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(target * eased))
        if (progress < 1) requestAnimationFrame(tick)
        else setDisplay(target)
      }

      requestAnimationFrame(tick)
    }, { threshold: 0.5 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-[#E8855A] mb-1 tabular-nums">
      {display}{suffix}
    </div>
  )
}

export function SocialProof() {
  return (
    <section className="bg-[#2A2A28] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-[#E8855A] mb-3">
          Validé sur le terrain
        </p>
        <h2 className="text-center text-xl md:text-2xl font-bold text-white mb-2">
          75 motards ont validé le concept
        </h2>
        <p className="text-center text-[#6B6B6B] text-sm mb-12">
          lors du salon de Lyon — février 2026.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <SlotNumber target={s.target} suffix={s.suffix} />
              <div className="text-xs text-[#6B6B6B] leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badge terrain */}
        <div className="flex justify-center mb-6">
          <span className="bg-[#B85633] text-white text-xs px-3 py-1.5 rounded-full font-semibold">
            Validé sur le terrain — Salon moto Lyon, février 2026
          </span>
        </div>

        {/* Quotes carousel */}
        <QuotesCarousel />
      </div>
    </section>
  )
}
