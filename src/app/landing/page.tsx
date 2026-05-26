import type { Metadata } from 'next'
import { Hero } from './_components/Hero'
import { PainCards } from './_components/PainCards'
import { Solution } from './_components/Solution'
import { SocialProof } from './_components/SocialProof'
import { WaitlistForm } from './_components/WaitlistForm'
import { Footer } from './_components/Footer'
import StickyMobileCTA from './_components/StickyMobileCTA'

export const metadata: Metadata = {
  title: 'Ridly — Trouve des motards pour rouler ensemble · Lyon',
  description:
    "Ridly connecte les motards qui veulent rouler ensemble. Trouve des riders compatibles près de toi. Rejoins la liste d'attente — lancement à Lyon en 2026.",
  openGraph: {
    title: "Ridly — Tu n'es pas seul pour partager la passion de la moto",
    description: "Rejoins la liste d'attente Ridly. En avant première sur Lyon.",
    url: 'https://ridly.app',
    siteName: 'Ridly',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ridly — Trouve des motards pour rouler ensemble',
  },
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PainCards />
      <Solution />
      <SocialProof />

      {/* Formulaire */}
      <section id="inscription" className="bg-[#FDFCFA] px-6 py-16 md:py-20 border-t border-[#E8E4DC]">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2A2A28] mb-2">
              Rejoins la liste d&apos;attente
            </h2>
            <p className="text-[#B85633] font-semibold">En avant première sur Lyon.</p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <Footer />
      <StickyMobileCTA />
    </>
  )
}
