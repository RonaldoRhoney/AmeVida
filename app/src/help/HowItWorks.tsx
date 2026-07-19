import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SLIDES = [
  {
    title: "O cuidador cadastra",
    steps: [
      {
        title: "Crie sua conta",
        text: "Na tela de login, toque em \"Ainda não tenho conta — criar\" e cadastre seu e-mail e senha (ou entre com o Google).",
      },
      {
        title: "Cadastre o idoso",
        text: "Preencha o nome, cidade/UF, os remédios (com horário e instrução) e um contato de emergência.",
      },
    ],
  },
  {
    title: "O convite chega pro idoso",
    steps: [
      {
        title: "Envie o link ou mostre o QR code",
        text: "Toque em \"Enviar link por WhatsApp\", ou deixe o idoso apontar a câmera pro QR code do cartão de convite.",
      },
      {
        title: "O idoso só toca \"Sim, sou eu\"",
        text: "Não precisa digitar nada, nem senha. Um toque confirma o cadastro e já abre o app pronto pra uso.",
      },
    ],
  },
  {
    title: "O dia a dia",
    steps: [
      {
        title: "O idoso usa o AmaVida",
        text: "Toque e fale o que precisa, confirme remédios com \"já tomei\", avise a família com \"Estou bem hoje\", ou use \"Preciso de ajuda\" numa emergência.",
      },
      {
        title: "O cuidador acompanha no painel",
        text: "Check-in do dia, remédios tomados e o histórico — tudo num só lugar, sem precisar perguntar.",
      },
    ],
  },
];

export default function HowItWorks() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-5 py-8">
      <Link to="/" className="text-sm font-bold text-mata">
        ← AmaVida
      </Link>

      <div className="mb-5 mt-4 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= slide ? "bg-mata" : "bg-rio/10"}`} />
        ))}
      </div>

      <h1 className="text-2xl">{SLIDES[slide].title}</h1>
      <p className="mt-1 text-sm text-[#5a6660]">
        Tela {slide + 1} de {SLIDES.length}
      </p>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        {SLIDES[slide].steps.map((step) => (
          <div key={step.title} className="rounded-2xl border border-rio/15 bg-white p-4">
            <strong className="block text-sm text-rio">{step.title}</strong>
            <p className="mt-1 text-sm text-[#4a564f]">{step.text}</p>
          </div>
        ))}
      </div>

      {isLast && (
        <p className="mb-2 mt-4 text-center font-serif text-base italic text-mata">
          É alívio, não vigilância.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2.5">
        {isLast ? (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-2xl bg-mata py-4 font-bold text-white transition-colors hover:bg-rio"
          >
            Ir para o login
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSlide((s) => s + 1)}
            className="w-full rounded-2xl bg-mata py-4 font-bold text-white transition-colors hover:bg-rio"
          >
            Próximo →
          </button>
        )}
        {slide > 0 && (
          <button
            type="button"
            onClick={() => setSlide((s) => s - 1)}
            className="w-full py-2.5 text-sm font-bold text-[#5a6660]"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}
