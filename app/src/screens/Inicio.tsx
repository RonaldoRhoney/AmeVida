import { Link } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";
import MicButton from "../components/shared/MicButton";

const CARDS = [
  {
    to: "/app/remedios",
    label: "Meus remédios",
    variant: "mata",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="9" width="18" height="9" rx="2" />
        <path d="M3 9V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
        <path d="M12 3v6" />
      </svg>
    ),
  },
  {
    to: "/app/saude",
    label: "Minhas consultas",
    variant: "ouro",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 21c0-4 4-6 9-6s9 2 9 6" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    ),
  },
  {
    to: "/app/familia",
    label: "Ligar para a família",
    variant: "acai",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7 8.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
      </svg>
    ),
  },
  {
    to: "/app/emergencia",
    label: "Preciso de ajuda",
    variant: "urgent",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
];

const CARD_STYLES: Record<string, string> = {
  mata: "bg-mata/[0.14] text-mata",
  ouro: "bg-ouro/[0.18] text-[#9a6c1c]",
  acai: "bg-acai/[0.14] text-acai",
  urgent: "bg-urucum text-white",
};

export default function Inicio() {
  const { elder, easyMode, offlineMode, toggleEasyMode, toggleOfflineMode } = useAppState();
  const nome = elder?.nome ?? "Seu Antônio";
  const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      <h2 className="text-2xl">
        Bom dia, {nome}
        <small className="mt-0.5 block text-sm font-normal text-[#5a6660]">{hoje}</small>
      </h2>

      <MicButton />

      <div className="mt-[18px] grid grid-cols-2 gap-3">
        {CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`flex flex-col gap-2.5 rounded-2xl p-3.5 ${
              card.variant === "urgent" ? "bg-urucum/[0.07] border border-urucum/35" : "border border-rio/15 bg-white"
            }`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${CARD_STYLES[card.variant]}`}>
              {card.icon}
            </span>
            <span className="text-sm font-bold leading-tight text-rio">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-rio/15 bg-white p-4">
        <h3 className="text-base">Configurações</h3>
        <label className="mt-3 flex items-center justify-between gap-4 py-2">
          <span>
            <strong className="block text-sm text-rio">Fonte grande e alto contraste</strong>
            <span className="text-xs text-[#5a6660]">Aumenta o texto e o contraste em todas as telas</span>
          </span>
          <input type="checkbox" checked={easyMode} onChange={toggleEasyMode} className="h-5 w-5 accent-mata" />
        </label>
        <label className="flex items-center justify-between gap-4 border-t border-rio/10 py-2 pt-3">
          <span>
            <strong className="block text-sm text-rio">Modo offline (simulado)</strong>
            <span className="text-xs text-[#5a6660]">Mostra o aviso de sincronização pendente</span>
          </span>
          <input type="checkbox" checked={offlineMode} onChange={toggleOfflineMode} className="h-5 w-5 accent-mata" />
        </label>
      </div>
    </div>
  );
}
