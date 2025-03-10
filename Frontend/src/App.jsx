import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandigPage from './components/Landing/LandingPage';
import Login from './Pages/LoginPage';
import Signup from './Pages/Signup/SignupPage';
import Erreur from './Pages/ErreurPage';
import Step1 from './Pages/Signup/CompleteSignup1';
import Step2 from './Pages/Signup/CompleteSignup2';
import Step3 from './Pages/Signup/CompleteSignup3';
import Step4 from './Pages/Signup/CompleteSignup4';
import Verification from './Pages/Signup/MailVerification';
import Dashbord from './components/Admin/pages/Configuration/Dashboard';
import LogAdm from './Pages/loginadmin';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandigPage />} />  {/* Route publique */}
          <Route path="/connexion" element={<Login />} />  {/* Route publique */}
          <Route path="/inscription" element={<Signup />} />  {/* Route publique */}
          <Route path="/Erreur" element={<Erreur />} />  {/* Route publique */}
          <Route path="/paiement" element={<Step1 />} />  {/* Route publique */}
          <Route path="/paiement/presentation" element={<Step2 />} />  {/* Route publique */}
          <Route path="/paiement/presentation/adresse" element={<Step3 />} />  {/* Route publique */}
          <Route path="/paiement/presentation/adresse/identifiants" element={<Step4 />} />  {/* Route publique */}
          <Route path="/paiement/presentation/adresse/identifiants/verification" element={<Verification />} />  {/* Route publique */}
          <Route path="/dashbord" element={<Dashbord />} />  {/* Route publique */}
          <Route path="/gg" element={<LogAdm />} />  {/* Route publique */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;