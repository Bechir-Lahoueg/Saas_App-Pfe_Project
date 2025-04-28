import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./Utils/LoadingSpinner.jsx";

const LandingPage = lazy(() => import("./Landing/LandingPage"));
const PricingPage = lazy(() => import("./Landing/Components/PricingPage"));
const Login = lazy(() => import("./Auth/SignIn/LoginPage"));
const Erreur = lazy(() => import("./Utils/ErreurPage.jsx"));
const GetStarted = lazy(() => import("./Auth/Signup/PaiementPremuim"));
const Demo = lazy(() => import("./Demo/Demo"));
const Dashboard = lazy(() => import("./Tenant/Dashboard"));
const MailSender = lazy(() => import("./Auth/SignIn/ForgotPassword"));
const PasswordChanger = lazy(() => import("./Auth/SignIn/ResetPassword"));
const Processres = lazy(() => import("./Client/app"));
const Catgeories = lazy(() => import("./Landing/Categories/Catgeories"));
const CategoriesTenants = lazy(() => import("./Landing/Categories/TenantsByCategory"));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/tarification" element={<PricingPage />} />
        <Route path="/404" element={<Erreur />} />
        <Route path="/forgot-password" element={<MailSender />} />
        <Route path="/reset-password" element={<PasswordChanger />} />
        <Route path="/paiement" element={<GetStarted />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/app" element={<Processres />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/secteurs" element={<Catgeories />} />
        <Route path="/secteurs/:categoryName" element={<CategoriesTenants />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
