"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Step = {
  label: string;
  completed: boolean;
};

interface ProgressStepsProps {
  steps: Step[];
}

export default function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="flex flex-col space-y-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start">
          <div className="flex flex-col items-center mr-3">
            {step.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[#616C99] bg-[#020826CC]" />
            )}

            {i !== steps.length - 1 && (
              <div className="w-px flex-1 bg-[#616C99] mt-1" />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-0.5"
          >
            <p
              className={`text-sm ${
                step.completed ? "text-white font-medium" : "text-[#CCCCCC]"
              }`}
            >
              {step.label}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
