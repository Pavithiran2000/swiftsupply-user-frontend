import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MostPopular = () => {
  const leftMain = {
    title: "Most popular",
    name: "Plastic Clothes Bag",
    popularity: 3.9,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&w=400&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&w=400&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=400&q=80",
    ],
  };

  const [activeThumb, setActiveThumb] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prevImage = () => {
    setActiveThumb((prev) => (prev === 0 ? leftMain.images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setActiveThumb((prev) => (prev === leftMain.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="relative lg:col-span-4 bg-white rounded-lg p-6 shadow-lg flex flex-col space-y-5 select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 text-lg drop-shadow-sm tracking-wide">
          {leftMain.title}
        </h3>
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
          aria-label="View more most popular products"
        >
          View more
        </button>
      </div>

      <p className="text-base text-gray-700 font-semibold tracking-tight">{leftMain.name}</p>

      <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeThumb}
            src={leftMain.images[activeThumb]}
            alt={`${leftMain.name} image ${activeThumb + 1}`}
            className="w-full h-64 object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            loading="lazy"
            draggable={false}
          />
        </AnimatePresence>

        <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-semibold text-gray-800 shadow-md select-none">
          Popularity score: {leftMain.popularity}
        </div>

        {hovered && (
          <>
            <motion.button
              key="prev"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-700 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              key="next"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              onClick={nextImage}
              aria-label="Next image"
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-700 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}
      </div>

      <div className="relative flex justify-center items-center space-x-4 mt-4">
        <div className="absolute top-1/2 -translate-y-1/2 w-40 h-3 bg-gray-200 rounded-full opacity-50 pointer-events-none"></div>

        {leftMain.images.map((img, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveThumb(idx)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
              idx === activeThumb
                ? "border-blue-600 shadow-lg scale-110 z-10"
                : "border-transparent"
            }`}
            aria-label={`Select image ${idx + 1}`}
            {...(idx === activeThumb ? { "aria-current": "true" } : {})}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={img}
              alt={`${leftMain.name} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
