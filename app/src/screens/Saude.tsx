import { healthUnits, municipalProgram, activeReferral } from "../lib/mockData";
import HealthUnitCard from "../components/shared/HealthUnitCard";

export default function Saude() {
  const verifiedUnit = healthUnits.find((u) => u.status === "verificado");

  return (
    <div>
      <h2 className="text-2xl">
        Minha saúde
        <small className="mt-0.5 block text-sm font-normal text-[#5a6660]">
          Sua unidade e seus encaminhamentos
        </small>
      </h2>

      {healthUnits.map((unit) => (
        <HealthUnitCard key={unit.id} unit={unit} />
      ))}

      <div className="mt-4 rounded-2xl border border-dashed border-ouro/50 bg-ouro/10 p-4">
        <strong className="mb-1 block text-sm text-[#9a6c1c]">Encaminhamento ativo</strong>
        <p className="mb-2.5 text-sm text-[#4a564f]">
          {activeReferral.tipo}. {activeReferral.texto}
        </p>
        <button type="button" className="rounded-xl bg-ouro px-4 py-2.5 text-sm font-bold text-[#3a2a0f]">
          Marcar horário
        </button>
      </div>

      {verifiedUnit && (
        <div className="mt-4 rounded-2xl border border-rio/15 bg-white p-[18px]">
          <span className="mb-2.5 inline-block rounded-full bg-acai/10 px-2.5 py-1 text-xs font-bold text-acai">
            Programa municipal
          </span>
          <h3 className="text-base">{municipalProgram.nome}</h3>
          <p className="mt-1.5 text-sm text-[#4a564f]">{municipalProgram.descricao}</p>
        </div>
      )}
    </div>
  );
}
