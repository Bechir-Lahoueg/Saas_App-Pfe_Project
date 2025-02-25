import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandigPage from './components/Landing/LandingPage';
import Test from './Pages/test';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandigPage />} />  {/* Route publique */}
          <Route path="/rr" element={<Test />} />  {/* Route publique */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;