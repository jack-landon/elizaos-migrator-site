"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function ReusableModal({
  isOpen,
  onClose,
  children,
  className = "",
}: ReusableModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      handleClose();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  const handleBackdropClick = () => {
    handleClose();
  };

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ease-out ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto transition-all duration-200 ease-out ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
