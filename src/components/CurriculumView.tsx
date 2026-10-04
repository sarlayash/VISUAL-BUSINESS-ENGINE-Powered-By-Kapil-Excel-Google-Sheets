import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { MODULES_DATA } from '../data/modulesData';
import { UserProfile } from '../types';
import {
  toggleChallengeComplete,
  markAllModuleItemsComplete,
  toggleSectionComplete,
} from '../utils/storage';
import { playClick, playSuccess } from '../utils/soundEffects';

interface CurriculumViewProps {
  userProfile: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onSelectChallenge: (challengeId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  userProfile,
  onUpdateProfile,
  onSelectChallenge,
  onNavigateTab,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const activeModule = MODULES_DATA.find((m) => m.id === selectedModuleId) || MODULES_DATA[0];

  const handleToggleChallenge = (challengeId: string) => {
    playClick();
    const updated = toggleChallengeComplete(challengeId);
    if (updated && onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  const handleMarkAllModuleComplete = () => {
    playSuccess();
    const challengeIds = activeModule.challenges.map((c) => c.id);
    const updated = markAllModuleItemsComplete(activeModule.id, challengeIds);
    if (updated && onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  const handleToggleSection = (sectionTopic: string) => {
    playClick();
    const sectionId = `sec_${activeModule.id}_${sectionTopic.substring(0, 15).replace(/\s+/g, '_')}`;
    const updated = toggleSectionComplete(sectionId);
    if (updated && onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              30-HOUR COMPREHENSIVE CURRICULUM
            </span>
            <span className="text-xs text-gray-400">Zero Software Required</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Visual Business Engine Curriculum</h1>
          <p className="text-sm text-gray-400 mt-1">
            Excel Way → Google Sheets Way → Real Business Use Case
          </p>
        </div>

        {/* Module Picker Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#0f1118] p-1.5 rounded-xl border border-white/10">
          {MODULES_DATA.map((m) => {
            const isSelected = m.id === selectedModuleId;
            const isCompleted = userProfile.completedModules.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => {
                  playClick();
                  setSelectedModuleId(m.id);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>M{m.id}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Module Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Module Overview, Topics, & Excel vs Sheets Matrix */}
        <div className="lg:col-span-1 space-y-6">
          {/* Module Card */}
          <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                MODULE 0{activeModule.id}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> {activeModule.hours} Hours
              </span>
            </div>

            <h2 className="text-xl font-bold text-white leading-snug">{activeModule.title}</h2>
            <p className="text-xs text-gray-400 leading-relaxed">{activeModule.subtitle}</p>

            <div className="bg-[#141622] p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                Module Badge:
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="text-lg">{activeModule.badgeIcon}</span>
                <span>{activeModule.badgeName}</span>
              </div>
            </div>

            <div className="bg-[#141622] p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Flagship Business Lab:
              </span>
              <div className="text-sm font-medium text-amber-300">
                {activeModule.businessSimulationLab}
              </div>
            </div>
          </div>

          {/* Topics Covered */}
          <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> Core Concepts (10%)
            </h3>
            <ul className="space-y-2.5">
              {activeModule.topics.map((topic, i) => {
                const sectionId = `sec_${activeModule.id}_${topic.substring(0, 15).replace(/\s+/g, '_')}`;
                const isSecDone = userProfile.completedSections?.includes(sectionId);
                return (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed group">
                    <button
                      onClick={() => handleToggleSection(topic)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                        isSecDone
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-white/20 hover:border-amber-400 text-transparent'
                      }`}
                      title={isSecDone ? 'Mark topic as incomplete' : 'Mark topic as complete'}
                    >
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className={isSecDone ? 'line-through text-gray-500' : ''}>{topic}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Hands-On Challenges & Excel vs Sheets Mapping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hands-on Challenges List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Hands-On Simulation Challenges (90%)
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkAllModuleComplete}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5 transition"
                  title="Mark all challenges in this module as complete"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark All Complete</span>
                </button>
                <span className="text-xs text-gray-400">
                  {activeModule.challenges.length} Practical Labs
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {activeModule.challenges.map((chal, cIdx) => {
                const isPassed = userProfile.completedChallenges.includes(chal.id);
                return (
                  <div
                    key={chal.id}
                    className={`bg-[#0f1118] border rounded-2xl p-5 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isPassed
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-white/10 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181b28] text-amber-300 font-bold border border-white/5">
                          Challenge {activeModule.id}.{cIdx + 1}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-semibold">
                          {chal.businessDomain}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold">
                          {chal.difficulty}
                        </span>
                        {isPassed && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Solved
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white">{chal.title}</h4>
                      <p className="text-xs text-gray-400 max-w-lg line-clamp-2">
                        {chal.businessStory}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                      <span className="text-xs text-amber-400 font-mono font-bold">
                        +{chal.xpReward} XP
                      </span>
                      <button
                        onClick={() => handleToggleChallenge(chal.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                          isPassed
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                        title={isPassed ? 'Mark as Incomplete' : 'Mark as Complete'}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isPassed ? 'text-emerald-400' : 'text-gray-400'}`} />
                        <span>{isPassed ? 'Completed' : 'Mark Complete'}</span>
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          onSelectChallenge(chal.id);
                          onNavigateTab('simulator');
                        }}
                        className="px-4 py-2 rounded-xl gold-gradient-btn text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Launch Simulation</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MODULE CERTIFICATION ASSESSMENT / MOCK TEST CARD */}
          <div className="bg-gradient-to-r from-[#14121d] via-[#101322] to-[#0d1620] border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>25-MINUTE TIMER-BASED ACCREDITATION EXAM</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Module {activeModule.id} Mock Test: 10 Questions + 5 Practical Exercises
              </h3>
              <p className="text-xs text-gray-400 max-w-xl">
                Badge "{activeModule.badgeName}" and Certificate remain strictly locked until you score at least 80% on this assessment.
                {userProfile.moduleScores?.[activeModule.id] ? (
                  <span className="block mt-1 font-mono text-amber-300">
                    Your current score: {userProfile.moduleScores[activeModule.id].score}% ({userProfile.moduleScores[activeModule.id].passed ? 'PASSED' : 'NEEDS ≥ 80%'})
                  </span>
                ) : (
                  <span className="block mt-1 text-gray-500">Not yet attempted.</span>
                )}
              </p>
            </div>

            <button
              onClick={() => {
                playClick();
                onNavigateTab('assessments');
              }}
              className="px-5 py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 hover:scale-105 active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Launch Module {activeModule.id} Exam</span>
            </button>
          </div>

          {/* DUAL LEARNING MATRIX: EXCEL VS GOOGLE SHEETS (PRD Pages 16-17) */}
          <div className="bg-[#0f1118] border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" /> Excel vs Google Sheets Dual Mastery
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Understand how enterprise functions translate across platforms
                </p>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-[#161824] text-gray-300 font-mono">
                Genuine Tool Independence
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-semibold">
                    <th className="pb-2.5">Concept</th>
                    <th className="pb-2.5 text-emerald-400">Microsoft Excel Way</th>
                    <th className="pb-2.5 text-blue-400">Google Sheets Way</th>
                    <th className="pb-2.5 text-amber-300">FAANG Business Pro Tip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {activeModule.excelVsSheetsHighlights.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-sans font-semibold text-white">{row.concept}</td>
                      <td className="py-3 text-emerald-300 pr-3">{row.excelWay}</td>
                      <td className="py-3 text-blue-300 pr-3">{row.sheetsWay}</td>
                      <td className="py-3 font-sans text-gray-300">{row.proTip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
