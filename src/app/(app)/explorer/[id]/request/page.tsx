"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { useUser } from "@/lib/data/api";

const SUGGESTIONS = [
  "Niveau cool",
  "Premier ride",
  "Habitué Lyon",
  "Café à la pause",
  "Twisty fan",
];
const MAX = 250;

export default function RequestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rider = useUser(params.id);
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(s: string) {
    const has = picked.includes(s);
    setPicked((p) => (has ? p.filter((x) => x !== s) : [...p, s]));
    if (!has && !text.toLowerCase().includes(s.toLowerCase())) {
      setText((t) => (t ? `${t} ${s}` : s).slice(0, MAX));
    }
  }

  function send() {
    router.push(`/explorer/${params.id}/request-sent`);
  }

  if (!rider) return null;

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <div className="safe-top px-[22px] pt-1 pb-3 flex items-center gap-3.5">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2.5">
          <Avatar src={rider.photo_url} name={rider.prenom} size="sm" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent font-bold">
              ★ Demande de connexion
            </p>
            <p className="font-display font-bold text-[14px] -mt-0.5">
              à {rider.prenom}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-3 pb-2">
        <h1 className="text-h1 leading-tight mb-1.5">Présente-toi en quelques mots</h1>
        <p className="text-bodyLg text-ink-soft">
          Un mot personnel double les chances d&apos;être accepté.
        </p>
      </div>

      <div className="px-6 pt-4 pb-56 flex-1 no-scrollbar overflow-y-auto">
        <div
          className="bg-white rounded-card border-[1.5px] border-ink p-4 min-h-[170px] flex flex-col"
          style={{ boxShadow: "0 0 0 3px rgba(42,38,36,0.06)" }}
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            rows={5}
            placeholder={`Salut ${rider.prenom} ! Je viens de Lyon, ça te dit qu'on roule ensemble ?`}
            className="border-0 p-0 shadow-none focus:shadow-none"
          />
          <div className="border-t border-bg-secondary mt-2 pt-2 text-right font-mono text-[10.5px] tracking-wide text-ink-muted font-semibold">
            <b className="text-ink font-bold">{text.length}</b> / {MAX}
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mt-5 mb-2.5">
          Suggestions — clic pour ajouter
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => {
            const active = picked.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-chip text-[13px] font-semibold border-[1.5px] ${
                  active
                    ? "bg-accent-soft border-accent/30 text-accent-dark"
                    : "bg-white border-line text-ink"
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full inline-flex items-center justify-center ${
                    active ? "bg-accent text-bg-primary" : "bg-accent-soft text-accent"
                  }`}
                >
                  {active ? <Check size={9} strokeWidth={4} /> : <Plus size={9} strokeWidth={4} />}
                </span>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade">
        <Button variant="primary" size="lg" fullWidth onClick={send}>
          Envoyer la demande <Send size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
