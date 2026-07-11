import { useAppState } from "../state/AppStateContext";

export default function Remedios() {
  const { medications, toggleDoseTaken, emergencyContacts } = useAppState();
  const caregiverName = emergencyContacts[0]?.nome.split(" ")[0] ?? "sua família";

  return (
    <div>
      <h2 className="text-2xl">
        Meus remédios
        <small className="mt-0.5 block text-sm font-normal text-[#5a6660]">
          Toque em "já tomei" para confirmar
        </small>
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {medications.map((med) => (
          <div key={med.id} className="flex items-center gap-3.5 rounded-2xl border border-rio/15 bg-white p-3.5">
            <div className="flex h-[54px] w-[54px] flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-paper-2 text-center text-[0.8rem] font-bold text-rio">
              {med.horario}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-base">{med.nome}</strong>
              <small className="text-[0.82rem] text-[#5a6660]">1 comprimido — {med.instrucao || "conforme indicado"}</small>
            </div>
            <button
              type="button"
              onClick={() => toggleDoseTaken(med.id)}
              className={`whitespace-nowrap rounded-2xl border-2 px-3.5 py-2.5 text-sm font-bold transition-colors ${
                med.tomadoHoje ? "border-mata bg-mata text-white" : "border-mata bg-white text-mata"
              }`}
            >
              {med.tomadoHoje ? "Tomado ✓" : "Já tomei"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-ouro/50 bg-ouro/10 p-4">
        <strong className="mb-1 block text-sm text-[#9a6c1c]">Aviso da família</strong>
        <p className="text-sm text-[#4a564f]">
          Sua família ({caregiverName}) será avisada quando você confirmar os remédios do dia.
        </p>
      </div>
    </div>
  );
}
