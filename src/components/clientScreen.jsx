'use client';

import React from "react";
import { motion } from "framer-motion";

export default function ClientScreen({ children }) {
  return (
    <main>
      <motion.div
        id="main-page"
        className="md:ml-64 pl-2.5 md:pl-5 py-2.5 pr-2.5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </main>
  );
}
