"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, MessageCircle, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { useActions, useMe, useMessages } from "@/lib/data/api";
import { useMock } from "@/lib/mock/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const me = useMe();
  const conv = useMock((s) => s.conversations.find((c) => c.id === id));
  const users = useMock((s) => s.users);
  const rides = useMock((s) => s.rides);
  const messages = useMessages(id);
  const { sendMessage } = useActions();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  if (!conv) return <main className="p-6">Conversation introuvable.</main>;

  const ride = conv.ride_id ? rides.find((r) => r.id === conv.ride_id) : null;
  const isGroup = conv.type === "ride";
  const otherUsers = conv.participant_ids
    .filter((p) => p !== me?.id)
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean) as typeof users;
  const title = isGroup ? ride?.titre ?? "Ride" : otherUsers[0]?.prenom;

  function send() {
    if (!text.trim() || !id) return;
    sendMessage(id, text.trim());
    setText("");
  }

  return (
    <main className="min-h-[100dvh] flex flex-col">
      <header className="safe-top px-4 pt-1 pb-2 flex items-center gap-3 border-b border-line bg-bg-primary sticky top-0 z-20">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        {isGroup ? (
          <AvatarStack
            users={otherUsers.map((u) => ({ name: u.prenom, src: u.photo_url }))}
            max={2}
          />
        ) : (
          <button onClick={() => router.push(`/explorer/${otherUsers[0]?.id}`)}>
            <Avatar src={otherUsers[0]?.photo_url} name={otherUsers[0]?.prenom} size="sm" online={otherUsers[0]?.is_online} />
          </button>
        )}
        <button
          className="flex-1 min-w-0 text-left"
          onClick={() => !isGroup && router.push(`/explorer/${otherUsers[0]?.id}`)}
        >
          <p className="text-label truncate">{title}</p>
          {isGroup && ride ? (
            <p className="text-caption text-ink-muted">
              ● Ride en cours · {conv.participant_ids.length} participants
            </p>
          ) : (
            <p className="text-caption text-ink-muted">Voir le profil →</p>
          )}
        </button>
      </header>

      {isGroup && ride ? (
        <div className="px-4 pt-3">
          <div className="rounded-card bg-ink text-bg-primary p-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bg-primary/60">
                Voir la map live
              </p>
              <p className="font-display font-bold text-[13px]">
                Position de chaque rider en temps réel
              </p>
            </div>
            <button className="bg-accent text-bg-primary rounded-chip px-3.5 h-9 font-display font-bold text-[12px]">
              Ouvrir
            </button>
          </div>
        </div>
      ) : null}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => {
          if (m.kind === "system") {
            return (
              <p
                key={m.id}
                className="text-center text-caption text-ink-muted my-2"
              >
                — {m.content} —
              </p>
            );
          }
          const author = users.find((u) => u.id === m.author_id);
          const mine = m.author_id === me?.id;
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine ? (
                <Avatar src={author?.photo_url} name={author?.prenom} size="xs" />
              ) : null}
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                  mine
                    ? "bg-ink text-bg-primary rounded-br-sm"
                    : "bg-white text-ink border border-line rounded-bl-sm"
                }`}
              >
                {!mine && isGroup ? (
                  <p className="font-display font-bold text-[10px] uppercase tracking-wider text-accent mb-0.5">
                    {author?.prenom}
                  </p>
                ) : null}
                <p className="text-body whitespace-pre-wrap leading-snug">
                  {m.content}
                </p>
                <p
                  className={`font-mono text-[9.5px] mt-1 ${
                    mine ? "text-bg-primary/60" : "text-ink-muted"
                  }`}
                >
                  {format(new Date(m.created_at), "HH:mm", { locale: fr })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="p-3 safe-bottom border-t border-line bg-bg-primary flex items-center gap-2 sticky bottom-0"
      >
        {isGroup ? (
          <button
            type="button"
            className="h-10 w-10 rounded-full bg-bg-secondary flex items-center justify-center"
            title="Partager ma position"
          >
            <Navigation size={18} strokeWidth={1.8} />
          </button>
        ) : null}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écris un message…"
          className="flex-1 h-11 rounded-chip border-[1.5px] border-line bg-white px-4 outline-none text-body placeholder:text-ink-muted focus:border-ink focus:shadow-[0_0_0_3px_rgba(42,38,36,0.06)] transition-shadow"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="h-11 w-11 rounded-full bg-accent text-bg-primary flex items-center justify-center disabled:opacity-40 shadow-accent"
        >
          <MessageCircle size={18} strokeWidth={1.8} />
        </button>
      </form>
    </main>
  );
}
