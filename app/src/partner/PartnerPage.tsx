import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const BENEFITS = [
  "Seu município é atendido com prioridade na fila de revisão",
  "O agente de saúde entrega o QR code de cadastro na própria visita",
  "Custo zero para prefeituras e ONGs no piloto",
];

export default function PartnerPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <Link to="/" className="text-sm font-bold text-mata">
        ← AmaVida
      </Link>

      <div className="mt-4 grid gap-9 rounded-[28px] border border-rio/15 bg-paper-2 p-7 sm:grid-cols-[1.1fr_1fr] sm:p-11">
        <div>
          <h1 className="max-w-[16ch] text-2xl sm:text-3xl">
            Mais que dado: um canal para chegar aos idosos que a UBS não visita toda semana
          </h1>
          <p className="mt-3.5 max-w-[48ch] text-[#4a564f]">
            Prefeituras, secretarias de saúde e organizações que atendem a pessoa idosa podem indicar
            unidades, programas e fluxos de encaminhamento oficiais do seu município — e o agente de
            saúde vira parte da distribuição, entregando o cadastro presencialmente na visita domiciliar.
          </p>
          <ul className="mt-[22px] flex flex-col gap-3.5">
            {BENEFITS.map((benefit, i) => (
              <li key={benefit} className="flex items-start gap-3 text-[0.95rem] font-bold text-rio">
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-mata text-[0.8rem] text-white">
                  {i + 1}
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 rounded-2xl border border-rio/15 bg-white p-6">
          <label className="flex flex-col gap-1.5 text-sm font-bold text-rio">
            Nome da instituição
            <input
              type="text"
              placeholder="Ex.: Secretaria de Saúde de Bacuri"
              required
              className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm font-normal focus:outline-2 focus:outline-mata"
            />
          </label>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <label className="flex flex-col gap-1.5 text-sm font-bold text-rio">
              Município
              <input
                type="text"
                placeholder="Ex.: Bacuri"
                required
                className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm font-normal focus:outline-2 focus:outline-mata"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-bold text-rio">
              Estado
              <input
                type="text"
                placeholder="Ex.: MA"
                maxLength={2}
                required
                className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm font-normal focus:outline-2 focus:outline-mata"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-bold text-rio">
            Tipo de instituição
            <select
              required
              defaultValue=""
              className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm font-normal focus:outline-2 focus:outline-mata"
            >
              <option value="" disabled>
                Selecione
              </option>
              <option>Prefeitura</option>
              <option>Secretaria de Saúde</option>
              <option>ONG / Associação</option>
              <option>Empresa local</option>
              <option>Outro</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-bold text-rio">
            E-mail de contato
            <input
              type="email"
              placeholder="voce@instituicao.gov.br"
              required
              className="rounded-xl border border-rio/15 bg-paper px-3 py-2.5 text-sm font-normal focus:outline-2 focus:outline-mata"
            />
          </label>
          <button
            type="submit"
            className="mt-1 rounded-2xl bg-rio py-3.5 font-bold text-white transition-colors hover:bg-mata"
          >
            Quero ser parceiro
          </button>
          <span className="min-h-[18px] text-center text-sm font-bold text-mata">
            {sent ? "Recebido! Este é só um preview — no produto real isso chega direto para a equipe AmaVida." : " "}
          </span>
        </form>
      </div>
    </div>
  );
}
