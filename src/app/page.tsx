"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WelcomePage() {
  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom">
      {/* Brand block */}
      <div className="flex flex-col items-center pt-16 px-8">
        <div
          className="relative h-[76px] w-[76px] rounded-[22px] bg-ink text-bg-primary font-display font-bold flex items-center justify-center"
          style={{ fontSize: 44, letterSpacing: "-0.04em", boxShadow: "0 14px 30px -10px rgba(42,38,36,0.4)" }}
        >
          R
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
        <div className="font-display font-bold text-[32px] tracking-[-0.04em] mt-4">Ridly</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted mt-1.5">
          Roule ensemble · Lyon
        </div>
      </div>

      {/* Moto illustration */}
      <div className="relative mt-9 mx-auto h-[150px] w-[240px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--bg-secondary) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-0 right-0 bottom-[30px] h-[1.5px]"
          style={{ background: "var(--bg-tertiary)" }}
        >
          <span
            className="absolute left-1/2 -translate-x-1/2 top-[-1px] h-[1.5px] w-3/5 opacity-40"
            style={{ background: "var(--accent)" }}
          />
        </div>
        <svg
          width="140"
          height="84"
          viewBox="0 0 140 84"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="28" cy="62" r="16" stroke="#2A2624" strokeWidth="2.4" fill="#FBF6EE" />
          <circle cx="28" cy="62" r="6" stroke="#2A2624" strokeWidth="2" />
          <circle cx="112" cy="62" r="16" stroke="#2A2624" strokeWidth="2.4" fill="#FBF6EE" />
          <circle cx="112" cy="62" r="6" stroke="#2A2624" strokeWidth="2" />
          <path d="M28 62 L48 38 L84 38 L112 62" stroke="#2A2624" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 38 L62 22" stroke="#2A2624" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M58 22 L70 22" stroke="#B25234" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 38 Q70 30 88 38" stroke="#B25234" strokeWidth="2.4" strokeLinecap="round" fill="rgba(178,82,52,0.1)" />
          <path d="M84 38 L96 36 L102 42" stroke="#2A2624" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="68" cy="22" r="3" fill="#B25234" />
        </svg>
      </div>

      {/* Copy */}
      <div className="px-8 mt-6 text-center">
        <h1 className="font-display font-bold text-[28px] leading-[1.12] tracking-[-0.025em] mb-3">
          Tu n&apos;es pas seul pour partager
          <br />
          la passion de la <em className="not-italic text-accent">moto</em>
        </h1>
        <p className="text-bodyLg text-ink-soft max-w-[280px] mx-auto">
          Trouve des motard(e)s proches de toi pour rouler ensemble.
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-auto px-6 pt-6 pb-4 space-y-2.5">
        <Link href="/signup" className="block">
          <Button variant="primary" size="lg" fullWidth>
            Créer un compte <ArrowRight size={16} strokeWidth={2.2} />
          </Button>
        </Link>
        <Link href="/login" className="block">
          <Button variant="secondary" size="lg" fullWidth>
            J&apos;ai déjà un compte
          </Button>
        </Link>
        <p className="text-[10.5px] text-ink-muted text-center leading-[1.5] pt-3 px-4">
          En continuant, tu acceptes nos{" "}
          <a className="text-ink-soft underline">CGU</a> et notre{" "}
          <a className="text-ink-soft underline">politique de confidentialité</a>.
        </p>
      </div>
    </main>
  );
}
