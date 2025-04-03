import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./Utils/LoadingSpinner";
import DelayedLoadingWrapper from "./Utils/DelayedLoadingWrapper";
import ProtectedRoute from "./Utils/ProtectedRoute";

// Importez vos composants lazy
const LandigPage = lazy(() => import("./components/Landing/LandingPage"));
const PricingPage = lazy(() => import("./components/Landing/components/PricingPage"));
const Login = lazy(() => import("./components/Subscriber/LoginPage"));
const Signup = lazy(() => import("./Pages/Signup/SignupPage"));
const Erreur = lazy(() => import("./Pages/ErreurPage"));
const Step1 = lazy(() => import("./Pages/Signup/PaiementPage"));
const Demo = lazy(() => import("./Pages/Demo/Demo"));
const Step3 = lazy(() => import("./Pages/Signup/CompleteSignup3"));
const Step4 = lazy(() => import("./Pages/Signup/CompleteSignup4"));
const Verification = lazy(() => import("./Pages/Signup/MailVerification"));
const Dashbord = lazy(() => import("./components/Subscriber/pages/Configuration/Dashboard"));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Pages sans loading spécial */}
        <Route path="/" element={<LandigPage />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Signup />} />
        
        {/* Pages avec loading spécial */}
        <Route path="/Erreur" element={
          <DelayedLoadingWrapper>
            <Erreur />
          </DelayedLoadingWrapper>
        } />
        <Route path="/paiement" element={
          <DelayedLoadingWrapper>
            <Step1 />
          </DelayedLoadingWrapper>
        } />
         <Route path="/tarification" element={
          <DelayedLoadingWrapper>
            <PricingPage />
          </DelayedLoadingWrapper>
        } />
        <Route path="/demo" element={
          <DelayedLoadingWrapper>
            <Demo />
          </DelayedLoadingWrapper>
        } />
        <Route path="/paiement/presentation/adresse" element={
          <DelayedLoadingWrapper>
            <Step3 />
          </DelayedLoadingWrapper>
        } />
        <Route path="/paiement/presentation/adresse/identifiants" element={
          <DelayedLoadingWrapper>
            <Step4 />
          </DelayedLoadingWrapper>
        } />
        <Route path="/paiement/presentation/adresse/identifiants/verification" element={
          <DelayedLoadingWrapper>
            <Verification />
          </DelayedLoadingWrapper>
        } />

        {/* Route protégée avec loading spécial */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashbord" element={
            <DelayedLoadingWrapper>
              <Dashbord />
            </DelayedLoadingWrapper>
          } />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;