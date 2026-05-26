"use client";
import Link from "next/link";
import { Bell, Check, MessageCircle, Star, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar } from "@/components/ui/Avatar";
import { TopBar } from "@/components/ui/TopBar";
import { useNotifications } from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import type { Notification, NotificationKind } from "@/lib/types";

export default function NotificationsPage() {
  const list = useNotifications();
  const users = useMock((s) => s.users);
  const rides = useMock((s) => s.rides);

  return (
    <main className="min-h-[100dvh]">
      <TopBar title="Notifications" />

      <div className="px-[22px] pt-2 pb-32">
        {list.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={28} className="mx-auto text-ink-muted mb-3" strokeWidth={1.7} />
            <p className="text-[13px] text-ink-muted">
              Tu es à jour. Reviens plus tard.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((n) => {
              const u = n.related_user_id
                ? users.find((x) => x.id === n.related_user_id)
                : undefined;
              const r = n.related_ride_id
                ? rides.find((x) => x.id === n.related_ride_id)
                : undefined;
              return (
                <li key={n.id}>
                  <NotificationRow
                    n={n}
                    userName={u?.prenom}
                    userPhoto={u?.photo_url}
                    rideTitle={r?.titre ?? null}
                    href={
                      n.kind.startsWith("connection")
                        ? "/profile/riders?tab=recues"
                        : r
                        ? `/rides/${r.id}`
                        : "/explorer"
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

function NotificationRow({
  n,
  userName,
  userPhoto,
  rideTitle,
  href,
}: {
  n: Notification;
  userName?: string;
  userPhoto?: string | null;
  rideTitle?: string | null;
  href: string;
}) {
  const { icon, message } = describe(n.kind, userName, rideTitle);
  return (
    <Link
      href={href}
      className={`block bg-white border rounded-card p-3 flex items-center gap-3 ${
        n.read ? "border-line" : "border-accent/30 bg-accent-soft/30"
      }`}
    >
      {userPhoto ? (
        <Avatar src={userPhoto} name={userName} size="md" />
      ) : (
        <span className="h-12 w-12 rounded-full bg-bg-secondary flex items-center justify-center text-ink shrink-0">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug text-ink">{message}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mt-0.5">
          {format(new Date(n.created_at), "d MMM · HH:mm", { locale: fr })}
        </p>
      </div>
      {!n.read ? (
        <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
      ) : null}
    </Link>
  );
}

function describe(
  kind: NotificationKind,
  userName?: string,
  rideTitle?: string | null
): { icon: React.ReactNode; message: React.ReactNode } {
  const u = userName ?? "Quelqu'un";
  const r = rideTitle ? <b className="font-bold">{rideTitle}</b> : "ton ride";
  switch (kind) {
    case "join_request":
      return {
        icon: <UserPlus size={20} strokeWidth={1.8} />,
        message: (
          <>
            <b className="font-bold">{u}</b> souhaite rejoindre {r}.
          </>
        ),
      };
    case "join_accepted":
      return {
        icon: <Check size={20} strokeWidth={2} />,
        message: (
          <>
            <b className="font-bold">{u}</b> a accepté ta demande pour {r}.
          </>
        ),
      };
    case "ride_reminder":
      return {
        icon: <Star size={20} strokeWidth={1.8} />,
        message: <>Rappel : {r} commence aujourd&apos;hui.</>,
      };
    case "new_message":
      return {
        icon: <MessageCircle size={20} strokeWidth={1.8} />,
        message: (
          <>
            <b className="font-bold">{u}</b> t&apos;a envoyé un message.
          </>
        ),
      };
    case "connection_request":
      return {
        icon: <UserPlus size={20} strokeWidth={1.8} />,
        message: (
          <>
            <b className="font-bold">{u}</b> souhaite te connecter sur Ridly.
          </>
        ),
      };
    case "connection_accepted":
      return {
        icon: <Check size={20} strokeWidth={2} />,
        message: (
          <>
            <b className="font-bold">{u}</b> a accepté ta demande de connexion.
          </>
        ),
      };
  }
}
