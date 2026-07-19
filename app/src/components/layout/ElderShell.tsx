import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";
import { useAppState } from "../../state/AppStateContext";
import BottomNav from "./BottomNav";

export default function ElderShell() {
  const { session, profile, loading } = useAuth();
  const { easyMode, offlineMode } = useAppState();

  if (loading) return null;
  if (!session) return <Navigate to="/" replace />;
  if (profile && profile.role !== "idoso") return <Navigate to="/cuidador" replace />;

  return (
    <div className={`flex min-h-svh flex-col bg-paper text-ink ${easyMode ? "easy-mode" : ""}`}>
      {offlineMode && (
        <div className="bg-urucum/[0.12] px-4 py-2 text-center text-xs font-semibold text-urucum">
          Sem internet agora. O botão de emergência pode não funcionar — se precisar de ajuda, ligue
          direto para sua família.
        </div>
      )}

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
