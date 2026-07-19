import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./state/AuthContext";
import { AppStateProvider } from "./state/AppStateContext";
import { supabase } from "./lib/supabaseClient";
import CaregiverAuth from "./auth/CaregiverAuth";
import OnboardingWizard from "./onboarding/OnboardingWizard";
import ElderConfirm from "./onboarding/ElderConfirm";
import ElderShell from "./components/layout/ElderShell";
import Inicio from "./screens/Inicio";
import Remedios from "./screens/Remedios";
import Saude from "./screens/Saude";
import Familia from "./screens/Familia";
import Emergencia from "./screens/Emergencia";
import CaregiverPanel from "./caregiver/CaregiverPanel";
import PartnerPage from "./partner/PartnerPage";
import HowItWorks from "./help/HowItWorks";

const queryClient = new QueryClient();

function RootRoute() {
  const { session, profile, loading } = useAuth();

  const { data: hasElder, isLoading: checkingLinks } = useQuery({
    queryKey: ["has_elder", session?.user.id],
    enabled: !!session && profile?.role === "cuidador",
    queryFn: async () => {
      const { count } = await supabase
        .from("caregiver_links")
        .select("id", { count: "exact", head: true })
        .eq("caregiver_id", session!.user.id);
      return (count ?? 0) > 0;
    },
  });

  if (loading) return null;
  if (!session) return <CaregiverAuth />;
  if (profile?.role === "idoso") return <Navigate to="/app/inicio" replace />;
  if (profile?.role === "cuidador") {
    if (checkingLinks) return null;
    return <Navigate to={hasElder ? "/cuidador" : "/onboarding"} replace />;
  }
  return null;
}

function OnboardingRoute() {
  const { session, profile, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/" replace />;
  if (profile && profile.role !== "cuidador") return <Navigate to="/" replace />;
  return <OnboardingWizard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route path="/confirmar/:token" element={<ElderConfirm />} />

      <Route path="/app" element={<ElderShell />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="remedios" element={<Remedios />} />
        <Route path="saude" element={<Saude />} />
        <Route path="familia" element={<Familia />} />
        <Route path="emergencia" element={<Emergencia />} />
      </Route>

      <Route path="/cuidador" element={<CaregiverPanel />} />
      <Route path="/parceiros" element={<PartnerPage />} />
      <Route path="/como-funciona" element={<HowItWorks />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppStateProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
