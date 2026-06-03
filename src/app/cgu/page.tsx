"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CguPage() {
  const router = useRouter();

  return (
    <main className="min-h-[100dvh] pb-16">
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center gap-3 sticky top-0 bg-bg-primary border-b border-line z-10">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink shrink-0"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <h1 className="text-label">Conditions générales d'utilisation</h1>
      </div>

      <div className="px-6 pt-6 space-y-8 text-[14px] text-ink leading-relaxed">

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent font-bold mb-1">Dernière mise à jour</p>
          <p className="text-ink-muted">28 mai 2026</p>
        </div>

        <Section title="1. Présentation de l'application">
          <p>XXXX est une application mobile permettant XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
          <p className="mt-2">L'application est éditée par XXXX, XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="2. Acceptation des conditions">
          <p>En créant un compte sur Ridly, vous reconnaissez avoir lu, compris et accepté sans réserve les présentes conditions générales d'utilisation.</p>
          <p className="mt-2">XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="3. Conditions d'accès">
          <p>L'accès à Ridly est réservé aux personnes physiques âgées de <b>18 ans ou plus</b> et titulaires d'un permis de conduire en cours de validité.</p>
          <p className="mt-2">XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="4. Création de compte">
          <p>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
          <p className="mt-2">L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="5. Comportement des utilisateurs">
          <p>L'utilisateur s'engage à :</p>
          <ul className="mt-2 space-y-1.5 list-disc list-inside text-ink-muted">
            <li>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX</li>
            <li>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX</li>
            <li>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX</li>
            <li>Respecter le Code de la route lors de toutes les sorties organisées via l'application</li>
            <li>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX</li>
          </ul>
          <p className="mt-3">XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="6. Responsabilité">
          <p>Ridly est une plateforme de mise en relation entre motards. XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
          <p className="mt-2">XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="7. Données personnelles">
          <p>Ridly collecte uniquement les données nécessaires au fonctionnement de l'application : adresse e-mail, prénom, date de naissance, ville, photo de profil, informations sur la moto et préférences de sorties.</p>
          <p className="mt-2">Certaines données sont <b>visibles par les autres utilisateurs</b> (prénom, photo, ville, moto, niveau, types de sorties). D'autres sont <b>strictement privées</b> et ne sont jamais affichées sur votre profil public :</p>
          <ul className="mt-2 space-y-1.5 list-disc list-inside">
            <li>Adresse e-mail</li>
            <li>Date de naissance (seul l'âge calculé est affiché)</li>
            <li>Genre / identité de genre</li>
            <li>Mot de passe (chiffré, jamais stocké en clair)</li>
          </ul>
          <p className="mt-3">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à l'adresse indiquée en section 11.</p>
        </Section>

        <Section title="8. Propriété intellectuelle">
          <p>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="9. Suspension et résiliation">
          <p>XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="10. Droit applicable">
          <p>Les présentes conditions sont soumises au droit français. XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX.</p>
        </Section>

        <Section title="11. Contact">
          <p>Pour toute question relative aux présentes conditions :</p>
          <p className="mt-2 font-mono text-[12px] text-accent">XXXX@ridly.app</p>
          <p className="mt-1 text-ink-muted">XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX</p>
        </Section>

        <p className="text-center text-[11px] text-ink-muted pb-4 font-mono uppercase tracking-wider">
          Ridly · XXXX · Tous droits réservés
        </p>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display font-bold text-[15px] mb-2">{title}</h2>
      <div className="text-ink-muted">{children}</div>
    </div>
  );
}
