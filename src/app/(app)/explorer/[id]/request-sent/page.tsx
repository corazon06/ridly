"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useActions, useUser } from "@/lib/data/api";
import { ageFromBirthdate } from "@/lib/utils";

export default function RequestSentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const rider = useUser(params.id);
  const { sendConnection } = useActions();

  // Persist the demo "sent" connection on mount so it actually shows up in
  // /profile/riders > Envoyées.
  useEffect(() => {
    if (rider) sendConnection(rider.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rider?.id]);

  if (!rider) return null;
  const age = ageFromBirthdate(rider.date_naissance);

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom">
      {/* Center stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Animated check circle with two ripples */}
        <div className="relative h-[132px] w-[132px] rounded-full bg-bg-secondary flex items-center justify-center mb-7 animate-pop">
          <span
            className="absolute inset-0 rounded-full border-2 border-accent animate-ripple"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="absolute inset-0 rounded-full border-2 border-accent animate-ripple"
            style={{ animationDelay: "1.3s" }}
          />
          <div
            className="h-24 w-24 rounded-full bg-accent text-bg-primary flex items-center justify-center"
            style={{ boxShadow: "0 14px 28px -8px rgba(178,82,52,0.5)" }}
          >
            <Check size={44} strokeWidth={2.6} />
          </div>
        </div>

        <h1 className="text-h1 leading-tight mb-2.5 max-w-[280px]">
          Demande envoyée à <em className="not-italic text-accent">{rider.prenom}</em>
        </h1>
        <p className="text-bodyLg text-ink-soft mb-7 max-w-[280px]">
          Tu seras notifié quand il aura répondu. La plupart des motard(e)s répondent en moins de 2 h.
        </p>

        {/* Rider preview card */}
        <div className="w-full max-w-[320px] bg-white border border-line rounded-card-lg p-3.5 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rider.photo_url ?? ""}
            alt={rider.prenom}
            className="h-[52px] w-[52px] rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0 text-left">
            <p className="font-display font-bold text-[15px] flex items-center gap-1.5">
              {rider.prenom}, {age}
              {rider.permis_verifie ? (
                <span className="h-3.5 w-3.5 rounded-full bg-success inline-flex items-center justify-center">
                  <Check size={8} strokeWidth={3.5} className="text-white" />
                </span>
              ) : null}
            </p>
            <p className="text-[11.5px] text-ink-muted mt-0.5">
              {rider.ville} · {rider.permis_verifie ? "permis vérifié" : "permis en attente"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-[22px] pt-5 pb-7 space-y-2.5">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.replace("/explorer")}
        >
          Continuer à explorer
        </Button>
        <Button
          variant="glass"
          size="lg"
          fullWidth
          onClick={() => router.replace("/profile/riders?tab=envoyees")}
        >
          Voir mes demandes
        </Button>
      </div>
    </main>
  );
}
