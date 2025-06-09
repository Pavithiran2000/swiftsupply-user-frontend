import React from "react";
import { motion } from "framer-motion";

const rightCardsData = [
  {
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&w=400&q=80",
    title: "180-day lowest price",
    badge: null,
  },
  {
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&w=80&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&w=80&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&w=80&q=80",
      "https://images.unsplash.com/photo-1495435229349-e86db7bfa013?ixlib=rb-4.0.3&w=80&q=80",
    ],
    title: "Deals on best sellers",
    badge: "20% off",
  },
];

export const RightCardsVariant1 = () => {
  return (
    <div className="lg:col-span-3 flex flex-col gap-8">
      {rightCardsData.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.25, duration: 0.6 }}
          whileHover={{ y: -10, boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}
          tabIndex={0}
          role="button"
          aria-label={card.title}
          className="bg-white rounded-xl p-6 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-28 object-cover rounded-xl mb-4 shadow-sm"
              loading="lazy"
            />
          )}
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-900">{card.title}</h4>
            {card.badge && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(45deg, #f97316, #ea580c)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
                aria-label={`Badge: ${card.badge}`}
              >
                {card.badge}
              </span>
            )}
          </div>
          {card.images && (
            <motion.div
              className="flex gap-3 mt-4 overflow-hidden"
              whileHover={{ x: "-15%" }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 8,
                ease: "easeInOut",
              }}
              aria-label="Best seller product images carousel"
            >
              {card.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Best seller ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-xl"
                  loading="lazy"
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
