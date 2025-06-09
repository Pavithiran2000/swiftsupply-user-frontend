import React, { useRef, useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      text: "I'm thoroughly impressed with the efficiency and quality of this platform. The wide variety of products, transparent pricing, and quick bulk orders have made my sourcing so much easier.",
      verified: true,
    },
    {
      id: 2,
      name: "Alex K.",
      rating: 5,
      text: "SwiftSupply has completely transformed our procurement process. The platform makes reaching out to reliable suppliers effortless, and the quality recommendations are spot on.",
      verified: true,
    },
    {
      id: 3,
      name: "James L.",
      rating: 5,
      text: "The customer service team is exceptionally helpful and responsive. They go above and beyond to ensure our business needs are met with professionalism and care.",
      verified: true,
    },
    {
      id: 4,
      name: "Maria S.",
      rating: 5,
      text: "Outstanding platform for B2B trading. The user interface is intuitive, the supplier verification process is thorough, and the bulk pricing options are very competitive.",
      verified: true,
    },
  ];

  const doubleTestimonials = [...testimonials, ...testimonials];
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [manualPause, setManualPause] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let rafId: number;
    const scrollSpeed = 0.5;

    const step = () => {
      if (!isHovered && !manualPause) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered, manualPause]);

  const scrollDistance = 344;

  const scrollBy = (distance: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const maxScrollLeft = container.scrollWidth / 2;
    let newScrollPos = container.scrollLeft + distance;

    if (newScrollPos < 0) {
      container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    } else if (newScrollPos > maxScrollLeft) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: distance, behavior: "smooth" });
    }

    setManualPause(true);
    setTimeout(() => setManualPause(false), 3000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-16 bg-gray-50"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          OUR HAPPY CUSTOMERS
        </h2>

        <div className="relative max-w-[1200px] mx-auto">
          {/* Left button */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full p-2 w-10 h-10 flex items-center justify-center absolute top-1/2 -left-6 -translate-y-1/2 z-10 bg-white shadow-md cursor-pointer"
            onClick={() => scrollBy(-scrollDistance)}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.div>

          {/* Right button */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full p-2 w-10 h-10 flex items-center justify-center absolute top-1/2 -right-6 -translate-y-1/2 z-10 bg-white shadow-md cursor-pointer"
            onClick={() => scrollBy(scrollDistance)}
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.div>

          {/* Scroll container */}
          <div
            ref={containerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide  border-gray-300 py-4 rounded-md relative max-w-[1100px] mx-auto px-2 sm:px-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ scrollBehavior: "smooth" }}
          >
            {doubleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                className="flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-sm cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        aria-label="Star"
                      />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="ml-2 text-green-600 text-xs select-none">✓ Verified</span>
                  )}
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">{testimonial.name}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollbar hide CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 640px) {
          /* Reposition scroll buttons on mobile */
          .-left-6 {
            left: 8px !important;
          }
          .-right-6 {
            right: 8px !important;
          }
          /* Add extra padding on scroll container */
          .max-w-[1100px] {
            max-width: 100% !important;
          }
          .px-2 {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default TestimonialsSection;
