"use client";
/**
 * Unified data layer.
 * Components call these functions; they switch transparently between
 * mock store (for first preview / offline demo) and Supabase (real backend).
 *
 * Add new queries here so the rest of the codebase stays backend-agnostic.
 */
import { IS_MOCK } from "@/lib/supabase/config";
import { useMock } from "@/lib/mock/store";
import type {
  Connection,
  Conversation,
  Message,
  Notification,
  Ride,
  RideReport,
  User,
} from "@/lib/types";
/* ------------- Types returned ------------- */

export type RiderListItem = User & {
  amisCommuns: number;
};

/* ------------- Hooks (mock-aware) ------------- */

export function useMe(): User | null {
  const meId = useMock((s) => s.meId);
  const users = useMock((s) => s.users);
  if (IS_MOCK) {
    if (!meId) return null;
    return users.find((u) => u.id === meId) ?? null;
  }
  // TODO: wire to Supabase auth context.
  return null;
}

export function useUser(id: string | undefined): User | undefined {
  const users = useMock((s) => s.users);
  return id ? users.find((u) => u.id === id) : undefined;
}

export function useNearbyRiders(): RiderListItem[] {
  const me = useMe();
  const users = useMock((s) => s.users);
  const connections = useMock((s) => s.connections);
  if (!me) return [];

  return users
    .filter((u) => u.id !== me.id)
    .map((u) => {
      const myFriends = connections
        .filter(
          (c) =>
            c.statut === "accepte" &&
            (c.demandeur_id === me.id || c.receveur_id === me.id)
        )
        .map((c) => (c.demandeur_id === me.id ? c.receveur_id : c.demandeur_id));

      const theirFriends = connections
        .filter(
          (c) =>
            c.statut === "accepte" &&
            (c.demandeur_id === u.id || c.receveur_id === u.id)
        )
        .map((c) => (c.demandeur_id === u.id ? c.receveur_id : c.demandeur_id));

      const amisCommuns = myFriends.filter((f) => theirFriends.includes(f))
        .length;

      return { ...u, amisCommuns };
    });
}

export function useSuggestions(): RiderListItem[] {
  const list = useNearbyRiders();
  return list.filter((u) => u.amisCommuns > 0).slice(0, 4);
}

export function useRides(): Ride[] {
  return useMock((s) => s.rides);
}

export function useRide(id: string | undefined): Ride | undefined {
  const rides = useMock((s) => s.rides);
  return id ? rides.find((r) => r.id === id) : undefined;
}

export function useMyRides() {
  const me = useMe();
  const rides = useRides();
  if (!me) return { aVenir: [], enAttente: [], passes: [] };

  const today = new Date().toISOString().slice(0, 10);

  const aVenir = rides.filter((r) => {
    if (r.date_ride < today) return false;
    if (r.createur_id === me.id) return true;
    return r.participants?.some(
      (p) => p.user_id === me.id && p.statut === "accepte"
    );
  });

  const enAttente = rides.filter((r) =>
    r.participants?.some(
      (p) => p.user_id === me.id && p.statut === "en_attente"
    )
  );

  const passes = rides.filter((r) => r.date_ride < today);

  return { aVenir, enAttente, passes };
}

export function useConversations(): Conversation[] {
  const me = useMe();
  const list = useMock((s) => s.conversations);
  const users = useMock((s) => s.users);
  if (!me) return [];

  return list
    .filter((c) => c.participant_ids.includes(me.id))
    .map((c) => ({
      ...c,
      participants: c.participant_ids
        .filter((id) => id !== me.id)
        .map((id) => {
          const u = users.find((x) => x.id === id);
          return u
            ? { id: u.id, prenom: u.prenom, photo_url: u.photo_url }
            : { id, prenom: "?", photo_url: null };
        }),
    }))
    .sort((a, b) => {
      const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
      const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
      return bt - at;
    });
}

export function useMessages(convId: string | undefined): Message[] {
  const all = useMock((s) => s.messages);
  return convId ? all[convId] ?? [] : [];
}

export function useConnectionsLists() {
  const me = useMe();
  const conns = useMock((s) => s.connections);
  const users = useMock((s) => s.users);
  if (!me)
    return {
      reseau: [] as User[],
      recues: [] as Connection[],
      envoyees: [] as Connection[],
    };

  const accepted = conns.filter(
    (c) =>
      c.statut === "accepte" &&
      (c.demandeur_id === me.id || c.receveur_id === me.id)
  );
  const reseau = accepted
    .map((c) =>
      users.find(
        (u) => u.id === (c.demandeur_id === me.id ? c.receveur_id : c.demandeur_id)
      )
    )
    .filter(Boolean) as User[];

  const recues = conns.filter(
    (c) => c.receveur_id === me.id && c.statut === "en_attente"
  );
  const envoyees = conns.filter(
    (c) => c.demandeur_id === me.id && c.statut === "en_attente"
  );

  return { reseau, recues, envoyees };
}

export function usePastRidesWithReports(): { ride: Ride; report: RideReport | undefined }[] {
  const me = useMe();
  const rides = useMock((s) => s.rides);
  const reports = useMock((s) => s.rideReports);
  const hiddenRideIds = useMock((s) => s.hiddenRideIds);
  if (!me) return [];
  const today = new Date().toISOString().slice(0, 10);

  return rides
    .filter((r) => r.date_ride < today)
    .filter((r) => !hiddenRideIds.includes(r.id))
    .filter(
      (r) =>
        r.createur_id === me.id ||
        r.participants?.some((p) => p.user_id === me.id)
    )
    .sort((a, b) => (a.date_ride < b.date_ride ? 1 : -1))
    .map((ride) => ({
      ride,
      report: reports.find((rr) => rr.ride_id === ride.id),
    }));
}

export function useLifetimeStats() {
  const past = usePastRidesWithReports();
  const me = useMe();
  if (!me) return { rides: 0, km: 0, riders: 0 };
  const rides = past.length;
  const km = past.reduce((acc, p) => acc + (p.report?.km ?? 0), 0);
  const ids = new Set<string>();
  past.forEach((p) =>
    p.ride.participants?.forEach((part) => {
      if (part.user_id !== me.id) ids.add(part.user_id);
    })
  );
  return { rides, km, riders: ids.size };
}

export function useNotifications(): Notification[] {
  const me = useMe();
  const list = useMock((s) => s.notifications);
  if (!me) return [];
  return list
    .filter((n) => n.user_id === me.id)
    .sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function useUnreadNotificationsCount(): number {
  return useNotifications().filter((n) => !n.read).length;
}

/* ------------- Actions (mock-aware wrappers) ------------- */

export function useActions() {
  const m = useMock();
  return {
    setMe: m.setMe,
    upsertUser: m.upsertUser,
    upsertRide: m.upsertRide,
    joinRide: m.joinRide,
    acceptParticipant: m.acceptParticipant,
    sendConnection: m.sendConnection,
    hideRideFromHistory: m.hideRideFromHistory,
    cancelConnection: m.cancelConnection,
    refuseConnection: m.refuseConnection,
    acceptConnection: m.acceptConnection,
    sendMessage: m.sendMessage,
    startDmWith: m.startDmWith,
    setOnboardingDraft: m.setOnboardingDraft,
    onboardingDraft: m.onboardingDraft,
  };
}
