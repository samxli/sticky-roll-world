import React, { useState } from 'react';
import { X, CheckCircle, Circle, Trees, Building2, Snowflake, Sun, Palmtree, Sparkles, Footprints, Users } from 'lucide-react';
import { BiomeType, ObjectCategory, ObjectDefinition, StuckObjectInfo } from '../types';
import { OBJECT_DEFINITIONS } from '../game/models';
import { formatBallSize } from '../utils/formatters';

interface CatalogModalProps {
  stuckObjects: StuckObjectInfo[];
  onClose: () => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({ stuckObjects, onClose }) => {
  const [selectedBiome, setSelectedBiome] = useState<BiomeType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ObjectCategory | 'all'>('all');

  // Set of names collected
  const collectedNames = new Set(stuckObjects.map((s) => s.name));

  const filtered = OBJECT_DEFINITIONS.filter((item) => {
    const matchesBiome = selectedBiome === 'all' || item.biome === selectedBiome;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesBiome && matchesCategory;
  });

  const totalDiscovered = OBJECT_DEFINITIONS.filter((item) => collectedNames.has(item.name)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Cosmic Item Catalog</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Discovered {totalDiscovered} / {OBJECT_DEFINITIONS.length} world objects
            </p>
          </div>
          <button
            id="close-catalog-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedCategory === 'all' ? 'bg-slate-100 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('animal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              selectedCategory === 'animal' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Animals</span>
          </button>
          <button
            onClick={() => setSelectedCategory('person')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              selectedCategory === 'person' ? 'bg-sky-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>People</span>
          </button>
          <button
            onClick={() => setSelectedCategory('object')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedCategory === 'object' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Objects & Props
          </button>
        </div>

        {/* Biome Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedBiome('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedBiome === 'all'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>All Biomes</span>
          </button>
          <button
            onClick={() => setSelectedBiome('snow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedBiome === 'snow'
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>Snow World</span>
          </button>
          <button
            onClick={() => setSelectedBiome('city')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedBiome === 'city'
                ? 'bg-indigo-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>City World</span>
          </button>
          <button
            onClick={() => setSelectedBiome('forest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedBiome === 'forest'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Forest World</span>
          </button>
          <button
            onClick={() => setSelectedBiome('desert')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedBiome === 'desert'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Desert World</span>
          </button>
          <button
            onClick={() => setSelectedBiome('beach')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedBiome === 'beach'
                ? 'bg-teal-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Palmtree className="w-3.5 h-3.5" />
            <span>Beach World</span>
          </button>
        </div>

        {/* Objects Grid */}
        <div className="overflow-y-auto pr-1 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filtered.map((item: ObjectDefinition) => {
            const isCollected = collectedNames.has(item.name);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isCollected
                    ? 'bg-slate-800/80 border-emerald-500/40 text-white'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner shrink-0"
                    style={{ backgroundColor: `${item.color}25`, color: item.color }}
                  >
                    {item.name.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                      <span>{item.name}</span>
                      {item.category === 'animal' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">Animal</span>
                      )}
                      {item.category === 'person' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-medium">Person</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Req: <strong className="text-emerald-300">{formatBallSize(item.baseRadius * 1.5)}</strong></span>
                      <span>•</span>
                      <span className="text-amber-300 font-medium">+{item.points} pts</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isCollected ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
