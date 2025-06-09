import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage1 from "../../assets/hero/homeImage1.webp";
import bgImage2 from "../../assets/hero/homeImage2.jpg";
import bgImage3 from "../../assets/hero/homeImage3.jpg";

const bgImages = [bgImage1, bgImage2, bgImage3];

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1111.25 3a7.5 7.5 0 015.4 13.65z"
    />
  </svg>
);

const HeroBanner: React.FC = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Change background every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[520px] flex items-center overflow-visible">
      {/* AnimatePresence for fading backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          className="absolute inset-0 bg-black/50"
          style={{
            backgroundImage: `url(${bgImages[currentBgIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.6)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlay to darken */}
      <div className="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 flex flex-col items-center text-center select-none">
        <motion.div
          className="bg-white/90 px-6 py-2 rounded-xl mb-6 w-fit shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="font-medium text-gray-700 tracking-wide">
            Learn about SwiftSupply
          </span>
        </motion.div>

        <motion.h1
          className="text-white text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Sri Lanka’s premier B2B e-commerce platform
          <br />
          for seamless wholesale and retail trade
        </motion.h1>

        <motion.form
          className="w-full max-w-2xl flex rounded-xl overflow-hidden bg-white/30 backdrop-blur-md border border-white/50 shadow-lg mb-8"
          role="search"
          aria-label="Search products"
          onSubmit={(e) => e.preventDefault()}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <input
            className="flex-1 py-4 px-6 text-gray-900 placeholder-gray-600 outline-none bg-transparent text-lg min-h-[48px]"
            placeholder="Search products like Black Shirts"
            aria-label="Search products"
            type="search"
            name="search"
            autoComplete="off"
          />
          <motion.button
            type="submit"
            className="bg-[maroon] hover:bg-[#7b0a24cc] transition-colors px-8 py-4 text-white font-semibold text-lg flex items-center gap-3 rounded-r-xl"
            aria-label="Search"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <SearchIcon />
            Search
          </motion.button>
        </motion.form>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.8,
              },
            },
          }}
        >
          {["denim tears", "moissanite watches", "Table sets"].map((tag) => (
            <motion.button
              key={tag}
              type="button"
              className="px-5 py-1 bg-gray-200 text-sm rounded-full text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              aria-label={`Search tag: ${tag}`}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
