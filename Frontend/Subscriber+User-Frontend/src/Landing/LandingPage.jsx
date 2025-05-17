import React from "react";
import Navbar from "./Components/Navbar.jsx";
import GetStarted from "./Components/GetStarted.jsx";
import Functionnalities from "./Components/Functionnalities.jsx";
import Webflow from "./Components/Webflow.jsx";
import Solutions from "./Components/Solutions.jsx";
import Faqs from "./Components/Faqs.jsx";
import Footer from "./Components/Footer.jsx";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <GetStarted />
      <Functionnalities />
      <Webflow />
      <Solutions />
      <Faqs />
      <Footer />
    </div>
  );
}
