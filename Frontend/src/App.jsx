import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandigPage from './components/Landing/LandingPage';
import Login from './Pages/LoginPage';
import Signup from './Pages/Signup/SignupPage';
import Erreur from './Pages/ErreurPage';
import CC from './Pages/Signup/CompleteSignup1';
import Ff from './Pages/Signup/CompleteSignup2';
import Gg from './Pages/Signup/CompleteSignup3';
import Hh from './Pages/Signup/CompleteSignup4';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandigPage />} />  {/* Route publique */}
          <Route path="/connexion" element={<Login />} />  {/* Route publique */}
          <Route path="/inscription" element={<Signup />} />  {/* Route publique */}
          <Route path="/Erreur" element={<Erreur />} />  {/* Route publique */}
          <Route path="/cc" element={<CC />} />  {/* Route publique */}
          <Route path="/cc/ff" element={<Ff />} />  {/* Route publique */}
          <Route path="/cc/ff/gg" element={<Gg />} />  {/* Route publique */}
          <Route path="/cc/ff/gg/hh" element={<Hh />} />  {/* Route publique */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;