import React, { useState } from 'react';
import {
  BarChart2,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Users,
  Code,
  DollarSign,
  Cloud,
  Layers,
  Database,
  Lock,
} from 'lucide-react';
import { UserProfile, BusinessIntelligenceIndexItem } from '../types';
import { BUSINESS_INTELLIGENCE_INDEX } from '../data/businessIntelligenceIndexData';
import { playClick, playSuccess } from '../utils/soundEffects';

interface BusinessIntelligenceIndexViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateTab?: (tab: string) => void;
}

export const BusinessIntelligenceIndexView: React.FC<BusinessIntelligenceIndexViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recommendationFilter, setRecommendationFilter] = useState<string>('All');

  const acknowledgedList = userProfile.acknowledgedBiIndex || [];

  // Toggle acknowledge
  const handleToggleAcknowledge = (id: string) => {
    playClick();
    let nextList: string[];
    let xpGain = 0;

    if (acknowledgedList.includes(id)) {
      nextList = acknowledgedList.filter((item) => item !== id);
    } else {
      nextList = [...acknowledgedList, id];
      xpGain = 30;
      playSuccess();
    }

    onUpdateProfile({
      ...userProfile,
      acknowledgedBiIndex: nextList,
      xp: userProfile.xp + xpGain,
    });
  };

  const handleAcknowledgeAll = () => {
    playSuccess();
    const allIds = BUSINESS_INTELLIGENCE_INDEX.map((item) => item.id);
    const unacknowledgedCount = allIds.filter((id) => !acknowledgedList.includes(id)).length;

    onUpdateProfile({
      ...userProfile,
      acknowledgedBiIndex: allIds,
      xp: userProfile.xp + unacknowledgedCount * 30,
    });
  };

  // Categories list
  const categories = ['All', ...Array.from(new Set(BUSINESS_INTELLIGENCE_INDEX.map((b) => b.category)))];

  // Filtering
  const filteredItems = BUSINESS_INTELLIGENCE_INDEX.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dimension.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kapilArchitecturalAnalysis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesRec =
      recommendationFilter === 'All' || item.enterpriseRecommendation === recommendationFilter;

    return matchesSearch && matchesCategory && matchesRec;
  });

  // Aggregate Scores
  const excelTotal = BUSINESS_INTELLIGENCE_INDEX.reduce((acc, curr) => acc + curr.excelScore, 0);
  const sheetsTotal = BUSINESS_INTELLIGENCE_INDEX.reduce((acc, curr) => acc + curr.sheetsScore, 0);
  const excelAvg = (excelTotal / BUSINESS_INTELLIGENCE_INDEX.length).toFixed(1);
  const sheetsAvg = (sheetsTotal / BUSINESS_INTELLIGENCE_INDEX.length).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-gray-200 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121424] via-[#090a12] to-[#1a1426] border-2 border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              <span>📊 STRATEGIC ENTERPRISE BENCHMARK</span>
              <span>•</span>
              <span>EVALUATED BY KAPIL</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Business Intelligence Index (BII)
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
              Architectural capability index comparing <strong className="text-emerald-400">Microsoft Excel</strong> and{' '}
              <strong className="text-blue-400">Google Sheets</strong> across 10 mission-critical enterprise dimensions.
            </p>
          </div>

          {/* Quick acknowledge summary */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="bg-[#141624] border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Index Mastery:</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {acknowledgedList.length} / {BUSINESS_INTELLIGENCE_INDEX.length} Acknowledged
                </span>
              </div>
              {acknowledgedList.length < BUSINESS_INTELLIGENCE_INDEX.length && (
                <button
                  onClick={handleAcknowledgeAll}
                  className="px-3 py-1.5 rounded-xl gold-gradient-btn text-black font-extrabold text-[11px] uppercase tracking-wider transition active:scale-95"
                >
                  Acknowledge All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Global Aggregate Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="bg-[#0f111a] border border-emerald-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Microsoft Excel Index</span>
              <span className="text-xs font-mono text-gray-400">10 Dimensions</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-300">{excelAvg}</span>
              <span className="text-xs text-gray-400">/ 100 Overall</span>
            </div>
            <p className="text-xs text-gray-400">
              Supreme on local xVelocity memory, Power Query ETL, complex quantitative solver modeling, and desktop compute.
            </p>
          </div>

          <div className="bg-[#0f111a] border border-blue-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Google Sheets Index</span>
              <span className="text-xs font-mono text-gray-400">10 Dimensions</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-blue-300">{sheetsAvg}</span>
              <span className="text-xs text-gray-400">/ 100 Overall</span>
            </div>
            <p className="text-xs text-gray-400">
              Unrivaled on real-time multi-user concurrency, Filter Views, BigQuery Connected Sheets, and serverless Apps Script.
            </p>
          </div>

          <div className="bg-[#0f111a] border border-purple-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Strategic Recommendation</span>
              <span className="text-xs font-mono text-amber-400">C-Suite Guideline</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">Hybrid Architecture</div>
            <p className="text-xs text-gray-300">
              Top FAANG firms deploy Google Sheets for collaborative live operational pipelines and Excel for heavy quantitative financial modeling.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c0d16] border border-white/5 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by dimension, capability, or architectural verdict..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141624] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Recommendation filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-gray-400 font-mono shrink-0">Verdict:</span>
            <select
              value={recommendationFilter}
              onChange={(e) => setRecommendationFilter(e.target.value)}
              className="bg-[#141624] text-white text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 w-full md:w-auto"
            >
              <option value="All">All Verdicts</option>
              <option value="Microsoft Excel">Microsoft Excel Favored</option>
              <option value="Google Sheets">Google Sheets Favored</option>
              <option value="Hybrid Architecture">Hybrid Architecture</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Index Comparison Cards Grid */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          const isAck = acknowledgedList.includes(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-6 transition-all space-y-6 ${
                isAck
                  ? 'bg-[#0f111a] border-emerald-500/30 shadow-lg'
                  : 'bg-[#0c0d16] border-white/5 hover:border-amber-500/30'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                        item.enterpriseRecommendation === 'Microsoft Excel'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : item.enterpriseRecommendation === 'Google Sheets'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      Verdict: {item.enterpriseRecommendation}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <span className="text-xs text-gray-400 font-mono">Dimension: {item.dimension}</span>
                </div>

                <button
                  onClick={() => handleToggleAcknowledge(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 ${
                    isAck
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#151724] hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isAck ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span>{isAck ? 'Acknowledged (+30 XP)' : 'Mark as Acknowledged'}</span>
                </button>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Excel Column */}
                <div className="bg-[#111420] border border-emerald-500/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      <h4 className="text-sm font-bold text-white">Microsoft Excel</h4>
                    </div>
                    <span className="text-lg font-black font-mono text-emerald-400">
                      {item.excelScore} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.excelScore}%` }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                      Key Strengths:
                    </span>
                    <ul className="space-y-1 text-gray-300 list-disc list-inside">
                      {item.excelStrengths.map((str, sIdx) => (
                        <li key={sIdx}>{str}</li>
                      ))}
                    </ul>

                    <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block pt-2">
                      Known Bottlenecks:
                    </span>
                    <ul className="space-y-1 text-gray-400 list-disc list-inside">
                      {item.excelLimitations.map((lim, lIdx) => (
                        <li key={lIdx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Google Sheets Column */}
                <div className="bg-[#111420] border border-blue-500/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-400" />
                      <h4 className="text-sm font-bold text-white">Google Sheets</h4>
                    </div>
                    <span className="text-lg font-black font-mono text-blue-400">
                      {item.sheetsScore} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.sheetsScore}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                      Key Strengths:
                    </span>
                    <ul className="space-y-1 text-gray-300 list-disc list-inside">
                      {item.sheetsStrengths.map((str, sIdx) => (
                        <li key={sIdx}>{str}</li>
                      ))}
                    </ul>

                    <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block pt-2">
                      Known Bottlenecks:
                    </span>
                    <ul className="space-y-1 text-gray-400 list-disc list-inside">
                      {item.sheetsLimitations.map((lim, lIdx) => (
                        <li key={lIdx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Kapil's Strategic Architectural Analysis Callout */}
              <div className="bg-[#141624] border-l-4 border-amber-400 p-4 rounded-r-xl space-y-1">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kapil's Architectural Verdict:</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic">
                  "{item.kapilArchitecturalAnalysis}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
