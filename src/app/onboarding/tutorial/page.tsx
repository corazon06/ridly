"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockUsers } from "@/lib/mock/fixtures";

const SLIDES = [
  {
    eyebrow: "01 / 03 — explorer",
    title: "Trouve des motards proches",
    body: "Ouvre l'onglet Explorer pour voir qui roule autour de toi à Lyon.",
  },
  {
    eyebrow: "02 / 03 — comment ça marche",
    title: "Crée ou rejoins un ride",
    body: "En 60 secondes, propose une sortie ou rejoins celle d'un motard près de chez toi.",
  },
  {
    eyebrow: "03 / 03 — réseau",
    title: "Construis ton réseau motard",
    body: "Connexions, conversations, suggestions du jeudi soir. Tu n'es plus jamais seul à rouler.",
  },
];

export default function Tutorial() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;

  function next() {
    if (last) router.replace("/explorer");
    else setI((x) => x + 1);
  }

  const s = SLIDES[i];
  const featured = mockUsers.find((u) => u.id === "u_julien");
  const others = mockUsers
    .filter((u) => u.id !== "u_me" && u.id !== "u_julien")
    .slice(0, 3);

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      {/* Top bar with dots + skip */}
      <div className="safe-top px-[22px] pt-1 pb-3 flex items-center justify-between">
        <span className="w-12" />
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-[22px] bg-accent" : "w-2 bg-bg-tertiary"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => router.replace("/explorer")}
          className="font-display font-semibold text-[13px] text-ink-muted"
        >
          Passer
        </button>
      </div>

      {/* Illustration */}
      <div className="px-7 pt-5 flex items-center justify-center">
        <div
          className="relative w-full max-w-[320px] aspect-square rounded-[32px] overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)",
          }}
        >
          <div
            className="absolute -top-2/5 -right-2/5 h-4/5 w-4/5 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(178,82,52,0.18) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-[60px] h-[1.5px]"
            style={{ background: "rgba(42,38,36,0.12)" }}
          />
          <div
            className="absolute left-[14%] right-[14%] bottom-[56px] h-[2px] opacity-55"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--accent) 60%, transparent 60%)",
              backgroundSize: "8px 2px",
            }}
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[60px] flex items-end gap-3.5">
            {others[0] ? (
              <Avatar src={others[0].photo_url} size="md" ring />
            ) : null}
            <div className="relative">
              <Avatar src={featured?.photo_url} size="lg" className="ring-[3px] ring-accent" />
              <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-ink text-bg-primary border-2 border-bg-primary flex items-center justify-center">
                <Star size={11} strokeWidth={2.5} />
              </span>
            </div>
            {others[1] ? (
              <Avatar src={others[1].photo_url} size="md" ring />
            ) : null}
            {others[2] ? (
              <Avatar src={others[2].photo_url} size="md" ring />
            ) : null}
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="px-8 pt-7 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent font-bold mb-2.5">
          ★ {s.eyebrow}
        </p>
        <h1 className="text-h1 mb-2.5">{s.title}</h1>
        <p className="text-bodyLg text-ink-soft max-w-[300px] mx-auto">{s.body}</p>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade">
        <Button variant="primary" size="lg" fullWidth onClick={next}>
          {last ? "C'est parti !" : "Suivant"}{" "}
          <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
