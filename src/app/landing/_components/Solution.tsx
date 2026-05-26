const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 11m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
      </svg>
    ),
    title: 'Trouve',
    desc: 'Motards proches compatibles avec ton niveau',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
      </svg>
    ),
    title: 'Rejoins',
    desc: 'Un ride ouvert en 30 secondes près de toi',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4 -11l4 5l3 -3l5 9" />
      </svg>
    ),
    title: 'Roule',
    desc: 'Sans organisation qui tourne mal',
  },
]

export function Solution() {
  return (
    <section className="bg-[#FDFCFA] px-6 py-16 md:py-20 border-t border-[#E8E4DC]">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2A2A28] mb-3">
          Ridly, c&apos;est l&apos;app que les motards attendaient.
        </h2>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B85633] text-white text-xs font-semibold mb-12">
          Bientôt disponible · Lyon
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <span className="text-[#2A2A28]">{step.icon}</span>
              <h3 className="text-lg font-bold text-[#2A2A28]">{step.title}</h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#2A2A28] text-white rounded-xl px-6 py-5 text-center">
          <p className="text-[15px] m-0">
            &ldquo;Créer ou rejoindre un ride : <strong>moins de 60 secondes.</strong>&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
