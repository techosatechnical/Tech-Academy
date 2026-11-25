'use client';

import React, { useState } from 'react';
import { FAQItem } from '@/types';
import { ChevronDown } from 'lucide-react';

interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg bg-white overflow-hidden transition-all duration-200 shadow-xs"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-theme-navy hover:text-theme-primary transition-colors focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-theme-primary" />
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-theme-primary' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-theme-surface">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
