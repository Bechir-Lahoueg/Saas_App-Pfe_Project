import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./Utils/LoadingSpinner";
// import ProtectedRoute from "./Utils/ProtectedRoute";

// Importez vos composants lazy
const LandingPage = lazy(() => import("./Landing/LandingPage"));
const PricingPage = lazy(() => import("./Landing/Components/PricingPage"));
const Login = lazy(() => import("./Auth/SignIn/LoginPage"));
const Erreur = lazy(() => import("./Utils/ErreurPage"));
const GetStarted = lazy(() => import("./Auth/Signup/PaiementPremuim"));
const Demo = lazy(() => import("./Demo/Demo"));
const Verification = lazy(() => import("./Auth/SignIn/MailVerification"));
const Dashboard = lazy(() => import("./Tenant/Dashboard"));
const MailSender = lazy(() => import("./Auth/SignIn/ForgotPassword"));
const PasswordChanger = lazy(() => import("./Auth/SignIn/ResetPassword"));
const Processres = lazy(() => import("./Client/app"));
const AllIndustries = lazy(() =>
  import("./Landing/Components/SectorPages/AllIndustries")
);
const BeautyWellness = lazy(() =>
  import("./Landing/Components/SectorPages/BeautyWellness")
);
const Education = lazy(() =>
  import("./Landing/Components/SectorPages/Education")
);
const EventsEntertainment = lazy(() =>
  import("./Landing/Components/SectorPages/EventsEntertainment")
);
const Healthcare = lazy(() =>
  import("./Landing/Components/SectorPages/Healthcare")
);
const Photographers = lazy(() =>
  import("./Landing/Components/SectorPages/Photographers")
);
const ProfessionnelServices = lazy(() =>
  import("./Landing/Components/SectorPages/ProfessionalServices")
);
const PublicServices = lazy(() =>
  import("./Landing/Components/SectorPages/PublicServices")
);
const Retail = lazy(() => import("./Landing/Components/SectorPages/Retail"));
const SportsFitness = lazy(() =>
  import("./Landing/Components/SectorPages/SportsFitness")
);

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
        <Route
          path="/paiement/presentation/adresse/identifiants/verification"
          element={<Verification />}
        />
        <Route path="/app" element={<Processres />} />
        <Route path="/toutes-industries" element={<AllIndustries />} />
        <Route path="/beaute-bien-etre" element={<BeautyWellness />} />
        <Route path="/education" element={<Education />} />
        <Route
          path="/evenements-divertissement"
          element={<EventsEntertainment />}
        />
        <Route path="/sante" element={<Healthcare />} />
        <Route path="/photographes" element={<Photographers />} />
        <Route
          path="/services-professionnels"
          element={<ProfessionnelServices />}
        />
        <Route path="/services-publics" element={<PublicServices />} />
        <Route path="/commerce-de-detail" element={<Retail />} />
        <Route path="/sports-fitness" element={<SportsFitness />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
