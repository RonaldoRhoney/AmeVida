import { Link } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";
import { useAuth } from "../state/AuthContext";
import MicButton from "../components/shared/MicButton";

const CARDS = [
  {
    to: "/app/remedios",
    label: "Remédios",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="9" width="18" height="9" rx="2" />
        <path d="M3 9V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
        <path d="M12 3v6" />
      </svg>
    ),
  },
  {
    to: "/app/saude",
    label: "Saúde",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 21c0-4 4-6 9-6s9 2 9 6" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    ),
  },
  {
    to: "/app/familia",
    label: "Família",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/app/saude",
    label: "Consultas",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-8 w-14 flex-shrink-0 rounded-full transition-colors ${checked ? "bg-mata" : "bg-rio/15"}`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Inicio() {
  const { easyMode, offlineMode, toggleEasyMode, toggleOfflineMode } = useAppState();
  const { profile } = useAuth();
  const nome = profile?.nome ?? "Seu Antônio";
  const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-sm text-[#5a6660]">Bom dia,</span>
          <h2 className="text-2xl">{nome}</h2>
        </div>
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-mata/15 font-serif text-base font-bold text-mata">
          {iniciais || "?"}
        </div>
      </div>
      <p className="mt-0.5 text-sm capitalize text-[#5a6660]">{hoje}</p>

      <Link
        to="/app/emergencia"
        className="mt-5 flex items-center justify-center gap-2.5 rounded-2xl bg-urucum py-4 text-lg font-bold text-white shadow-[0_14px_28px_-14px_rgba(193,68,46,0.6)] active:bg-[#a83a26]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        Emergência
      </Link>

      <MicButton />

      <div className="mt-[18px] grid grid-cols-2 gap-3">
        {CARDS.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-rio/10 bg-white py-5 text-center transition-colors hover:bg-paper-2"
          >
            <span className="text-mata">{card.icon}</span>
            <span className="text-sm font-bold text-rio">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-rio/10 bg-white p-4">
        <div className="flex items-center justify-between gap-4 py-2">
          <span>
            <strong className="block text-sm text-rio">Modo Fácil</strong>
            <span className="text-xs text-[#5a6660]">Fonte grande e alto contraste</span>
          </span>
          <ToggleSwitch checked={easyMode} onChange={toggleEasyMode} />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-rio/10 py-2 pt-3">
          <span>
            <strong className="block text-sm text-rio">Modo offline</strong>
            <span className="text-xs text-[#5a6660]">Simula sincronização pendente</span>
          </span>
          <ToggleSwitch checked={offlineMode} onChange={toggleOfflineMode} />
        </div>
      </div>

      <Link to="/como-funciona" className="mt-4 block text-center text-sm font-bold text-[#5a6660]">
        Como funciona o AmaVida?
      </Link>

      <p className="mt-6 pb-2 text-center text-xs text-[#5a6660]">© AmaVida — RhoneyInc</p>
    </div>
  );
}
