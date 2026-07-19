import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function CaregiverAuth() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = mode === "entrar" ? await signIn(email, password) : await signUp(email, password);

    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (mode === "criar") {
      setConfirmSent(true);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (result.error) setError(result.error);
    // sucesso redireciona pro provedor do Google — nada mais a fazer aqui.
  }

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <div className="mx-auto w-full max-w-md px-6 pb-2 pt-14 text-center">
        <h1 className="font-serif text-[1.7rem] font-semibold tracking-tight text-rio">AmaVida</h1>
        <p className="mx-auto mt-2 max-w-[32ch] text-[0.92rem] leading-relaxed text-[#5a6660]">
          Uma companhia digital para a pessoa idosa, sempre com a família por perto.
        </p>
        <p className="mt-3 font-serif text-[0.85rem] italic text-mata-light">
          "Seu Antônio confirmou que já tomou a Losartana das 8h." — é alívio, não vigilância.
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-md flex-1 px-5 pb-8">
        <div className="rounded-[24px] border border-rio/[0.08] bg-white p-7 shadow-[0_24px_50px_-30px_rgba(22,59,51,0.25)]">
          <h2 className="text-xl">{mode === "entrar" ? "Entrar" : "Criar conta"}</h2>
          <p className="mb-6 mt-1 text-sm text-[#5a6660]">
            Acesso do cuidador — quem cadastra e acompanha o idoso.
          </p>

          {confirmSent ? (
            <div className="rounded-2xl border border-mata/30 bg-mata/10 p-4 text-sm text-[#3a4640]">
              Conta criada! Se a confirmação por e-mail estiver ativa no projeto, verifique sua caixa de
              entrada. Depois é só entrar com e-mail e senha.
              <button
                type="button"
                onClick={() => {
                  setConfirmSent(false);
                  setMode("entrar");
                }}
                className="mt-3 block font-bold text-mata"
              >
                Ir para Entrar →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rio/15 bg-white py-3.5 font-bold text-rio transition-colors hover:bg-paper-2 disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.52 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47a5.54 5.54 0 0 1-2.4 3.64v3h3.87c2.27-2.09 3.58-5.17 3.58-8.75Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3a7.4 7.4 0 0 1-11-3.9H1.1v3.09A12 12 0 0 0 12 24Z" />
                  <path fill="#FBBC05" d="M5.07 14.2a7.2 7.2 0 0 1 0-4.4V6.71H1.1a12 12 0 0 0 0 10.58l3.97-3.1Z" />
                  <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.1 6.71l3.97 3.09A7.15 7.15 0 0 1 12 4.75Z" />
                </svg>
                {googleLoading ? "Aguarde..." : "Continuar com Google"}
              </button>

              <div className="flex items-center gap-3 text-xs font-bold text-[#8a938c]">
                <span className="h-px flex-1 bg-rio/10" />
                ou
                <span className="h-px flex-1 bg-rio/10" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="authEmail" className="text-sm font-bold text-rio">
                    E-mail
                  </label>
                  <input
                    id="authEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem] focus:outline-2 focus:outline-mata"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="authPassword" className="text-sm font-bold text-rio">
                    Senha
                  </label>
                  <input
                    id="authPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="rounded-2xl border border-rio/15 bg-white px-3.5 py-3 text-[0.95rem] focus:outline-2 focus:outline-mata"
                  />
                </div>

                {error && <p className="text-sm font-bold text-urucum">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full rounded-2xl bg-mata py-4 font-bold text-white transition-colors hover:bg-rio disabled:opacity-60"
                >
                  {submitting ? "Aguarde..." : mode === "entrar" ? "Entrar" : "Criar conta"}
                </button>

                <button
                  type="button"
                  onClick={() => setMode(mode === "entrar" ? "criar" : "entrar")}
                  className="text-center text-sm font-bold text-mata"
                >
                  {mode === "entrar" ? "Ainda não tenho conta — criar" : "Já tenho conta — entrar"}
                </button>
              </form>
            </div>
          )}
        </div>

        <Link to="/como-funciona" className="mt-6 block text-center text-sm font-bold text-[#5a6660]">
          Como funciona o AmaVida?
        </Link>
      </div>
    </div>
  );
}
