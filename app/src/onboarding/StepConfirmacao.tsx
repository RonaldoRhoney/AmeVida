import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

interface Props {
  onFinish: () => void;
}

export default function StepConfirmacao({ onFinish }: Props) {
  const { elder, completeOnboarding } = useAppState();
  const [confirmed, setConfirmed] = useState(false);
  const nome = elder?.nome ?? "tudo bem?";

  function handleConfirm() {
    setConfirmed(true);
    completeOnboarding();
    setTimeout(onFinish, 1400);
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-3.5 pt-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mata text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl">Prontinho!</h3>
        <p className="max-w-[26ch] text-sm text-[#4a564f]">Cadastro confirmado. Abrindo o AmaVida...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-9 text-center">
      <h3 className="max-w-[20ch] text-xl">Oi, {nome}!</h3>
      <p className="mt-2.5 max-w-[26ch] text-sm text-[#4a564f]">
        Alguém da sua família já preparou o AmaVida para você. Toque no botão abaixo para confirmar que é você.
      </p>
      <button
        type="button"
        onClick={handleConfirm}
        className="mt-9 w-full rounded-3xl bg-mata py-[26px] text-lg font-bold text-white shadow-[0_14px_30px_-10px_rgba(47,122,94,0.5)] active:bg-rio"
      >
        Sim, sou eu
      </button>
    </div>
  );
}
