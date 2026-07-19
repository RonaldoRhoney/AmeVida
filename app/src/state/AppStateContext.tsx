import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

export interface Medication {
  id: string;
  nome: string;
  horario: string;
  instrucao: string;
  tomadoHoje: boolean;
}

export interface EmergencyContact {
  id: string;
  nome: string;
  telefone: string;
}

export interface TodayCheckin {
  confirmado: boolean;
  hora: string;
}

interface AppStateContextValue {
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  todayCheckin: TodayCheckin | null;
  loading: boolean;
  easyMode: boolean;
  offlineMode: boolean;
  toggleDoseTaken: (id: string) => void;
  confirmCheckin: () => void;
  triggerEmergency: () => Promise<boolean>;
  toggleEasyMode: () => void;
  toggleOfflineMode: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const elderId = session?.user.id;
  const queryClient = useQueryClient();

  const [easyMode, setEasyMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const { data: medicationRows, isLoading: loadingMeds } = useQuery({
    queryKey: ["medication_reminders", elderId],
    enabled: !!elderId,
    queryFn: async () => {
      const [{ data: reminders }, { data: confirmations }] = await Promise.all([
        supabase
          .from("medication_reminders")
          .select("id, nome_remedio, horario, instrucao")
          .eq("elder_id", elderId)
          .order("horario"),
        supabase
          .from("medication_confirmations")
          .select("reminder_id, confirmado_em")
          .gte("confirmado_em", new Date().toISOString().slice(0, 10)),
      ]);
      const confirmedIds = new Set((confirmations ?? []).map((c) => c.reminder_id));
      return (reminders ?? []).map(
        (r): Medication => ({
          id: r.id,
          nome: r.nome_remedio,
          horario: r.horario.slice(0, 5),
          instrucao: r.instrucao ?? "",
          tomadoHoje: confirmedIds.has(r.id),
        }),
      );
    },
  });

  const { data: contactRows } = useQuery({
    queryKey: ["emergency_contacts", elderId],
    enabled: !!elderId,
    queryFn: async () => {
      const { data } = await supabase
        .from("emergency_contacts")
        .select("id, nome, telefone")
        .eq("elder_id", elderId);
      return (data ?? []) as EmergencyContact[];
    },
  });

  const { data: checkinRow } = useQuery({
    queryKey: ["checkins", elderId],
    enabled: !!elderId,
    queryFn: async () => {
      const { data } = await supabase
        .from("checkins")
        .select("created_at")
        .eq("elder_id", elderId)
        .eq("data", new Date().toISOString().slice(0, 10))
        .maybeSingle();
      if (!data) return null;
      const hora = new Date(data.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      return { confirmado: true, hora } as TodayCheckin;
    },
  });

  async function toggleDoseTaken(id: string) {
    const med = medicationRows?.find((m) => m.id === id);
    if (!med) return;

    if (med.tomadoHoje) {
      await supabase
        .from("medication_confirmations")
        .delete()
        .eq("reminder_id", id)
        .gte("confirmado_em", new Date().toISOString().slice(0, 10));
    } else {
      await supabase.from("medication_confirmations").insert({ reminder_id: id });
    }
    queryClient.invalidateQueries({ queryKey: ["medication_reminders", elderId] });
  }

  async function confirmCheckin() {
    if (!elderId) return;
    await supabase.from("checkins").insert({ elder_id: elderId, status: "estou bem" });
    queryClient.invalidateQueries({ queryKey: ["checkins", elderId] });
  }

  async function triggerEmergency() {
    if (!elderId) return false;
    const { error } = await supabase
      .from("emergency_events")
      .insert({ elder_id: elderId, confirmado: true });
    return !error;
  }

  const value: AppStateContextValue = {
    medications: medicationRows ?? [],
    emergencyContacts: contactRows ?? [],
    todayCheckin: checkinRow ?? null,
    loading: loadingMeds,
    easyMode,
    offlineMode,
    toggleDoseTaken,
    confirmCheckin,
    triggerEmergency,
    toggleEasyMode: () => setEasyMode((v) => !v),
    toggleOfflineMode: () => setOfflineMode((v) => !v),
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState deve ser usado dentro de AppStateProvider");
  return ctx;
}
