import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function StepConvite({ onNext, onBack }: Props) {
  const { elder } = useAppState();
  const [waSent, setWaSent] = useState(false);
  const nome = elder?.nome ?? "o idoso";

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-2 rounded-2xl border border-rio/15 bg-white p-6 text-center">
        <svg width={150} height={150} viewBox="0 0 150 150" fill="none" className="mx-auto">
          <rect width="150" height="150" rx="12" fill="#fff" stroke="rgba(22,59,51,.14)" />
          <rect x="12" y="12" width="34" height="34" fill="#163B33" />
          <rect x="20" y="20" width="18" height="18" fill="#fff" />
          <rect x="104" y="12" width="34" height="34" fill="#163B33" />
          <rect x="112" y="20" width="18" height="18" fill="#fff" />
          <rect x="12" y="104" width="34" height="34" fill="#163B33" />
          <rect x="20" y="112" width="18" height="18" fill="#fff" />
          <rect x="58" y="20" width="10" height="10" fill="#163B33" />
          <rect x="80" y="20" width="10" height="10" fill="#163B33" />
          <rect x="58" y="58" width="10" height="10" fill="#163B33" />
          <rect x="80" y="58" width="10" height="10" fill="#163B33" />
          <rect x="70" y="70" width="10" height="10" fill="#163B33" />
          <rect x="58" y="90" width="10" height="10" fill="#163B33" />
          <rect x="104" y="58" width="10" height="10" fill="#163B33" />
          <rect x="120" y="80" width="10" height="10" fill="#163B33" />
          <rect x="60" y="104" width="10" height="10" fill="#163B33" />
          <rect x="90" y="104" width="10" height="10" fill="#163B33" />
          <rect x="104" y="120" width="10" height="10" fill="#163B33" />
          <rect x="120" y="120" width="10" height="10" fill="#163B33" />
        </svg>
        <h3 className="mt-3 text-lg">Cartão de convite</h3>
        <p className="mt-1.5 text-sm text-[#4a564f]">
          Mostre o QR code ou envie o link para <strong>{nome}</strong> confirmar o cadastro.
        </p>
        <button
          type="button"
          onClick={() => setWaSent(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 font-bold text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.2.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.4 0 .6-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.4 1.3 1.2 2.5 1.6 2.8 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.8.8 2.1.9.3.2.5.2.6.3.1.2.1.9-.1 1.5Z" />
          </svg>
          Enviar link por WhatsApp
        </button>
        <div className="mt-2.5 min-h-[18px] text-sm font-bold text-mata">
          {waSent ? "Link enviado! (simulação — nenhuma mensagem real foi enviada)" : " "}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-2xl bg-mata py-4 font-bold text-white transition-colors hover:bg-rio"
      >
        Continuar
      </button>
      <button type="button" onClick={onBack} className="w-full py-2.5 text-sm font-bold text-[#5a6660]">
        Voltar
      </button>
    </div>
  );
}
