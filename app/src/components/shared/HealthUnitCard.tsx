import type { HealthUnit } from "../../lib/mockData";

export default function HealthUnitCard({ unit }: { unit: HealthUnit }) {
  const isVerified = unit.status === "verificado";

  return (
    <div className="mt-4 rounded-2xl border border-rio/15 bg-white p-[18px]">
      <span
        className={`mb-2.5 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
          isVerified ? "bg-mata/10 text-mata" : "bg-ouro/15 text-[#9a6c1c]"
        }`}
      >
        {unit.maisProxima ? "Mais próxima · verificada" : isVerified ? "Verificada" : "Perto de você · pendente de verificação"}
      </span>
      <h3 className="text-base">{unit.nome}</h3>
      <p className="mb-3 mt-1.5 text-sm text-[#4a564f]">{unit.endereco}</p>

      {isVerified && unit.familiasAdesao !== undefined && (
        <p className="mb-3 inline-block rounded-xl bg-mata/10 px-3 py-2 text-[0.82rem] font-bold text-mata">
          👥 {unit.familiasAdesao} famílias já usam o AmaVida com esta unidade
        </p>
      )}

      <button
        type="button"
        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
          isVerified ? "bg-rio text-white" : "bg-paper-2 text-rio"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2 4 6v6c0 5 3.5 8.6 8 10 4.5-1.4 8-5 8-10V6Z" />
        </svg>
        Ver como chegar
      </button>
    </div>
  );
}
