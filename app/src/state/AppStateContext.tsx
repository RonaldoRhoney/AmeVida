import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface ElderProfile {
  nome: string;
  cidade: string;
  estado: string;
}

export interface Medication {
  id: string;
  nome: string;
  horario: string;
  instrucao: string;
  tomadoHoje: boolean;
}

export interface EmergencyContact {
  nome: string;
  telefone: string;
}

export interface TodayCheckin {
  confirmado: boolean;
  hora: string;
}

interface AppState {
  elder: ElderProfile | null;
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  onboardingComplete: boolean;
  easyMode: boolean;
  offlineMode: boolean;
  todayCheckin: TodayCheckin | null;
}

const defaultMedications: Omit<Medication, "id" | "tomadoHoje">[] = [
  { nome: "Losartana", horario: "08:00", instrucao: "em jejum" },
  { nome: "Metformina", horario: "13:00", instrucao: "após almoço" },
  { nome: "Sinvastatina", horario: "20:00", instrucao: "antes de dormir" },
];

const defaultContacts: EmergencyContact[] = [
  { nome: "Marta (filha)", telefone: "(91) 90000-0000" },
  { nome: "João (neto)", telefone: "(91) 90000-0001" },
];

const initialState: AppState = {
  elder: null,
  medications: [],
  emergencyContacts: [],
  onboardingComplete: false,
  easyMode: false,
  offlineMode: false,
  todayCheckin: null,
};

type Action =
  | { type: "SET_ELDER_PROFILE"; payload: ElderProfile }
  | { type: "ADD_MEDICATION"; payload: Omit<Medication, "id" | "tomadoHoje"> }
  | { type: "REMOVE_MEDICATION"; payload: { id: string } }
  | { type: "TOGGLE_DOSE_TAKEN"; payload: { id: string } }
  | { type: "SET_EMERGENCY_CONTACTS"; payload: EmergencyContact[] }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "TOGGLE_EASY_MODE" }
  | { type: "TOGGLE_OFFLINE_MODE" }
  | { type: "CONFIRM_CHECKIN" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_ELDER_PROFILE":
      return { ...state, elder: action.payload };
    case "ADD_MEDICATION":
      return {
        ...state,
        medications: [
          ...state.medications,
          { ...action.payload, id: crypto.randomUUID(), tomadoHoje: false },
        ],
      };
    case "REMOVE_MEDICATION":
      return {
        ...state,
        medications: state.medications.filter((m) => m.id !== action.payload.id),
      };
    case "TOGGLE_DOSE_TAKEN":
      return {
        ...state,
        medications: state.medications.map((m) =>
          m.id === action.payload.id ? { ...m, tomadoHoje: !m.tomadoHoje } : m,
        ),
      };
    case "SET_EMERGENCY_CONTACTS":
      return { ...state, emergencyContacts: action.payload };
    case "COMPLETE_ONBOARDING": {
      const medications =
        state.medications.length > 0
          ? state.medications
          : defaultMedications.map((m) => ({ ...m, id: crypto.randomUUID(), tomadoHoje: false }));
      const emergencyContacts =
        state.emergencyContacts.length > 0 ? state.emergencyContacts : defaultContacts;
      return { ...state, onboardingComplete: true, medications, emergencyContacts };
    }
    case "TOGGLE_EASY_MODE":
      return { ...state, easyMode: !state.easyMode };
    case "TOGGLE_OFFLINE_MODE":
      return { ...state, offlineMode: !state.offlineMode };
    case "CONFIRM_CHECKIN":
      return {
        ...state,
        todayCheckin: {
          confirmado: true,
          hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        },
      };
    default:
      return state;
  }
}

interface AppStateContextValue extends AppState {
  setElderProfile: (profile: ElderProfile) => void;
  addMedication: (medication: Omit<Medication, "id" | "tomadoHoje">) => void;
  removeMedication: (id: string) => void;
  toggleDoseTaken: (id: string) => void;
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  completeOnboarding: () => void;
  toggleEasyMode: () => void;
  toggleOfflineMode: () => void;
  confirmCheckin: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: AppStateContextValue = {
    ...state,
    setElderProfile: (profile) => dispatch({ type: "SET_ELDER_PROFILE", payload: profile }),
    addMedication: (medication) => dispatch({ type: "ADD_MEDICATION", payload: medication }),
    removeMedication: (id) => dispatch({ type: "REMOVE_MEDICATION", payload: { id } }),
    toggleDoseTaken: (id) => dispatch({ type: "TOGGLE_DOSE_TAKEN", payload: { id } }),
    setEmergencyContacts: (contacts) =>
      dispatch({ type: "SET_EMERGENCY_CONTACTS", payload: contacts }),
    completeOnboarding: () => dispatch({ type: "COMPLETE_ONBOARDING" }),
    toggleEasyMode: () => dispatch({ type: "TOGGLE_EASY_MODE" }),
    toggleOfflineMode: () => dispatch({ type: "TOGGLE_OFFLINE_MODE" }),
    confirmCheckin: () => dispatch({ type: "CONFIRM_CHECKIN" }),
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState deve ser usado dentro de AppStateProvider");
  return ctx;
}
