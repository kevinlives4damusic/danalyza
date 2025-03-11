import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PricingPage from "../components/PricingPage";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <PricingPage />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
