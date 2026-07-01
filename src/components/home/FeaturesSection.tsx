"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/shared/SectionTitle";
import { FEATURES } from "@/lib/constants";
import Icon from "@/components/shared/Icon";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-gallery-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          title="三种可视化，一键生成"
          subtitle=""
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group bg-gallery-bg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Diagram area */}
              <div className="h-[200px] bg-gallery-white flex items-center justify-center p-6">
                {index === 0 && <FlowAnimationDiagram />}
                {index === 1 && <ArchitectureDiagram />}
                {index === 2 && <EmbedDiagram />}
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="text-code-purple mb-3">
                  <Icon name={feature.icon} size={32} />
                </div>
                <h3 className="text-xl font-bold text-gallery-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-base text-gallery-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowAnimationDiagram() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {[
        { label: "step1", color: "bg-code-purple" },
        { label: "step2", color: "bg-flow-blue" },
        { label: "step3", color: "bg-data-green" },
      ].map((step, i) => (
        <div key={step.label} className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className={`w-12 sm:w-16 h-10 sm:h-12 ${step.color} rounded-lg flex items-center justify-center text-white text-[10px] sm:text-xs font-mono`}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            {step.label}
          </motion.div>
          {i < 2 && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              aria-hidden="true"
              className="animate-flow-line"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="relative w-[180px] h-[140px]">
      {/* Root node */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-code-purple flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-3 h-3 rounded-full bg-white" />
      </motion.div>

      {/* Level 2 nodes */}
      {[
        { className: "absolute top-16 left-2", delay: 0.2 },
        { className: "absolute top-16 left-1/2 -translate-x-1/2", delay: 0.4 },
        { className: "absolute top-16 right-2", delay: 0.6 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className={`${node.className} w-8 h-8 rounded-full bg-flow-blue flex items-center justify-center`}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: node.delay, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
      ))}

      {/* Level 3 nodes */}
      <motion.div
        className="absolute bottom-0 left-8 w-6 h-6 rounded-full bg-data-green flex items-center justify-center"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-8 w-6 h-6 rounded-full bg-data-green flex items-center justify-center"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "easeInOut" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </motion.div>

      {/* Lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 180 140"
        fill="none"
        aria-hidden="true"
      >
        <line x1="90" y1="10" x2="30" y2="60" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="90" y1="10" x2="90" y2="60" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="90" y1="10" x2="150" y2="60" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="30" y1="68" x2="40" y2="130" stroke="#e5e7eb" strokeWidth="2" />
        <line x1="150" y1="68" x2="140" y2="130" stroke="#e5e7eb" strokeWidth="2" />
      </svg>
    </div>
  );
}

function EmbedDiagram() {
  return (
    <div className="w-[200px] h-[120px] rounded-xl bg-gallery-bg flex flex-col items-center justify-center gap-2">
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </motion.svg>
      <span className="text-xs text-gallery-gray font-mono">&lt;/&gt; embed</span>
    </div>
  );
}
