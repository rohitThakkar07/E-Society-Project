import React from "react";
import { motion } from "framer-motion";
import societyConfig from "../assets/societyConfig";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900">
      {/* Animated Logo or Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="mb-8"
      >
        <div className="h-20 w-20 bg-blue-600 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.5)] flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </motion.div>

      {/* Modern Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-700"></div>
        <div className="absolute h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-xs"
      >
        {societyConfig.name}
      </motion.p>
    </div>
  );
};

export default LoadingScreen;