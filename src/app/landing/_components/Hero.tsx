'use client'
import { CounterBadge } from './CounterBadge'

function scrollToForm(e: React.MouseEvent) {
  e.preventDefault()
  const target = document.getElementById('inscription')
  if (!target) return

  const start = window.scrollY
  const end = target.getBoundingClientRect().top + start
  const distance = end - start
  const duration = 900
  let startTime: number | null = null

  // Easing cubic en S : lent → rapide → lent
  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, start + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFA] px-6 pt-14 pb-16 md:pt-20 md:pb-24">
      {/* Grain texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="relative">
            <img src="/logo-ridly.png" alt="Ridly logo" className="h-10 w-10 object-contain" style={{ mixBlendMode: 'multiply' }} />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#B85633]" />
          </div>
          <span className="text-xl font-bold text-[#2A2A28] tracking-tight">Ridly</span>
        </div>

        {/* Eyebrow */}
        <p className="text-xs font-semibold tracking-widest uppercase text-[#B85633] mb-5">
          Roule ensemble · Lyon
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A28] leading-tight mb-6">
          Tu veux rouler ce weekend.
          <br />
          <span className="text-[#6B6B6B] font-normal">Tes contacts ne répondent pas.</span>
        </h1>

        <p className="text-lg text-[#6B6B6B] mb-10 max-w-md mx-auto leading-relaxed">
          Ridly, c&apos;est l&apos;app qui te trouve des motards compatibles près de toi — en 30 secondes.
        </p>

        {/* CTA */}
        <a
          href="#inscription"
          onClick={scrollToForm}
          className="inline-block bg-[#B85633] text-white font-semibold px-8 py-4 rounded-xl text-base hover:shadow-[0_6px_20px_rgba(184,86,51,0.35)] hover:-translate-y-px transition-all duration-150 mb-2"
        >
          Rejoins la liste d&apos;attente ↓
        </a>
        <p className="text-xs text-[#6B6B6B] mb-6">Gratuit · 30 secondes · Aucun spam</p>

        {/* Counter */}
        <div className="flex flex-col items-center gap-2">
          <CounterBadge />
        </div>
      </div>
    </section>
  )
}
