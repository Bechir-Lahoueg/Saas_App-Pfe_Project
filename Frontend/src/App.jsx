import React from "react";
import { Navbar, GetStarted, Functionnalities, Webflow, Solutions, Reviews, Pricing, Faqs, Footer } from './components/Landing/Index';
const App = () => {

  return (
    <div>
      <Navbar />
      <GetStarted />
      <Functionnalities />
      <Webflow />
      <Solutions />
      <Reviews />
      <Pricing />
      <Faqs />
      <Footer />
      
    </div>
  );
};

export default App;
