import { useAppState } from "../state/AppStateContext";

const CALL_ICON = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7 8.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
  </svg>
);

export default function Familia() {
  const { emergencyContacts, todayCheckin, confirmCheckin } = useAppState();

  return (
    <div>
      <h2 className="text-2xl">
        Família
        <small className="mt-0.5 block text-sm font-normal text-[#5a6660]">
          Quem cuida de você, sempre por perto
        </small>
      </h2>

      <div className="mt-4 flex flex-col gap-2.5">
        {emergencyContacts.map((contact) => (
          <div key={contact.nome} className="flex items-center gap-3 rounded-2xl border border-rio/15 bg-white p-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-acai font-bold text-white">
              {contact.nome.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <strong className="block text-[0.95rem]">{contact.nome}</strong>
              <small className="text-[0.8rem] text-[#5a6660]">{contact.telefone}</small>
            </div>
            <a
              href={`tel:${contact.telefone}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-mata"
              aria-label={`Ligar para ${contact.nome}`}
            >
              {CALL_ICON}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-[22px] rounded-2xl border border-dashed border-ouro/50 bg-ouro/10 p-4">
        <strong className="mb-1 block text-sm text-[#9a6c1c]">Check-in de hoje</strong>
        {todayCheckin?.confirmado ? (
          <p className="text-sm text-[#4a564f]">Avisado às {todayCheckin.hora} — obrigado!</p>
        ) : (
          <>
            <p className="mb-2.5 text-sm text-[#4a564f]">Toque para avisar sua família que está tudo bem.</p>
            <button type="button" onClick={confirmCheckin} className="rounded-xl bg-mata px-4 py-2.5 text-sm font-bold text-white">
              Estou bem hoje
            </button>
          </>
        )}
      </div>
    </div>
  );
}
