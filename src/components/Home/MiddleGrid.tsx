import React from "react";
import { motion } from "framer-motion";

const middleGridImages = [
  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&w=400&q=80",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=400&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=400&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&q=80",
];

export const MiddleGrid = () => {
  return (
    <div className="lg:col-span-5 bg-white rounded-lg p-6 shadow-lg flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold text-lg">
          New arrivals
        </h3>
        <button
          type="button"
          className="text-blue-600 text-sm font-semibold hover:underline transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
          aria-label="View more new arrivals"
        >
          View more
        </button>
      </div>

      <p
        className="text-gray-700 font-semibold text-base tracking-tight"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        119,000+ products added today
      </p>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 flex-grow">
        {middleGridImages.map((img, idx) => (
          <motion.div
            key={idx}
            className="rounded-lg overflow-hidden bg-gray-100 shadow-md cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.95 }}
            tabIndex={0}
            role="button"
            aria-label={`New arrival product image ${idx + 1}`}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img
              src={img}
              alt={`New arrival product ${idx + 1}`}
              className="w-full h-36 object-cover rounded-lg"
              loading="lazy"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>

      {/* New This Week Highlight */}
      <motion.div
        className="flex items-center gap-4 bg-yellow-50 rounded-lg p-4 shadow-md cursor-pointer select-none"
        whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(234,179,8,0.4)" }}
        whileTap={{ scale: 0.97 }}
        tabIndex={0}
        role="button"
        aria-label="New this week products from verified suppliers"
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <img
          src="https://images.unsplash.com/photo-1522770179533-24471fcdba45?ixlib=rb-4.0.3&w=80&q=80"
          alt="New this week"
          className="w-16 h-16 object-cover rounded-lg shadow-sm"
          loading="lazy"
          draggable={false}
        />
        <div>
          <h4 className="text-yellow-800 font-semibold text-lg tracking-tight select-text">
            New this week
          </h4>
          <p className="text-yellow-700 text-sm font-medium select-text">
            Products from Verified Suppliers only
          </p>
        </div>
      </motion.div>
    </div>
  );
};
