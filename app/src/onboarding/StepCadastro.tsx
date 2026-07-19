import { useState, type FormEvent } from "react";
import { useAuth } from "../state/AuthContext";
import { supabase } from "../lib/supabaseClient";

interface MedicationDraft {
  key: string;
  nome: string;
  horario: string;
  instrucao: string;
}

interface Props {
  onNext: (token: string, elderNome: string) => void;
}

export default function StepCadastro({ onNext }: Props) {
  const { session } = useAuth();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [medRows, setMedRows] = useState<MedicationDraft[]>([
    { key: crypto.randomUUID(), nome: "", horario: "08:00", instrucao: "" },
  ]);
  const [contatoNome, setContatoNome] = useState("");
  const [contatoTelefone, setContatoTelefone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    setError(null);

    const elderNome = nome.trim() || "o idoso";
    const medications = medRows
      .filter((row) => row.nome.trim())
      .map((row) => ({ nome: row.nome.trim(), horario: row.horario, instrucao: row.instrucao.trim() }));
    const emergencyContacts = contatoNome.trim()
      ? [{ nome: contatoNome.trim(), telefone: contatoTelefone.trim(), relacao: null }]
      : [];

    const { data, error: insertError } = await supabase
      .from("pending_invites")
      .insert({
        caregiver_id: session.user.id,
        elder_nome: elderNome,
        elder_cidade: cidade.trim() || null,
        elder_estado: estado.trim() || null,
        medications,
        emergency_contacts: emergencyContacts,
      })
      .select("token")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Não foi possível salvar o cadastro. Tente de novo.");
      return;
    }

    onNext(data.token, elderNome);
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

      {error && <p className="text-sm font-bold text-urucum">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1.5 w-full rounded-2xl bg-mata py-4 font-bold text-white transition-colors hover:bg-rio disabled:opacity-60"
      >
        {submitting ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
