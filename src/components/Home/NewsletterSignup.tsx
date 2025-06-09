import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { motion } from "framer-motion";

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[linear-gradient(90deg,#7b0a24_0%,#a50e2e_100%)] py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
      style={{ boxShadow: "0 4px 15px rgba(165,14,46,0.6)" }}
    >
      <div className="font-extrabold text-white text-xl md:text-2xl tracking-wide text-center md:text-left leading-snug select-none">
        STAY UPTO DATE ABOUT
        <br />
        OUR LATEST OFFERS
      </div>

      <form
        className="flex gap-4 w-full max-w-lg md:w-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          type="email"
          variant="outlined"
          size="medium"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            flex: 1,
            input: {
              fontWeight: 500,
              fontSize: "1rem",
              color: "#4a4a4a",
              "&::placeholder": {
                color: "#9ca3af",
                opacity: 1,
              },
            },
            "& fieldset": {
              borderColor: "#ddd",
              transition: "border-color 0.3s ease",
              borderRadius: "12px",
            },
            "&:hover fieldset": {
              borderColor: "#a50e2e",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#a50e2e",
              boxShadow: "0 0 0 3px rgba(165,14,46,0.3)",
            },
          }}
        />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flexShrink: 0 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#7b0a24",
              fontWeight: 700,
              borderRadius: "12px",
              paddingX: 4,
              paddingY: 1.5,
              boxShadow: "0 4px 10px rgba(165,14,46,0.4)",
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f9f9f9",
                boxShadow: "0 6px 14px rgba(165,14,46,0.6)",
                color: "#a50e2e",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            Subscribe to Newsletter
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default NewsletterSignup;
