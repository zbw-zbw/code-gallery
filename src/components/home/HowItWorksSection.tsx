"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/shared/SectionTitle";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-gallery-bg">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          title="三步，从代码到图解"
          subtitle=""
        />

        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={step.number} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connector line */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gallery-border" />
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="flex flex-col items-center"
              >
                {/* Step number */}
                <div className="text-5xl md:text-6xl font-black text-code-purple/20 mb-4">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gallery-black mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gallery-gray leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>

              {/* Mobile arrow */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="md:hidden mt-6 mb-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
