"use client";
import { ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TopBar } from "@/components/ui/TopBar";

export default function VerifyPage() {
  return (
    <main className="min-h-[100dvh]">
      <TopBar title="Vérifier mon permis" />
      <div className="px-6">
        <Card className="p-6 text-center">
          <ShieldCheck size={48} className="mx-auto text-success" />
          <h2 className="text-h2 mt-3">Badge Permis vérifié</h2>
          <p className="text-caption text-ink-muted mt-2">
            Photo recto + verso de ton permis. Vérification manuelle sous 24h, données chiffrées et supprimées après validation.
          </p>
          <Button variant="primary" size="lg" fullWidth className="mt-5">
            <Upload size={18} /> Envoyer mon permis
          </Button>
          <p className="text-caption text-ink-muted mt-3">
            Optionnel — pas bloquant pour utiliser Ridly.
          </p>
        </Card>
      </div>
    </main>
  );
}
