import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppStateProvider, useAppState } from "./state/AppStateContext";
import OnboardingWizard from "./onboarding/OnboardingWizard";
import ElderShell from "./components/layout/ElderShell";
import Inicio from "./screens/Inicio";
import Remedios from "./screens/Remedios";
import Saude from "./screens/Saude";
import Familia from "./screens/Familia";
import Emergencia from "./screens/Emergencia";
import CaregiverPanel from "./caregiver/CaregiverPanel";
import PartnerPage from "./partner/PartnerPage";

function RootRoute() {
  const { onboardingComplete } = useAppState();
  return onboardingComplete ? <Navigate to="/app/inicio" replace /> : <OnboardingWizard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  );
}
