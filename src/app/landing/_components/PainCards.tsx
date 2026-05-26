const cards = [
  {
    title: 'Tu textes le groupe. Silence.',
    desc: 'Tes potes sont pas dispo. Encore.',
    quote: '"Ce weekend tu veux rouler. Personne ne répond."',
  },
  {
    title: '47 messages dans le groupe FB. 0 ride.',
    desc: 'Tu veux rouler, pas faire de la modération.',
    quote: '"47 messages dans le groupe FB. 0 ride organisé."',
  },
  {
    title: 'Pas de motard(e)s autour de toi ?',
    desc: 'Nouveau·elle dans la ville ? Tu viens d\'avoir ton permis ?',
    quote: '"Nouveau·elle dans la ville ? Tu viens d\'avoir ton permis ?"',
  },
]

export function PainCards() {
  return (
    <section className="bg-[#FDFCFA] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-10">
          Tu te reconnais ?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-[#F4F1EC] border border-[#E8E4DC] border-l-[3px] border-l-[#B85633] rounded-xl p-7 shadow-[0_2px_12px_rgba(42,42,40,0.06)] hover:shadow-[0_8px_24px_rgba(42,42,40,0.15)] transition-shadow duration-200"
            >
              <h3 className="text-base font-bold text-[#2A2A28] mb-2 leading-snug">{card.title}</h3>
              <p className="text-[13px] text-[#6B6B6B] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
