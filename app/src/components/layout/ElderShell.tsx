import { Navigate, Outlet, Link } from "react-router-dom";
import { useAppState } from "../../state/AppStateContext";
import BottomNav from "./BottomNav";

export default function ElderShell() {
  const { onboardingComplete, easyMode, offlineMode } = useAppState();

  if (!onboardingComplete) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`flex min-h-svh flex-col bg-paper text-ink ${easyMode ? "easy-mode" : ""}`}>
      {offlineMode && (
        <div className="bg-paper-2 px-4 py-2 text-center text-xs text-[#4a564f]">
          Sem internet agora. Seus remédios e o botão de emergência continuam funcionando — os dados
          serão enviados assim que a conexão voltar.
        </div>
      )}

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-4">
        <Outlet />
      </main>

      <BottomNav />

      <div className="border-t border-rio/10 bg-white py-2 text-center">
        <Link to="/cuidador" className="text-xs font-bold text-mata">
          Ver como painel do cuidador ↗
        </Link>
      </div>
    </div>
  );
}
