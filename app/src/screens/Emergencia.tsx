import { useNavigate } from "react-router-dom";

export default function Emergencia() {
  const navigate = useNavigate();

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
        <button
          type="button"
          className="w-full rounded-xl bg-urucum py-3 text-center text-sm font-bold text-white"
        >
          Confirmar emergência
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate("/app/inicio")}
        className="mt-3 w-full rounded-2xl border-2 border-mata bg-white py-3.5 text-sm font-bold text-mata"
      >
        Cancelar, foi engano
      </button>
    </div>
  );
}
