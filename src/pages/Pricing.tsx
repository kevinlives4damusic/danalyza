import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PricingPage from "../components/PricingPage";
import PricingComparison from "../components/PricingComparison";
import Testimonials from "../components/Testimonials";

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4">
          <PricingPage />
          <PricingComparison />
          <Testimonials />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
