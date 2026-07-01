"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/shared/SectionTitle";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-gallery-bg">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          title="三步，从代码到图解"
          subtitle=""
        />

        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-code-purple/20 via-code-purple/30 to-code-purple/20" aria-hidden="true">
            <motion.div
              className="h-full bg-code-purple/40"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={step.number} className="flex-1 flex flex-col items-center text-center relative z-10">
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
                {/* Step number badge */}
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gallery-white shadow-md flex items-center justify-center mb-4 text-2xl font-black text-code-purple"
                  whileHover={{ scale: 1.05 }}
                >
                  {step.number}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gallery-black mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gallery-gray leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow between steps - desktop only */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-7 -right-2 w-4 h-4 items-center justify-center text-gallery-gray/40 z-20" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
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
