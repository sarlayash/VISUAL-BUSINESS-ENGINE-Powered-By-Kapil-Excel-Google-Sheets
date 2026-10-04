import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ChartViewer } from './ChartViewer';
import { playClick, playSuccess } from '../utils/soundEffects';

export const AdminDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'content'>('analytics');
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Retail');
  const [newDifficulty, setNewDifficulty] = useState('Practitioner');
  const [newFormula, setNewFormula] = useState('=SUM(B2:B10)');
  const [publishedFeedback, setPublishedFeedback] = useState<string | null>(null);

  const moduleCompletionStats = [
    { label: 'Module 1 (Fundamentals)', value: 88, formatted: '88% Completion' },
    { label: 'Module 2 (Advanced Logic)', value: 74, formatted: '74% Completion' },
    { label: 'Module 3 (Lookups & Stats)', value: 62, formatted: '62% Completion' },
    { label: 'Module 4 (Pivot & Analytics)', value: 54, formatted: '54% Completion' },
    { label: 'Module 5 (Dashboards)', value: 41, formatted: '41% Completion' },
  ];

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallengeTitle.trim()) return;
    playSuccess();
    setPublishedFeedback(`Challenge "${newChallengeTitle}" published successfully to live curriculum!`);
    setNewChallengeTitle('');
    setTimeout(() => setPublishedFeedback(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              KAPIL / ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-gray-400">PRD Section 28 & 29</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Platform Administration & Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitor learner completion, hardest concepts, drop-offs, and author new simulation content.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#151722] p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              playClick();
              setActiveAdminTab('analytics');
            }}
            className={`px-4 py-2 rounded-lg transition ${
              activeAdminTab === 'analytics'
                ? 'bg-amber-500 text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics & Telemetry
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveAdminTab('content');
            }}
            className={`px-4 py-2 rounded-lg transition ${
              activeAdminTab === 'content'
                ? 'bg-amber-500 text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Content Studio (No-Code)
          </button>
        </div>
      </div>

      {activeAdminTab === 'analytics' ? (
        <div className="space-y-8">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Learners', value: '14,820', change: '+24% this month', icon: '👥' },
              { label: 'Active This Week', value: '3,450', change: '84% retention', icon: '⚡' },
              { label: 'Capstones Completed', value: '1,280', change: 'Visual Business Engineers', icon: '🏆' },
              { label: 'Certificates Verified', value: '4,912', change: 'Tamper-proof checks', icon: '🔍' },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-[#0f1118] border border-white/10 rounded-2xl p-5 shadow-lg space-y-1"
              >
                <div className="text-2xl mb-1">{metric.icon}</div>
                <span className="text-xs text-gray-400 font-medium block">{metric.label}</span>
                <span className="text-2xl font-bold text-white font-mono block">
                  {metric.value}
                </span>
                <span className="text-[11px] text-amber-400 font-medium">{metric.change}</span>
              </div>
            ))}
          </div>

          {/* Module Completion Chart & Hardest Concepts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChartViewer
                title="Curriculum Completion Funnel"
                subtitle="Percentage of learners passing each module's simulation validations"
                data={moduleCompletionStats}
                type="bar"
              />
            </div>

            {/* Hardest Concepts & Drop-Off Points (PRD Page 25) */}
            <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Hardest Concepts & Drop-Offs
              </h3>

              <div className="space-y-3">
                {[
                  {
                    concept: 'INDEX + MATCH Two-Way Matrix',
                    failRate: '42% initial fail rate',
                    hintUse: 'High hint usage (Hint 3 required)',
                  },
                  {
                    concept: 'Nested IFS vs Logical AND/OR',
                    failRate: '34% initial fail rate',
                    hintUse: 'Syntax parenthesis mismatch',
                  },
                  {
                    concept: 'PERCENTILE vs MEDIAN Skew',
                    failRate: '28% initial fail rate',
                    hintUse: 'Clarified with Kapil AI Mentor',
                  },
                  {
                    concept: 'SUMIFS sum_range positioning',
                    failRate: '22% initial fail rate',
                    hintUse: 'Excel vs Sheets argument order',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#141622] p-3 rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.concept}</span>
                      <span className="text-[10px] text-red-400 font-mono font-semibold">
                        {item.failRate}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">{item.hintUse}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CONTENT MANAGEMENT STUDIO (PRD Section 29) */
        <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" /> Author New Business Challenge
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Deploy new industry datasets, simulation rules, and 3-tier hints without touching code.
              </p>
            </div>
          </div>

          {publishedFeedback && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{publishedFeedback}</span>
            </div>
          )}

          <form onSubmit={handleCreateChallenge} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Challenge Title:</label>
                <input
                  type="text"
                  required
                  value={newChallengeTitle}
                  onChange={(e) => setNewChallengeTitle(e.target.value)}
                  placeholder="e.g. Dynamic Inventory Reorder Buffer"
                  className="w-full bg-[#151722] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Business Domain:</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-[#151722] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                >
                  <option>Retail</option>
                  <option>Banking</option>
                  <option>HR</option>
                  <option>Supply Chain</option>
                  <option>SaaS</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1 font-semibold">Difficulty Level:</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                  className="w-full bg-[#151722] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
                >
                  <option>Level 1 — Explorer</option>
                  <option>Level 2 — Practitioner</option>
                  <option>Level 3 — Analyst</option>
                  <option>Level 4 — Strategist</option>
                  <option>Level 5 — Business Architect</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1 font-semibold">
                Expected Formula Validation Logic:
              </label>
              <input
                type="text"
                value={newFormula}
                onChange={(e) => setNewFormula(e.target.value)}
                placeholder="e.g. =VLOOKUP(A2, Catalog!A:D, 3, FALSE)"
                className="w-full bg-[#151722] text-amber-300 font-mono p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider shadow-lg"
              >
                Publish Challenge to Production
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
