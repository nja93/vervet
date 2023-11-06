import CTA from "@/app/CTA";
import Features from "@/app/Features";
import Hero from "@/app/Hero";
import { NextPage } from "next";

import React from "react";

const Landing: NextPage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <CTA />
    </div>
  );
};

export default Landing;
