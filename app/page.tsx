import CTA from "@/app/CTA";
import Features from "@/app/Features";
import Hero from "@/app/Hero";
//import export default function first(second) { third }
import { NextPage } from "next";
import React from "react";
import About from "@/app/About";
import Header from "@/app/Header";

const Landing: NextPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <CTA />
      <About />
    </div>
  );
};

export default Landing;
