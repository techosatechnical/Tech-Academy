'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrganisation } from '@/context/OrganisationContext';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Image as ImageIcon } from 'lucide-react';

export const GalleryGrid: React.FC = () => {
  const { gallery, organisation } = useOrganisation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredImages =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((g) => g.category === selectedCategory);

  return (
    <section className="py-16 sm:py-20 bg-theme-surface border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Campus Life & Facilities"
          title={`Inside ${organisation.name}`}
          description="Take a visual tour through our modern classrooms, doubt desks, laboratory demonstrations, and achiever celebrations."
        />

        {/* Categories */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
                <Image
                  src={img.imageUrl}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {img.category}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 truncate">{img.title}</h4>
                <ImageIcon className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
