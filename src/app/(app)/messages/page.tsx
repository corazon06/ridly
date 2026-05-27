"use client";
import Link from "next/link";
import { MessageCircle, Search, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { useActions, useConnectionsLists, useConversations, useMe } from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MessagesPage() {
  const me = useMe();
  const router = useRouter();
  const conversations = useConversations();
  const rides = useMock((s) => s.rides);
  const { reseau } = useConnectionsLists();
  const { startDmWith } = useActions();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Riders connectés sans aucun message échangé
  const newConnections = reseau.filter((u) => {
    const conv = conversations.find(
      (c) => c.type === "dm" && c.participant_ids.includes(u.id)
    );
    return !conv || !conv.preview;
  });

  function goToDm(userId: string) {
    const cid = startDmWith(userId);
    router.push(`/messages/${cid}`);
  }

  const filtered = conversations.filter((c) => {
    // DMs sans aucun message sont déjà affichés dans "newConnections" — pas de doublon
    if (!query.trim() && c.type === "dm" && !c.preview) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const ride = c.ride_id ? rides.find((r) => r.id === c.ride_id) : null;
    const title = c.type === "ride"
      ? ride?.titre ?? "Ride"
      : c.participants?.[0]?.prenom ?? "";
    return title.toLowerCase().includes(q) || (c.preview ?? "").toLowerCase().includes(q);
  });

  return (
    <main className="min-h-[100dvh]">
      <div className="safe-top px-[22px] pt-1 pb-2 flex items-center justify-between">
        <h1 className="text-h1">Messages</h1>
        <button
          onClick={() => { setSearchOpen((v) => !v); setQuery(""); }}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          {searchOpen ? <X size={16} strokeWidth={2} /> : <Search size={16} strokeWidth={1.8} />}
        </button>
      </div>

      {/* Barre de recherche */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: searchOpen ? 64 : 0, opacity: searchOpen ? 1 : 0 }}
      >
        <div className="px-[22px] pb-3">
          <div className="flex items-center gap-2 bg-white border border-line rounded-card px-3 h-10">
            <Search size={14} className="text-ink-muted shrink-0" />
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une conversation…"
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-muted"
            />
            {query ? (
              <button onClick={() => setQuery("")}>
                <X size={13} className="text-ink-muted" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-2">
        {filtered.length === 0 && conversations.length === 0 && newConnections.length === 0 ? (
          <p className="px-6 py-12 text-center text-caption text-ink-muted">
            Aucune conversation pour l&apos;instant. Demande contact à un motard
            depuis Explorer pour commencer.
          </p>
        ) : filtered.length === 0 && newConnections.length === 0 ? (
          <p className="px-6 py-12 text-center text-caption text-ink-muted">
            Aucune conversation ne correspond à « {query} ».
          </p>
        ) : null}
        <ul className="divide-y divide-line">
          {/* Nouvelles connexions sans message */}
          {!query && newConnections.map((u) => (
            <li key={`new-${u.id}`}>
              <button
                onClick={() => goToDm(u.id)}
                className="w-full flex items-center gap-3 px-6 py-3 active:bg-bg-secondary text-left"
              >
                <Avatar src={u.photo_url} name={u.prenom} size="md" online={u.is_online} />
                <div className="flex-1 min-w-0">
                  <p className="text-label truncate">{u.prenom}</p>
                  <p className="text-[13px] text-accent font-bold truncate mt-0.5">
                    Envoyer un message
                  </p>
                </div>
                <MessageCircle size={18} className="text-accent shrink-0" strokeWidth={1.8} />
              </button>
            </li>
          ))}
          {filtered.map((c) => {
            const ride = c.ride_id ? rides.find((r) => r.id === c.ride_id) : null;
            const isGroup = c.type === "ride";
            const title = isGroup
              ? ride?.titre ?? "Ride"
              : c.participants?.[0]?.prenom ?? "DM";
            return (
              <li key={c.id}>
                <Link
                  href={`/messages/${c.id}`}
                  className="flex items-center gap-3 px-6 py-3 active:bg-bg-secondary"
                >
                  {isGroup ? (
                    <AvatarStack
                      users={(c.participants ?? []).map((p) => ({
                        name: p.prenom,
                        src: p.photo_url,
                      }))}
                      max={2}
                    />
                  ) : (
                    <Avatar
                      src={c.participants?.[0]?.photo_url}
                      name={c.participants?.[0]?.prenom}
                      size="md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-label truncate">
                        {title}
                        {isGroup ? (
                          <span className="ml-1.5 text-caption text-ink-muted">
                            · {c.participant_ids.length}
                          </span>
                        ) : null}
                      </p>
                      {c.last_message_at ? (
                        <span className="text-caption text-ink-muted shrink-0">
                          {format(new Date(c.last_message_at), "HH:mm", { locale: fr })}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-caption text-ink-muted truncate">
                      {c.preview ?? (c.type === "dm" ? "Commence la conversation…" : "Aucun message")}
                    </p>
                  </div>
                  {c.unread_count ? (
                    <span className="bg-accent text-bg-primary font-display font-bold text-[10px] h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center">
                      {c.unread_count}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
