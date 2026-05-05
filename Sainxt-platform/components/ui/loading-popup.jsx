// Create this as a separate component: components/ui/loading-popup.jsx

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export const LoadingPopup = ({ isOpen, title, description }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Popup Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl w-[600px] max-w-[90vw] mx-4">
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5E3A] mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-center font-semibold">
            {title || "Loading..."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
            {description || "Please wait..."}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
