import React from "react";
import {
  Navbar,
  GetStarted,
  Functionnalities,
  Webflow,
  Solutions,
  Reviews,
  Pricing,
  Faqs,
  Footer,
} from "./Index/index";
export default function LandingPage() {
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
}
