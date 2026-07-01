"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CODE_TEMPLATES, CodeTemplate } from "@/lib/codeTemplates";
import { Language } from "@/types";

interface CodeTemplatesProps {
  onSelect: (code: string, language: Language) => void;
  visible: boolean;
}

export default function CodeTemplates({ onSelect, visible }: CodeTemplatesProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-3 bg-code-surface/50">
            <p className="text-[11px] text-gallery-gray mb-2 mt-1">快速模板</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CODE_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template.code, template.language)}
                  className="group flex items-start gap-2 p-2.5 rounded-lg bg-code-bg/60 hover:bg-code-bg border border-transparent hover:border-code-purple/30 transition-all duration-200 text-left"
                  title={template.description}
                >
                  <span className="text-base flex-shrink-0 leading-none mt-0.5">{template.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-code-text truncate group-hover:text-code-purple-light transition-colors">
                      {template.title}
                    </p>
                    <p className="text-[10px] text-gallery-gray truncate mt-0.5">
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type { CodeTemplate };
