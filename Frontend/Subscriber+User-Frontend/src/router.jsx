import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./Utils/LoadingSpinner";
import ProtectedRoute from "./Utils/ProtectedRoute";

// Importez vos composants lazy
const LandingPage = lazy(() => import("./components/Landing/LandingPage"));
const PricingPage = lazy(() => import("./components/Landing/components/PricingPage"));
const Login = lazy(() => import("./components/Subscriber/LoginPage"));
const Erreur = lazy(() => import("./Pages/ErreurPage"));
const GetStarted = lazy(() => import("./Pages/Signup/PaiementPage"));
const Demo = lazy(() => import("./Pages/Demo/Demo"));
const Verification = lazy(() => import("./Pages/Signup/MailVerification"));
const Dashboard = lazy(() => import("./components/Subscriber/pages/Configuration/Dashboard"));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/tarification" element={<PricingPage />} />
        <Route path="/Erreur" element={<Erreur />} />
        <Route path="/paiement" element={<GetStarted />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/paiement/presentation/adresse/identifiants/verification" element={<Verification />} />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashbord" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;