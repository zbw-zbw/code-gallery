"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/shared/SectionTitle";
import { PAIN_POINTS } from "@/lib/constants";
import Icon from "@/components/shared/Icon";

export default function PainPointSection() {
  return (
    <section className="py-24 md:py-32 bg-gallery-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          title="代码的困境"
          subtitle="理解代码最难的不是语法，而是「这段代码到底在做什么」"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PAIN_POINTS.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group bg-gallery-bg rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-code-purple mb-5">
                <Icon name={point.icon} size={40} />
              </div>
              <h3 className="text-xl font-bold text-gallery-black mb-3">
                {point.title}
              </h3>
              <p className="text-base text-gallery-gray leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
