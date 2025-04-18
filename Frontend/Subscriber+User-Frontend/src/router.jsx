import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./Utils/LoadingSpinner";
// import ProtectedRoute from "./Utils/ProtectedRoute";

// Importez vos composants lazy
const LandingPage = lazy(() => import("./components/Landing/LandingPage"));
const PricingPage = lazy(() => import("./components/Landing/components/PricingPage"));
const Login = lazy(() => import("./components/Subscriber/LoginPage"));
const Erreur = lazy(() => import("./Pages/ErreurPage"));
const GetStarted = lazy(() => import("./Pages/Signup/PaiementPage"));
const Demo = lazy(() => import("./Pages/Demo/Demo"));
const Verification = lazy(() => import("./Pages/Signup/MailVerification"));
const Dashboard = lazy(() => import("./components/Subscriber/pages/Configuration/Dashboard"));
const MailSender = lazy(() => import("./Pages/ForgotPassword"));
const PasswordChanger = lazy(() => import("./Pages/ResetPassword"));
const Processres = lazy(() => import("./components/Client/app"));
const AllIndustries = lazy(() => import("./components/Landing/SectorPages/AllIndustries"));
const BeautyWellness = lazy(() => import("./components/Landing/SectorPages/BeautyWellness"));
const Education = lazy(() => import("./components/Landing/SectorPages/Education"));
const EventsEntertainment = lazy(() => import("./components/Landing/SectorPages/EventsEntertainment"));
const Healthcare = lazy(() => import("./components/Landing/SectorPages/Healthcare"));
const Photographers = lazy(() => import("./components/Landing/SectorPages/Photographers"));
const ProfessionnelServices = lazy(() => import("./components/Landing/SectorPages/ProfessionalServices"));
const PublicServices = lazy(() => import("./components/Landing/SectorPages/PublicServices"));
const Retail = lazy(() => import("./components/Landing/SectorPages/Retail"));
const SportsFitness = lazy(() => import("./components/Landing/SectorPages/SportsFitness"));


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
        <Route path="/paiement/presentation/adresse/identifiants/verification" element={<Verification />} />
        <Route path="/app" element={<Processres />} />
        <Route path="/toutes-industries" element={<AllIndustries />} />
        <Route path="/beaute-bien-etre" element={<BeautyWellness />} />
        <Route path="/education" element={<Education />} />
        <Route path="/evenements-divertissement" element={<EventsEntertainment />} />
        <Route path="/sante" element={<Healthcare />} />
        <Route path="/photographes" element={<Photographers />} />
        <Route path="/services-professionnels" element={<ProfessionnelServices />} />
        <Route path="/services-publics" element={<PublicServices />} />
        <Route path="/commerce-de-detail" element={<Retail />} />
        <Route path="/sports-fitness" element={<SportsFitness />} />
        <Route path="/dashboard" element={<Dashboard />} />




        {/* Routes protégées */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashbord" element={<Dashboard />} />
        </Route> */}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;