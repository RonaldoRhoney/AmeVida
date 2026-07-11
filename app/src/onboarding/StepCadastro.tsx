import { useState, type FormEvent } from "react";
import { useAppState } from "../state/AppStateContext";

interface MedicationDraft {
  key: string;
  nome: string;
  horario: string;
  instrucao: string;
}

interface Props {
  onNext: () => void;
}

export default function StepCadastro({ onNext }: Props) {
  const { setElderProfile, addMedication, setEmergencyContacts } = useAppState();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [medRows, setMedRows] = useState<MedicationDraft[]>([
    { key: crypto.randomUUID(), nome: "", horario: "08:00", instrucao: "" },
  ]);
  const [contatoNome, setContatoNome] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");

  function updateMedRow(key: string, field: keyof Omit<MedicationDraft, "key">, value: string) {
    setMedRows((rows) => rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  function addMedRow() {
    setMedRows((rows) => [
      ...rows,
      { key: crypto.randomUUID(), nome: "", horario: "08:00", instrucao: "" },
    ]);
  }

  function removeMedRow(key: string) {
    setMedRows((rows) => rows.filter((r) => r.key !== key));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setElderProfile({ nome: nome.trim() || "o idoso", cidade: cidade.trim(), estado: estado.trim() });

    medRows
      .filter((row) => row.nome.trim())
      .forEach((row) => addMedication({ nome: row.nome.trim(), horario: row.horario, instrucao: row.instrucao.trim() }));

    if (contatoNome.trim()) {
      setEmergencyContacts([{ nome: contatoNome.trim(), telefone: contatoTelefone.trim() }]);
    }

    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="obNome" className="text-sm font-bold text-rio">
          Nome do idoso
        </label>
        <input
          id="obNome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Antônio Ferreira"
          className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem] focus:outline-2 focus:outline-mata"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <input
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Cidade"
          className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem] focus:outline-2 focus:outline-mata"
        />
        <input
          type="text"
          value={estado}
          onChange={(e) => setEstado(e.target.value.toUpperCase())}
          placeholder="UF"
          maxLength={2}
          className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem] focus:outline-2 focus:outline-mata"
        />
      </div>

      <label className="mt-1 block text-sm font-bold text-rio">Remédios</label>
      <div className="flex flex-col gap-2.5">
        {medRows.map((row) => (
          <div key={row.key} className="flex flex-col gap-2 rounded-2xl border border-rio/15 bg-white p-3">
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                value={row.nome}
                onChange={(e) => updateMedRow(row.key, "nome", e.target.value)}
                placeholder="Nome do remédio"
                className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm"
              />
              <input
                type="time"
                value={row.horario}
                onChange={(e) => updateMedRow(row.key, "horario", e.target.value)}
                aria-label="Horário do remédio"
                className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm"
              />
            </div>
            <input
              type="text"
              value={row.instrucao}
              onChange={(e) => updateMedRow(row.key, "instrucao", e.target.value)}
              placeholder="Instrução (ex.: em jejum)"
              className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm"
            />
            {medRows.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedRow(row.key)}
                className="self-end text-xs font-bold text-urucum"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addMedRow}
        className="w-full rounded-2xl border-2 border-dashed border-rio/15 py-3 text-sm font-bold text-mata"
      >
        + Adicionar outro remédio
      </button>

      <label className="block text-sm font-bold text-rio">Contato de emergência</label>
      <div className="grid grid-cols-2 gap-2.5">
        <input
          type="text"
          value={contatoNome}
          onChange={(e) => setContatoNome(e.target.value)}
          placeholder="Nome (ex.: Marta)"
          className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem]"
        />
        <input
          type="tel"
          value={contatoTelefone}
          onChange={(e) => setContatoTelefone(e.target.value)}
          placeholder="Telefone"
          className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem]"
        />
      </div>

      <button
        type="submit"
        className="mt-1.5 w-full rounded-2xl bg-mata py-4 font-bold text-white transition-colors hover:bg-rio"
      >
        Continuar
      </button>
    </form>
  );
}
