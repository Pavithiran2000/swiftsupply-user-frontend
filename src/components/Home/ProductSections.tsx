import React from "react";
import { MostPopular } from "./leftMain"; // adjust paths as needed
import { MiddleGrid } from "./MiddleGrid";
import { RightCardsVariant1 } from "./RightCards";

const ProductShowcase = () => {
  return (
    <section className="bg-gray-50 py-12 px-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center md:text-left">
        Discover your next business opportunity
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <MostPopular />
        <MiddleGrid />
        <RightCardsVariant1 />
      </div>
    </section>
  );
};

export default ProductShowcase;
