import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../state/AuthContext";
import CheckinHighlight from "../components/shared/CheckinHighlight";

export default function CaregiverPanel() {
  const { session, profile, loading, signOut } = useAuth();
  const caregiverId = session?.user.id;

  const { data: links } = useQuery({
    queryKey: ["caregiver_links", caregiverId],
    enabled: !!caregiverId,
    queryFn: async () => {
      const { data } = await supabase
        .from("caregiver_links")
        .select("elder_id, profiles!caregiver_links_elder_id_fkey(nome)")
        .eq("caregiver_id", caregiverId);
      return data ?? [];
    },
  });

  const elder = links?.[0];
  const elderId = elder?.elder_id;
  const elderNome = (elder?.profiles as unknown as { nome: string } | null)?.nome ?? "seu idoso";

  const { data: medications } = useQuery({
    queryKey: ["cg_medications", elderId],
    enabled: !!elderId,
    queryFn: async () => {
      const [{ data: reminders }, { data: confirmations }] = await Promise.all([
        supabase.from("medication_reminders").select("id, horario").eq("elder_id", elderId).order("horario"),
        supabase
          .from("medication_confirmations")
          .select("reminder_id")
          .gte("confirmado_em", new Date().toISOString().slice(0, 10)),
      ]);
      const confirmedIds = new Set((confirmations ?? []).map((c) => c.reminder_id));
      return (reminders ?? []).map((r) => ({ ...r, tomado: confirmedIds.has(r.id) }));
    },
  });

  const { data: checkin } = useQuery({
    queryKey: ["cg_checkin", elderId],
    enabled: !!elderId,
    queryFn: async () => {
      const { data } = await supabase
        .from("checkins")
        .select("created_at")
        .eq("elder_id", elderId)
        .eq("data", new Date().toISOString().slice(0, 10))
        .maybeSingle();
      return data;
    },
  });

  const { data: log } = useQuery({
    queryKey: ["cg_log", elderId],
    enabled: !!elderId && !!medications,
    queryFn: async () => {
      const { data } = await supabase
        .from("medication_confirmations")
        .select("confirmado_em, medication_reminders(nome_remedio)")
        .in(
          "reminder_id",
          (medications ?? []).map((m) => m.id),
        )
        .order("confirmado_em", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  if (loading) return null;
  if (!session) return <Navigate to="/" replace />;
  if (profile && profile.role !== "cuidador") return <Navigate to="/app/inicio" replace />;

  if (!loading && links && links.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="text-xl">Nenhum idoso cadastrado ainda</h1>
        <p className="mt-2.5 text-sm text-[#5a6660]">Complete o cadastro pra começar a acompanhar.</p>
        <Link to="/onboarding" className="mt-5 inline-block rounded-2xl bg-mata px-5 py-3 font-bold text-white">
          Cadastrar idoso
        </Link>
        <button type="button" onClick={signOut} className="mt-4 block w-full text-sm font-bold text-[#5a6660]">
          Sair
        </button>
      </div>
    );
  }

  const dosesTomadas = (medications ?? []).filter((m) => m.tomado).length;
  const proximaDoseFaltando = (medications ?? []).find((m) => !m.tomado);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <Link to="/app/inicio" className="text-sm font-bold text-mata">
          ← Ver app do idoso
        </Link>
        <button type="button" onClick={signOut} className="text-sm font-bold text-[#5a6660]">
          Sair
        </button>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-[28px] bg-rio p-8 text-[#f2f5f3] sm:p-10">
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <h2 className="text-2xl text-white">{elderNome} — hoje</h2>
            <p className="mt-2.5 max-w-[46ch] text-[#c9d6cf]">
              Acompanhamento simplificado para quem cuida à distância.
            </p>
          </div>
        </div>

        <div className="relative mt-7">
          <CheckinHighlight
            elderName={elderNome}
            message={checkin ? "Confirmou: está tudo bem hoje." : "Ainda não confirmou o check-in de hoje."}
            hora={checkin ? new Date(checkin.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}
            variant="dark"
          />
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#9fb8ac]">Check-in de hoje</div>
            <div className="mt-1.5 font-serif text-2xl text-white">
              <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${checkin ? "bg-[#6fce9c]" : "bg-ouro"}`} />
              {checkin ? "Confirmado" : "Pendente"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#9fb8ac]">Remédios</div>
            <div className="mt-1.5 font-serif text-2xl text-white">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#6fce9c]" />
              {dosesTomadas} de {(medications ?? []).length}
            </div>
            <div className="mt-2 text-sm text-[#c9d6cf]">
              {proximaDoseFaltando ? `Falta a dose das ${proximaDoseFaltando.horario.slice(0, 5)}` : "Todas as doses de hoje confirmadas"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#9fb8ac]">Próxima consulta</div>
            <div className="mt-1.5 font-serif text-2xl text-white">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-ouro" />
              Pendente
            </div>
          </div>
        </div>

        <div className="relative mt-[18px]">
          {(log ?? []).map((entry, i) => (
            <div key={i} className={`flex gap-3.5 py-3 text-sm ${i > 0 ? "border-t border-white/10" : ""}`}>
              <time className="w-14 flex-shrink-0 text-[#9fb8ac]">
                {new Date(entry.confirmado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </time>
              <span className="text-[#e8efe9]">
                {(entry.medication_reminders as unknown as { nome_remedio: string } | null)?.nome_remedio} confirmada.
              </span>
            </div>
          ))}
          {(!log || log.length === 0) && <p className="py-3 text-sm text-[#c9d6cf]">Nenhuma atividade ainda.</p>}
        </div>
      </div>
    </div>
  );
}
