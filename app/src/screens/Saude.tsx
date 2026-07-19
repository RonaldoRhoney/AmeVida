import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../state/AuthContext";
import HealthUnitCard from "../components/shared/HealthUnitCard";
import type { HealthUnit } from "../lib/mockData";

export default function Saude() {
  const { session } = useAuth();
  const elderId = session?.user.id;

  const { data: units } = useQuery({
    queryKey: ["health_units"],
    queryFn: async () => {
      const { data } = await supabase
        .from("health_units")
        .select("id, nome, endereco, status, contagem_familias")
        .order("contagem_familias", { ascending: false });
      return (data ?? []).map(
        (u, i): HealthUnit => ({
          id: u.id,
          nome: u.nome,
          endereco: u.endereco ?? "",
          status: u.status,
          familiasAdesao: u.contagem_familias,
          maisProxima: i === 0,
        }),
      );
    },
  });

  const { data: programs } = useQuery({
    queryKey: ["municipal_programs"],
    queryFn: async () => {
      const { data } = await supabase.from("municipal_programs").select("id, nome, descricao");
      return data ?? [];
    },
  });

  const { data: referral } = useQuery({
    queryKey: ["appointments", elderId],
    enabled: !!elderId,
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("id, tipo, status")
        .eq("elder_id", elderId)
        .eq("status", "encaminhado")
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl">
        Minha saúde
        <small className="mt-0.5 block text-sm font-normal text-[#5a6660]">
          Sua unidade e seus encaminhamentos
        </small>
      </h2>

      {(units ?? []).map((unit) => (
        <HealthUnitCard key={unit.id} unit={unit} />
      ))}

      {units && units.length === 0 && (
        <p className="mt-4 text-sm text-[#5a6660]">
          Ainda não há unidades de saúde verificadas para sua região.
        </p>
      )}

      {referral && (
        <div className="mt-4 rounded-2xl border border-dashed border-ouro/50 bg-ouro/10 p-4">
          <strong className="mb-1 block text-sm text-[#9a6c1c]">Encaminhamento ativo</strong>
          <p className="mb-2.5 text-sm text-[#4a564f]">{referral.tipo}. Sua UBS já fez o encaminhamento.</p>
          <button type="button" className="rounded-xl bg-ouro px-4 py-2.5 text-sm font-bold text-[#3a2a0f]">
            Marcar horário
          </button>
        </div>
      )}

      {(programs ?? []).map((program) => (
        <div key={program.id} className="mt-4 rounded-2xl border border-rio/15 bg-white p-[18px]">
          <span className="mb-2.5 inline-block rounded-full bg-acai/10 px-2.5 py-1 text-xs font-bold text-acai">
            Programa municipal
          </span>
          <h3 className="text-base">{program.nome}</h3>
          <p className="mt-1.5 text-sm text-[#4a564f]">{program.descricao}</p>
        </div>
      ))}
    </div>
  );
}
