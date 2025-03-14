import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoadingSpinner from '../public/LoadingSpinner';
import DelayedLoadingWrapper from './Utils/DelayedLoadingWrapper';
import ProtectedRoute from './Utils/ProtectedRoute'; // Importez le composant ProtectedRoute

// Importez vos composants lazy
const LandigPage = lazy(() => import('./components/Landing/LandingPage'));
const Login = lazy(() => import('./Pages/LoginPage'));
const Signup = lazy(() => import('./Pages/Signup/SignupPage'));
const Erreur = lazy(() => import('./Pages/ErreurPage'));
const Step1 = lazy(() => import('./Pages/Signup/CompleteSignup1'));
const Step2 = lazy(() => import('./Pages/Signup/CompleteSignup2'));
const Step3 = lazy(() => import('./Pages/Signup/CompleteSignup3'));
const Step4 = lazy(() => import('./Pages/Signup/CompleteSignup4'));
const Verification = lazy(() => import('./Pages/Signup/MailVerification'));
const Dashbord = lazy(() => import('./components/Admin/pages/Configuration/Dashboard'));
const LogAdmin = lazy(() => import('./Pages/loginadmin'));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DelayedLoadingWrapper>
        <Routes>
          <Route path="/" element={<LandigPage />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/Erreur" element={<Erreur />} />
          <Route path="/paiement" element={<Step1 />} />
          <Route path="/paiement/presentation" element={<Step2 />} />
          <Route path="/paiement/presentation/adresse" element={<Step3 />} />
          <Route path="/paiement/presentation/adresse/identifiants" element={<Step4 />} />
          <Route path="/paiement/presentation/adresse/identifiants/verification" element={<Verification />} />
          
          {/* Utilisez ProtectedRoute pour les routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashbord" element={<Dashbord />} />
          </Route>

          <Route path="/connexionadmin" element={<LogAdmin />} />
        </Routes>
      </DelayedLoadingWrapper>
    </Suspense>
  );
};

export default AppRouter;