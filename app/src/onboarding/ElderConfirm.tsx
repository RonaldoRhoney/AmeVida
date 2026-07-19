import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "ready"; nome: string }
  | { status: "confirming" }
  | { status: "done" }
  | { status: "error"; message: string };

export default function ElderConfirm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!token) return;
    supabase
      .rpc("get_pending_invite", { p_token: token })
      .single()
      .then(({ data, error }) => {
        const row = data as { elder_nome: string; consumed: boolean } | null;
        if (error || !row || row.consumed) {
          setState({ status: "not-found" });
          return;
        }
        setState({ status: "ready", nome: row.elder_nome });
      });
  }, [token]);

  async function handleConfirm() {
    if (!token) return;
    setState({ status: "confirming" });

    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      setState({ status: "error", message: authError.message });
      return;
    }

    const { error: rpcError } = await supabase.rpc("confirm_elder_onboarding", { p_token: token });
    if (rpcError) {
      setState({ status: "error", message: rpcError.message });
      return;
    }

    setState({ status: "done" });
    setTimeout(() => navigate("/app/inicio"), 1400);
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-5 py-8 text-center">
      {state.status === "loading" && <p className="text-sm text-[#5a6660]">Carregando convite...</p>}

      {state.status === "not-found" && (
        <>
          <h1 className="text-xl">Link inválido ou expirado</h1>
          <p className="mt-2.5 max-w-[26ch] text-sm text-[#4a564f]">
            Peça pra quem te enviou o link gerar um novo convite.
          </p>
        </>
      )}

      {state.status === "error" && (
        <>
          <h1 className="text-xl text-urucum">Algo deu errado</h1>
          <p className="mt-2.5 max-w-[26ch] text-sm text-[#4a564f]">{state.message}</p>
        </>
      )}

      {(state.status === "ready" || state.status === "confirming") && (
        <>
          <h1 className="max-w-[20ch] text-xl">Oi, {state.status === "ready" ? state.nome : "..."}!</h1>
          <p className="mt-2.5 max-w-[26ch] text-sm text-[#4a564f]">
            Alguém da sua família já preparou o AmaVida para você. Toque no botão abaixo para confirmar
            que é você.
          </p>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={state.status === "confirming"}
            className="mt-9 w-full rounded-3xl bg-mata py-[26px] text-lg font-bold text-white shadow-[0_14px_30px_-10px_rgba(47,122,94,0.5)] active:bg-rio disabled:opacity-70"
          >
            {state.status === "confirming" ? "Confirmando..." : "Sim, sou eu"}
          </button>
        </>
      )}

      {state.status === "done" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mata text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mt-3.5 text-xl">Prontinho!</h1>
          <p className="mt-2.5 max-w-[26ch] text-sm text-[#4a564f]">Cadastro confirmado. Abrindo o AmaVida...</p>
        </>
      )}
    </div>
  );
}
