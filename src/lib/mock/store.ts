"use client";
/**
 * Mock client-side store. Persists to localStorage so the demo
 * survives page reloads. Used when IS_MOCK is true.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Connection,
  Conversation,
  Message,
  Notification,
  Ride,
  RideParticipant,
  RideReport,
  User,
} from "@/lib/types";
import {
  ME_ID,
  mockConnections,
  mockConversations,
  mockMessages,
  mockNotifications,
  mockRideReports,
  mockRides,
  mockUsers,
} from "./fixtures";

export interface MockState {
  meId: string | null;
  users: User[];
  rides: Ride[];
  connections: Connection[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  rideReports: RideReport[];
  notifications: Notification[];
  onboardingDraft: Partial<User> & { password?: string };

  setMe: (id: string | null) => void;
  upsertUser: (u: User) => void;
  upsertRide: (r: Ride) => void;
  joinRide: (rideId: string, userId: string) => void;
  acceptParticipant: (rideId: string, userId: string) => void;
  sendConnection: (toId: string) => void;
  acceptConnection: (id: string) => void;
  sendMessage: (convId: string, content: string) => void;
  startDmWith: (userId: string) => string; // returns conv id
  setOnboardingDraft: (patch: Partial<User> & { password?: string }) => void;
  resetMock: () => void;
}

const initial = {
  meId: null as string | null,
  users: mockUsers,
  rides: mockRides,
  connections: mockConnections,
  conversations: mockConversations,
  messages: mockMessages,
  rideReports: mockRideReports,
  notifications: mockNotifications,
  onboardingDraft: {},
};

export const useMock = create<MockState>()(
  persist(
    (set, get) => ({
      ...initial,

      setMe: (id) => set({ meId: id }),

      upsertUser: (u) =>
        set((s) => ({
          users: s.users.some((x) => x.id === u.id)
            ? s.users.map((x) => (x.id === u.id ? u : x))
            : [...s.users, u],
        })),

      upsertRide: (r) =>
        set((s) => ({
          rides: s.rides.some((x) => x.id === r.id)
            ? s.rides.map((x) => (x.id === r.id ? r : x))
            : [r, ...s.rides],
        })),

      joinRide: (rideId, userId) =>
        set((s) => ({
          rides: s.rides.map((r) => {
            if (r.id !== rideId) return r;
            const existing = r.participants?.find((p) => p.user_id === userId);
            if (existing) return r;
            const newP: RideParticipant = {
              id: `p_${Math.random().toString(36).slice(2, 8)}`,
              ride_id: rideId,
              user_id: userId,
              statut: r.validation_manuelle ? "en_attente" : "accepte",
              note_donnee: null,
            };
            return { ...r, participants: [...(r.participants ?? []), newP] };
          }),
        })),

      acceptParticipant: (rideId, userId) =>
        set((s) => ({
          rides: s.rides.map((r) =>
            r.id === rideId
              ? {
                  ...r,
                  participants: (r.participants ?? []).map((p) =>
                    p.user_id === userId ? { ...p, statut: "accepte" } : p
                  ),
                }
              : r
          ),
        })),

      sendConnection: (toId) =>
        set((s) => {
          const meId = s.meId ?? ME_ID;
          if (
            s.connections.find(
              (c) =>
                (c.demandeur_id === meId && c.receveur_id === toId) ||
                (c.demandeur_id === toId && c.receveur_id === meId)
            )
          )
            return s;
          return {
            connections: [
              ...s.connections,
              {
                id: `c_${Math.random().toString(36).slice(2, 8)}`,
                demandeur_id: meId,
                receveur_id: toId,
                statut: "en_attente",
                created_at: new Date().toISOString(),
              },
            ],
          };
        }),

      acceptConnection: (id) =>
        set((s) => ({
          connections: s.connections.map((c) =>
            c.id === id ? { ...c, statut: "accepte" } : c
          ),
        })),

      sendMessage: (convId, content) =>
        set((s) => {
          const meId = s.meId ?? ME_ID;
          const newMsg: Message = {
            id: `m_${Math.random().toString(36).slice(2, 8)}`,
            conversation_id: convId,
            author_id: meId,
            content,
            created_at: new Date().toISOString(),
          };
          return {
            messages: {
              ...s.messages,
              [convId]: [...(s.messages[convId] ?? []), newMsg],
            },
            conversations: s.conversations.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    last_message_at: newMsg.created_at,
                    preview: content,
                    unread_count: 0,
                  }
                : c
            ),
          };
        }),

      startDmWith: (userId) => {
        const s = get();
        const meId = s.meId ?? ME_ID;
        const existing = s.conversations.find(
          (c) =>
            c.type === "dm" &&
            c.participant_ids.includes(meId) &&
            c.participant_ids.includes(userId)
        );
        if (existing) return existing.id;
        const id = `cv_dm_${userId}`;
        set({
          conversations: [
            ...s.conversations,
            {
              id,
              type: "dm",
              ride_id: null,
              participant_ids: [meId, userId],
              last_message_at: null,
            },
          ],
        });
        return id;
      },

      setOnboardingDraft: (patch) =>
        set((s) => ({ onboardingDraft: { ...s.onboardingDraft, ...patch } })),

      resetMock: () => set(initial),
    }),
    { name: "ridly-mock-v2" }
  )
);
