import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Business Services', icon: '🏢' },
  { name: 'Apparel & Accessories', icon: '👕' },
  { name: 'Home & Garden', icon: '🏠' },
  { name: 'Machinery', icon: '⚙️' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Health & Medicine', icon: '💊' },
  { name: 'Food & Beverage', icon: '🍽️' },
  { name: 'Packaging & Printing', icon: '📦' },
  { name: 'Automotive', icon: '🚗' },
  { name: 'Chemicals', icon: '🧪' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
  hover: { scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.12)' },
};

const iconVariants = {
  hover: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.6, repeat: Infinity },
  },
};

const CategoryCarousel = () => {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-6">
          <h2 className="text-3xl font-bold text-gray-800 max-w-xl">
            Explore millions of offerings tailored<br />
            to your business needs
          </h2>
          <div className="text-right min-w-[100px]">
            <div className="text-3xl font-bold text-red-600">200K+</div>
            <div className="text-sm text-gray-600">suppliers</div>
            <div className="text-3xl font-bold text-red-600 mt-2">2K+</div>
            <div className="text-sm text-gray-600">buyers</div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg cursor-pointer text-center"
              variants={cardVariants}
              whileHover="hover"
              tabIndex={0} // for keyboard focus
              role="button"
              aria-label={`Explore category ${category.name}`}
            >
              <motion.div
                className="text-4xl mb-3"
                variants={iconVariants}
                aria-hidden="true"
              >
                {category.icon}
              </motion.div>
              <h3 className="font-medium text-gray-800 text-sm leading-tight">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
