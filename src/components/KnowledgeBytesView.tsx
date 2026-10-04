import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Check,
  Search,
  Filter,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, KnowledgeByte } from '../types';
import { KNOWLEDGE_BYTES_DATA } from '../data/knowledgeBytesData';
import {
  toggleKnowledgeByteAcknowledged,
  acknowledgeAllKnowledgeBytes,
} from '../utils/storage';
import { playClick, playSuccess } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface KnowledgeBytesViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const KnowledgeBytesView: React.FC<KnowledgeBytesViewProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const acknowledgedIds = useMemo(() => {
    return new Set(userProfile.acknowledgedBytes || []);
  }, [userProfile.acknowledgedBytes]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    KNOWLEDGE_BYTES_DATA.forEach((kb) => set.add(kb.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered knowledge bytes
  const filteredBytes = useMemo(() => {
    return KNOWLEDGE_BYTES_DATA.filter((kb) => {
      const matchCat = selectedCategory === 'All' || kb.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        kb.topic.toLowerCase().includes(query) ||
        kb.sheetsPerspective.toLowerCase().includes(query) ||
        kb.excelPerspective.toLowerCase().includes(query) ||
        kb.kapilVerdict.toLowerCase().includes(query) ||
        String(kb.number).includes(query);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalCount = KNOWLEDGE_BYTES_DATA.length; // 50
  const acknowledgedCount = acknowledgedIds.size;
  const progressPercent = Math.round((acknowledgedCount / totalCount) * 100);

  // Toggle single acknowledgment
  const handleToggleAcknowledge = (byteId: string) => {
    playClick();
    const updated = toggleKnowledgeByteAcknowledged(byteId);
    if (updated) {
      onUpdateProfile(updated);
      if (!acknowledgedIds.has(byteId)) {
        playSuccess();
      }
    }
  };

  // Batch acknowledge all 50
  const handleAcknowledgeAll = () => {
    playSuccess();
    const allIds = KNOWLEDGE_BYTES_DATA.map((kb) => kb.id);
    const updated = acknowledgeAllKnowledgeBytes(allIds);
    if (updated) {
      onUpdateProfile(updated);
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#FFFFFF', '#60A5FA'],
        });
      } catch (e) {}
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              KNOWLEDGE BYTES • OFFICIAL COMPARATIVE ARCHITECTURE
            </span>
            <span className="text-xs text-gray-400">50 In-Depth Architectural Differences</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            50 Differences: Google Sheets vs Microsoft Excel
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Master tool independence. Study each comparative byte and click "Acknowledge" to record your comprehension.
          </p>
        </div>

        {/* Batch Acknowledge Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAcknowledgeAll}
            className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4 fill-black" />
            <span>Acknowledge All (50 Bytes)</span>
          </button>
        </div>
      </div>

      {/* ================= ACKNOWLEDGMENT PROGRESS BAR WIDGET ================= */}
      <div className="bg-[#0f111a] p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-white uppercase tracking-wider">
              Your Knowledge Byte Comprehension Progress:
            </span>
          </div>
          <span className="text-amber-400 font-mono text-sm font-bold">
            {acknowledgedCount} of {totalCount} Acknowledged ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-3 bg-[#151724] rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
          <span>Each acknowledged byte grants +30 XP towards your level progression.</span>
          <span className="text-emerald-400 font-semibold font-mono">
            {acknowledgedCount === 50 ? '🎉 100% Dual Mastery Achieved!' : 'Click any card to acknowledge'}
          </span>
        </div>
      </div>

      {/* ================= SEARCH & CATEGORY FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across 50 differences (e.g. QUERY, VBA, BigQuery, XLOOKUP)..."
            className="w-full bg-[#121422] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow font-bold'
                  : 'bg-[#151724] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'All' ? 'All (50)' : cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 50 CARDS GRID ================= */}
      <div className="space-y-4">
        <div className="text-xs text-gray-400 font-mono">
          Showing {filteredBytes.length} of {totalCount} Knowledge Bytes
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBytes.map((byte) => {
            const isAck = acknowledgedIds.has(byte.id);

            return (
              <div
                key={byte.id}
                className={`rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                  isAck
                    ? 'bg-[#0c1418] border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.1)]'
                    : 'bg-[#0f111a] border-white/10 hover:border-amber-500/30 shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                        #{byte.number}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#181a28] text-gray-400 border border-white/5 truncate max-w-[200px]">
                        {byte.category}
                      </span>
                    </div>

                    {/* Winner Tag */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        byte.winnerRecommendation === 'Google Sheets'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : byte.winnerRecommendation === 'Microsoft Excel'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      ★ {byte.winnerRecommendation}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{byte.topic}</h3>

                  {/* Dual Platform Comparison Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Google Sheets Side */}
                    <div className="bg-[#121626] p-3 rounded-xl border border-blue-500/20 space-y-1">
                      <div className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1 font-mono">
                        <span>🌐 Google Sheets</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-[11px]">
                        {byte.sheetsPerspective}
                      </p>
                    </div>

                    {/* Microsoft Excel Side */}
                    <div className="bg-[#121d1e] p-3 rounded-xl border border-emerald-500/20 space-y-1">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1 font-mono">
                        <span>📊 Microsoft Excel</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-[11px]">
                        {byte.excelPerspective}
                      </p>
                    </div>
                  </div>

                  {/* Business Impact Note */}
                  <div className="text-xs text-gray-400 bg-[#080910] p-2.5 rounded-xl border border-white/5">
                    <strong className="text-gray-300">Operational Impact: </strong>
                    <span>{byte.businessImpact}</span>
                  </div>

                  {/* Kapil's Strategic Verdict */}
                  <div className="text-xs text-amber-200/90 bg-[#161412] p-3 rounded-xl border border-amber-500/30 space-y-0.5">
                    <div className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kapil's Strategic Verdict:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{byte.kapilVerdict}</p>
                  </div>
                </div>

                {/* Card Action: Acknowledge Button */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-500">
                    {isAck ? 'Comprehension recorded (+30 XP)' : 'Pending acknowledgment'}
                  </span>

                  <button
                    onClick={() => handleToggleAcknowledge(byte.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                      isAck
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'gold-gradient-btn text-black shadow-md'
                    }`}
                  >
                    {isAck ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Acknowledged ✓</span>
                      </>
                    ) : (
                      <>
                        <span>Acknowledge Byte</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
