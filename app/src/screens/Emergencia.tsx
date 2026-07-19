import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";

export default function Emergencia() {
  const navigate = useNavigate();
  const { triggerEmergency, emergencyContacts } = useAppState();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const primeiroContato = emergencyContacts[0];

  async function handleConfirm() {
    setSending(true);
    setFailed(false);
    const ok = await triggerEmergency();
    setSending(false);
    if (ok) {
      setSent(true);
    } else {
      setFailed(true);
    }
  }

  return (
    <div>
      <h2 className="text-2xl text-urucum">
        Preciso de ajuda
        <small className="mt-0.5 block text-sm font-normal text-[#5a6660]">
          Isso vai avisar sua família agora
        </small>
      </h2>

      <div className="mt-4 rounded-2xl border border-urucum/40 bg-urucum/[0.08] p-4">
        <strong className="mb-1 block text-sm text-urucum">Botão de emergência</strong>
        <p className="mb-3 text-sm text-[#4a564f]">
          Ao confirmar, sua família recebe um alerta com sua localização e pode ligar direto para você.
        </p>
        {sent ? (
          <p className="text-center text-sm font-bold text-urucum">
            Família avisada. Alguém vai te ligar em instantes.
          </p>
        ) : failed ? (
          <div>
            <p className="mb-3 text-center text-sm font-bold text-urucum">
              Não consegui avisar sua família agora. Pode ser a internet.
            </p>
            {primeiroContato && (
              <a
                href={`tel:${primeiroContato.telefone}`}
                className="mb-2 block w-full rounded-xl bg-urucum py-3 text-center text-sm font-bold text-white"
              >
                Ligar para {primeiroContato.nome} agora
              </a>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={sending}
              className="w-full rounded-xl border-2 border-urucum bg-white py-3 text-center text-sm font-bold text-urucum disabled:opacity-70"
            >
              {sending ? "Tentando de novo..." : "Tentar avisar de novo"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={sending}
            className="w-full rounded-xl bg-urucum py-3 text-center text-sm font-bold text-white disabled:opacity-70"
          >
            {sending ? "Avisando..." : "Confirmar emergência"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/app/inicio")}
        className="mt-3 w-full rounded-2xl border-2 border-mata bg-white py-3.5 text-sm font-bold text-mata"
      >
        {sent ? "Voltar para o início" : "Cancelar, foi engano"}
      </button>
    </div>
  );
}
