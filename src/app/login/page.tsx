"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useActions } from "@/lib/data/api";
import { ME_ID } from "@/lib/mock/fixtures";

export default function LoginPage() {
  const router = useRouter();
  const { setMe } = useActions();
  const [email, setEmail] = useState("maxime@ridly.test");
  const [pw, setPw] = useState("demoridly");
  const [show, setShow] = useState(false);

  function login() {
    setMe(ME_ID);
    router.replace("/explorer");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col safe-bottom relative">
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center gap-3.5">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="px-6 pt-3.5 pb-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent font-bold mb-2">
          ★ Connexion
        </p>
        <h1 className="text-h1 leading-tight mb-1.5">Bon retour 👋</h1>
        <p className="text-bodyLg text-ink-soft">
          Connecte-toi pour retrouver tes rides.
        </p>
      </div>

      <div className="px-6 pt-5 pb-40 flex-1">
        <div className="mb-4">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} strokeWidth={1.8} />}
          />
        </div>
        <div>
          <Label>Mot de passe</Label>
          <Input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            icon={<Lock size={16} strokeWidth={1.8} />}
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
        </div>

        <p className="text-[12.5px] text-ink-muted mt-6 leading-snug">
          Mode démo : appuie sur{" "}
          <span className="font-semibold text-ink">Se connecter</span> pour
          entrer dans l&apos;app avec le compte d&apos;exemple{" "}
          <span className="font-semibold text-ink">Maxime</span>.
        </p>
      </div>

      <div className="absolute left-0 right-0 bottom-0 px-[22px] pt-5 pb-7 sticky-bottom-fade">
        <Button variant="primary" size="lg" fullWidth onClick={login}>
          Se connecter <ArrowRight size={16} strokeWidth={2.2} />
        </Button>
      </div>
    </main>
  );
}
