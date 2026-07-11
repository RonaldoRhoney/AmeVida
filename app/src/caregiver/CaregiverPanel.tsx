import { Link } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";
import { caregiverLog, defaultCaregiverName } from "../lib/mockData";
import CheckinHighlight from "../components/shared/CheckinHighlight";

export default function CaregiverPanel() {
  const { elder, medications, todayCheckin } = useAppState();
  const nome = elder?.nome ?? "Seu Antônio";
  const dosesTomadas = medications.filter((m) => m.tomadoHoje).length;
  const proximaDoseFaltando = medications.find((m) => !m.tomadoHoje);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link to="/app/inicio" className="text-sm font-bold text-mata">
        ← Voltar para o app do idoso
      </Link>

      <div className="relative mt-4 overflow-hidden rounded-[28px] bg-rio p-8 text-[#f2f5f3] sm:p-10">
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <h2 className="text-2xl text-white">{nome} — hoje</h2>
            <p className="mt-2.5 max-w-[46ch] text-[#c9d6cf]">
              Acompanhamento simplificado para quem cuida à distância. {defaultCaregiverName} recebe estes
              mesmos avisos por WhatsApp.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[0.82rem] font-bold text-[#e8efe9]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.2.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.4 0 .6-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.4 1.3 1.2 2.5 1.6 2.8 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.8.8 2.1.9.3.2.5.2.6.3.1.2.1.9-.1 1.5Z" />
            </svg>
            Também chega no WhatsApp
          </span>
        </div>

        <div className="relative mt-7">
          <CheckinHighlight
            elderName={nome}
            message={
              todayCheckin?.confirmado
                ? `Confirmou: está tudo bem hoje.${proximaDoseFaltando ? "" : " Já tomou todos os remédios de hoje."}`
                : "Ainda não confirmou o check-in de hoje."
            }
            hora={todayCheckin?.hora ?? "—"}
            variant="dark"
          />
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#9fb8ac]">Check-in de hoje</div>
            <div className="mt-1.5 font-serif text-2xl text-white">
              <span
                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                  todayCheckin?.confirmado ? "bg-[#6fce9c]" : "bg-ouro"
                }`}
              />
              {todayCheckin?.confirmado ? "Confirmado" : "Pendente"}
            </div>
            <div className="mt-2 text-sm text-[#c9d6cf]">
              {todayCheckin?.confirmado ? `${todayCheckin.hora} — "Estou bem hoje"` : "Aguardando confirmação"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#9fb8ac]">Remédios</div>
            <div className="mt-1.5 font-serif text-2xl text-white">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#6fce9c]" />
              {dosesTomadas} de {medications.length}
            </div>
            <div className="mt-2 text-sm text-[#c9d6cf]">
              {proximaDoseFaltando ? `Falta a dose das ${proximaDoseFaltando.horario}` : "Todas as doses de hoje confirmadas"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-[#9fb8ac]">Próxima consulta</div>
            <div className="mt-1.5 font-serif text-2xl text-white">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-ouro" />
              Pendente
            </div>
            <div className="mt-2 text-sm text-[#c9d6cf]">Avaliação da Pessoa Idosa — a marcar</div>
          </div>
        </div>

        <div className="relative mt-[18px]">
          {caregiverLog.map((entry, i) => (
            <div
              key={i}
              className={`flex gap-3.5 py-3 text-sm ${i > 0 ? "border-t border-white/10" : ""}`}
            >
              <time className="w-14 flex-shrink-0 text-[#9fb8ac]">{entry.hora}</time>
              <span className="text-[#e8efe9]">{entry.texto}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
