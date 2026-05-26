'use client'
import { useEffect, useRef, useState } from 'react'

interface CounterBadgeProps {
  initialCount?: number
}

export function CounterBadge({ initialCount = 0 }: CounterBadgeProps) {
  const [count, setCount] = useState(initialCount)
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then(r => r.json())
      .then(d => setCount(d.count ?? initialCount))
      .catch(() => {})
  }, [initialCount])

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const target = count
          const duration = 1200
          const start = performance.now()
          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayed(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [count])

  return (
    <div ref={ref} className="inline-flex items-center gap-2 text-[15px] text-[#2A2A28]">
      <span className="h-2 w-2 rounded-full bg-[#B85633] animate-pulse flex-shrink-0" />
      <span>
        <span className="font-bold tabular-nums">{displayed.toLocaleString('fr-FR')}</span>
        {' '}motards déjà inscrits · En avant première sur Lyon
      </span>
    </div>
  )
}
