import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCadastro from "./StepCadastro";
import StepConvite from "./StepConvite";

const STEP_TITLES = [
  { title: "Quem você está cadastrando", sub: "Passo 1 de 2 — preenchido pelo cuidador" },
  { title: "Convide a pessoa", sub: "Passo 2 de 2 — envie o link de confirmação" },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState<0 | 1>(0);
  const [invite, setInvite] = useState<{ token: string; nome: string } | null>(null);
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-5 py-8">
      <div className="mb-4 flex gap-1.5">
        {[0, 1].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-mata" : "bg-rio/10"}`} />
        ))}
      </div>

      <h1 className="text-2xl">{STEP_TITLES[step].title}</h1>
      <p className="mb-5 mt-1 text-sm text-[#5a6660]">{STEP_TITLES[step].sub}</p>

      {step === 0 && (
        <StepCadastro
          onNext={(token, nome) => {
            setInvite({ token, nome });
            setStep(1);
          }}
        />
      )}
      {step === 1 && invite && (
        <StepConvite token={invite.token} elderNome={invite.nome} onFinish={() => navigate("/cuidador")} />
      )}
    </div>
  );
}
