"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useActions } from "@/lib/data/api";

function passwordStrength(pw: string): "Faible" | "Moyen" | "Fort" {
  if (pw.length < 8) return "Faible";
  if (/[A-Z]/.test(pw) && /\d/.test(pw) && pw.length >= 10) return "Fort";
  return "Moyen";
}

export default function SignupPage() {
  const router = useRouter();
  const { setOnboardingDraft } = useActions();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [optin, setOptin] = useState(true);

  const valid = /\S+@\S+\.\S+/.test(email) && pw.length >= 8;
  const strength = passwordStrength(pw);
  const filledBars =
    pw.length === 0 ? 0 : strength === "Faible" ? 1 : strength === "Moyen" ? 2 : 3;

  function next() {
    setOnboardingDraft({ email, password: pw });
    router.push("/onboarding/photo");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      {/* Header */}
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center gap-3.5">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 pt-3.5 pb-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent font-bold mb-2">
          ★ Étape 1 — l&apos;essentiel
        </p>
        <h1 className="text-h1 leading-tight mb-1.5">Crée ton compte</h1>
        <p className="text-bodyLg text-ink-soft">On commence par l&apos;essentiel.</p>
      </div>

      {/* Form */}
      <div className="px-6 pt-5 pb-40 flex-1">
        <div className="mb-4">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} strokeWidth={1.8} />}
          />
        </div>

        <div className="mb-4">
          <Label>Mot de passe</Label>
          <Input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            forceFocused={pw.length > 0}
            icon={
              <Lock
                size={16}
                strokeWidth={1.8}
                className={pw.length > 0 ? "text-accent" : ""}
              />
            }
            trailing={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="text-ink-muted p-1"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 flex gap-1">
              {[0, 1, 2].map((i) => {
                const on = i < filledBars;
                const colour =
                  filledBars === 1
                    ? "bg-warning"
                    : filledBars === 2
                    ? "bg-warning"
                    : "bg-success";
                return (
                  <span
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      on ? colour : "bg-bg-tertiary"
                    }`}
                  />
                );
              })}
            </div>
            {pw.length > 0 ? (
              <span
                className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                  strength === "Fort"
                    ? "text-success"
                    : strength === "Moyen"
                    ? "text-warning"
                    : "text-accent-dark"
                }`}
              >
                {strength}
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOptin(!optin)}
          className="mt-5 flex items-start gap-2.5 text-left"
        >
          <span
            className={`mt-[1px] h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${
              optin ? "bg-ink" : "border-[1.5px] border-line bg-white"
            }`}
          >
            {optin ? <Check size={11} strokeWidth={3.5} className="text-bg-primary" /> : null}
          </span>
          <span className="text-[13px] leading-snug text-ink-soft">
            Je veux recevoir les nouveautés <b className="text-ink font-semibold">Ridly</b>{" "}
            (max 1 par mois, jamais de spam).
          </span>
        </button>

        <div className="text-center mt-6">
          <button className="text-[13px] font-semibold text-ink-muted underline">
            Mot de passe oublié ?
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!valid}
          onClick={next}
        >
          Continuer <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
