import React from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  ChevronRight,
  Star,
  ExternalLink,
  Clock,
  Code,
} from 'lucide-react';
import { UserProfile, ModuleInfo } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { playClick } from '../utils/soundEffects';

interface DashboardViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string, meta?: any) => void;
  onSelectChallenge: (challengeId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onNavigateTab,
  onSelectChallenge,
}) => {
  const totalChallenges = MODULES_DATA.reduce((acc, m) => acc + m.challenges.length, 0);
  const solvedCount = userProfile.completedChallenges.length;
  const overallPercent = Math.min(100, Math.round((solvedCount / totalChallenges) * 80 + (userProfile.capstoneCompleted ? 20 : 0)));

  const personaTitles: { [key: string]: { title: string; subtitle: string; icon: string } } = {
    Explorer: { title: 'Data Executive', subtitle: 'Mastering data cleaning & fundamentals', icon: '🌱' },
    Practitioner: { title: 'Business Analyst', subtitle: 'Building logical formulas & condition models', icon: '⚡' },
    Analyst: { title: 'Data Intelligence Specialist', subtitle: 'Deploying lookups & statistical engines', icon: '🔍' },
    Strategist: { title: 'Business Intelligence Analyst', subtitle: 'Crafting pivot summaries & multi-channel analytics', icon: '📊' },
    'Business Architect': { title: 'Dashboard Architect', subtitle: 'Designing C-Suite executive control towers', icon: '🏛️' },
    'Visual Business Engineer': { title: 'Visual Business Engineer', subtitle: 'Complete 30-hour mastery certified', icon: '🏆' },
  };

  const currentPersona = personaTitles[userProfile.level] || personaTitles.Analyst;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* ================= HERO WELCOME BANNER (PRD Page 6) ================= */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#121420] via-[#0e1017] to-[#161824] border border-amber-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                SARLAYASH MISSION PRESENTS
              </span>
              <span className="text-xs text-gray-400">• Powered by Kapil</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, <span className="gold-gradient-text">{userProfile.name}</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl">
              Your Business Analytics Journey: From spreadsheet novice to certified{' '}
              <strong className="text-amber-400">Visual Business Engineer</strong>.
            </p>

            {/* Current Persona Evolution Pill */}
            <div className="inline-flex items-center gap-2 bg-[#1b1e2e] px-3.5 py-1.5 rounded-xl border border-white/10 mt-2">
              <span className="text-lg">{currentPersona.icon}</span>
              <div>
                <span className="text-xs font-bold text-amber-300 block">{currentPersona.title}</span>
                <span className="text-[11px] text-gray-400">{currentPersona.subtitle}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button & Streak widget */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Flame className="w-5 h-5 fill-orange-500" />
                <span className="text-sm font-mono">{userProfile.streakDays} Day Streak</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-mono">{userProfile.xp.toLocaleString()} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                onNavigateTab('simulator');
              }}
              className="px-6 py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Resume Active Simulation</span>
            </button>
          </div>
        </div>

        {/* OVERALL COMPLETION PROGRESS BAR (PRD Page 6) */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Overall Program Completion
            </span>
            <span className="text-amber-400 font-mono text-sm font-bold">{overallPercent}%</span>
          </div>
          <div className="w-full h-3 bg-[#171924] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              style={{ width: `${overallPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* ================= LEARNER STATS GRID (Ground Truth Only) ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Modules Completed', value: `${userProfile.completedModules.length}/5`, icon: '📚' },
          { label: 'Challenges Solved', value: `${solvedCount}/${totalChallenges}`, icon: '🎯' },
          { label: 'Active XP Earned', value: `${userProfile.xp.toLocaleString()} XP`, icon: '⚡' },
          { label: 'Industry Labs', value: '10 Domains', icon: '🏢' },
          { label: 'Badges Earned', value: `${userProfile.earnedBadges.length}/6`, icon: '🥇' },
          {
            label: 'Capstone Status',
            value: userProfile.capstoneCompleted ? 'Completed' : `Stage ${userProfile.capstoneStage || 1} of 9`,
            icon: '🏆',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#0f1118] border border-white/5 hover:border-amber-500/30 rounded-xl p-4 transition-all shadow-md group"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xs text-gray-400 font-medium truncate">{stat.label}</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5 group-hover:text-amber-400 transition">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ================= NEW: INBUILT FUNCTIONS LAB & TIMER ASSESSMENTS HIGHLIGHTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Function Lab Quick Card */}
        <div className="bg-gradient-to-br from-[#121422] to-[#0c0d16] border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                ⚡ INTERACTIVE FX PLAYGROUND
              </span>
              <span className="text-xs text-gray-400">30+ Functions</span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-400" />
              Inbuilt Functions Lab & IDE Executor
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Click <strong>"Fill Data"</strong> to load business datasets (Sales, Payroll, Inventory, Loans), click any inbuilt function to execute immediately, and launch directly into the <strong>full IDE Spreadsheet Simulator</strong>.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onNavigateTab('functions');
            }}
            className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Launch Inbuilt Function Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timed Assessments Quick Card */}
        <div className="bg-gradient-to-br from-[#171120] to-[#0d0e18] border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                ⏱️ STRICT 80% CERTIFICATION BENCHMARK
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {
                  [1, 2, 3, 4, 5].filter(
                    (m) => (userProfile.moduleScores?.[m]?.score || 0) >= 80
                  ).length
                }
                /5 Passed
              </span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Timer-Based Module Mock Tests
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Every module features an official <strong>25-minute exam</strong> with <strong>10 scenario questions + 5 interactive exercises</strong>. Badges and certificates remain locked unless you score ≥ 80%.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onNavigateTab('assessments');
            }}
            className="w-full py-2.5 rounded-xl gold-gradient-btn text-black text-xs font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <span>Take Module Assessments (Mocks)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= 5 MODULES ROADMAP (30 HOURS) ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" /> 30-Hour Learning Journey
            </h2>
            <p className="text-xs text-gray-400">
              5 Modules × 6 Hours • 10% Concept + 90% Hands-On Simulation
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('curriculum')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
          >
            <span>Explore Full Syllabus</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES_DATA.map((mod) => {
            const isCompleted = userProfile.completedModules.includes(mod.id);
            const isUnlocked = mod.id === 1 || userProfile.completedModules.includes(mod.id - 1);
            const modChallenges = mod.challenges;
            const solvedInMod = modChallenges.filter((c) =>
              userProfile.completedChallenges.includes(c.id)
            ).length;

            return (
              <div
                key={mod.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#0f131a] border-emerald-500/40 shadow-lg'
                    : isUnlocked
                    ? 'bg-[#10121a] border-amber-500/30 hover:border-amber-400/60 shadow-xl'
                    : 'bg-[#0c0d13] border-white/5 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      Module {mod.id} • {mod.hours} Hours
                    </span>
                    {isCompleted ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Mastered
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-xs text-amber-400 font-bold">Active</span>
                    ) : (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{mod.subtitle}</p>

                  <div className="bg-[#0b0c12] p-2.5 rounded-lg border border-white/5 mb-4 text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                      Lab Simulation:
                    </span>
                    <span className="text-amber-300 font-medium">{mod.businessSimulationLab}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">
                    {solvedInMod}/{modChallenges.length} Challenges Solved
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      onSelectChallenge(modChallenges[0].id);
                      onNavigateTab('simulator');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-amber-500/20 text-gray-200 hover:text-amber-300 border border-white/10 transition"
                  >
                    Open Lab →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= THE BIG IDEA BANNER (PRD Page 38) ================= */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#13151f] to-amber-500/5 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <span>🚀 THE BIG IDEA</span>
            <span>•</span>
            <span>Zero Software Architecture</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            "You haven't joined an Excel course. You have joined a virtual company."
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            No Microsoft Excel license needed. No Google Sheets desktop setup. Every challenge is a
            real decision-making problem evaluated by our live in-browser engine.
          </p>
        </div>

        <button
          onClick={() => {
            playClick();
            onNavigateTab('labs');
          }}
          className="px-6 py-3 rounded-xl bg-[#1b1e2c] hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0 transition"
        >
          Explore 10 Industry Labs →
        </button>
      </div>
    </div>
  );
};
