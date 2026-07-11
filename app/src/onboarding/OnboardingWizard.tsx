import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCadastro from "./StepCadastro";
import StepConvite from "./StepConvite";
import StepConfirmacao from "./StepConfirmacao";

const STEP_TITLES = [
  { title: "Quem você está cadastrando", sub: "Passo 1 de 3 — preenchido pelo cuidador" },
  { title: "Convide a pessoa", sub: "Passo 2 de 3 — envie o link de confirmação" },
  { title: "Confirmação do idoso", sub: "Passo 3 de 3 — é isso que ele vê ao abrir o link" },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-5 py-8">
      <div className="mb-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-mata" : "bg-rio/10"}`}
          />
        ))}
      </div>

      <h1 className="text-2xl">{STEP_TITLES[step].title}</h1>
      <p className="mb-5 mt-1 text-sm text-[#5a6660]">{STEP_TITLES[step].sub}</p>

      {step === 0 && <StepCadastro onNext={() => setStep(1)} />}
      {step === 1 && <StepConvite onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <StepConfirmacao onFinish={() => navigate("/app/inicio")} />}
    </div>
  );
}
