import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Award,
} from 'lucide-react';
import { CAPSTONE_STAGES } from '../data/capstoneData';
import { UserProfile } from '../types';
import { playClick, playSuccess, playLevelUp } from '../utils/soundEffects';
import { toggleCapstoneStageComplete } from '../utils/storage';
import confetti from 'canvas-confetti';

interface CapstoneViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
}

export const CapstoneView: React.FC<CapstoneViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateTab,
}) => {
  const currentStageNum = userProfile.capstoneStage || 1;
  const isAllComplete = userProfile.capstoneCompleted;

  const [activeStageIdx, setActiveStageIdx] = useState<number>(
    Math.min(currentStageNum - 1, CAPSTONE_STAGES.length - 1)
  );

  const activeStage = CAPSTONE_STAGES[activeStageIdx];
  const isStageDone = Boolean(
    userProfile.capstoneCompleted ||
    userProfile.completedCapstoneStages?.includes(activeStage.stageNumber) ||
    activeStage.stageNumber < currentStageNum
  );

  const handleToggleStage = (stageNum: number) => {
    playSuccess();
    const updated = toggleCapstoneStageComplete(stageNum);
    if (updated) {
      onUpdateProfile(updated);
    }
  };

  const handleCompleteActiveStage = () => {
    playSuccess();
    const nextStage = activeStageIdx + 2;
    const isNowFinal = nextStage > CAPSTONE_STAGES.length;

    const updatedBadges = [...userProfile.earnedBadges];
    if (isNowFinal && !updatedBadges.includes('Visual Business Engineer')) {
      updatedBadges.push('Visual Business Engineer');
      playLevelUp();
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#FBBF24', '#FFFFFF', '#D97706'],
        });
      } catch (e) {}
    }

    onUpdateProfile({
      ...userProfile,
      capstoneStage: Math.min(CAPSTONE_STAGES.length, nextStage),
      capstoneCompleted: isNowFinal || userProfile.capstoneCompleted,
      xp: userProfile.xp + activeStage.xpReward,
      level: isNowFinal ? 'Visual Business Engineer' : userProfile.level,
      earnedBadges: updatedBadges,
    });

    if (!isNowFinal) {
      setActiveStageIdx(activeStageIdx + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Flagship Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171926] via-[#0d0f17] to-[#1c1926] border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                THE VISUAL BUSINESS ENGINE CHALLENGE
              </span>
              <span className="text-xs text-gray-400">9 Enterprise Stages</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" /> Global Retail Corporation Capstone
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl">
              10,000+ transaction enterprise challenge: Clean data, compute margins, build matrix lookups,
              analyze statistical distributions, and deliver a C-suite executive presentation.
            </p>
          </div>

          <div className="bg-[#121420] border border-white/10 p-4 rounded-xl text-center shrink-0">
            <span className="text-[11px] text-gray-400 block font-semibold uppercase">
              Final Milestone Award:
            </span>
            <span className="text-sm font-bold text-amber-400 block mt-1">
              🏆 Visual Business Engineer
            </span>
            <span className="text-xs text-emerald-400 font-mono">+500 Bonus XP</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-gray-300 font-semibold">
            Stage {Math.min(currentStageNum, 9)} of 9 •{' '}
            {isAllComplete ? '100% Mastered' : `${Math.round(((currentStageNum - 1) / 9) * 100)}% Complete`}
          </span>
          {isAllComplete && (
            <button
              onClick={() => onNavigateTab('certificates')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>View Official Certificate of Achievement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 9 Stages Horizontal Navigator */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {CAPSTONE_STAGES.map((stg, idx) => {
          const isPassed =
            userProfile.capstoneCompleted ||
            userProfile.completedCapstoneStages?.includes(stg.stageNumber) ||
            idx + 1 < currentStageNum;
          const isCurrent = idx + 1 === currentStageNum;
          const isSelected = activeStageIdx === idx;

          return (
            <button
              key={stg.stageNumber}
              onClick={() => {
                playClick();
                setActiveStageIdx(idx);
              }}
              className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg scale-105'
                  : isPassed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-[#151724] border-amber-500/30 text-white'
                  : 'bg-[#0e1017] border-white/5 text-gray-500 opacity-60'
              }`}
            >
              <div className="text-xs font-mono font-bold">
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  `S0${stg.stageNumber}`
                )}
              </div>
              <span className="text-[10px] font-medium truncate w-full">
                {stg.title.split(':')[1]?.trim() || `Stage ${stg.stageNumber}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">
                CAPSTONE MILESTONE STAGE 0{activeStage.stageNumber}
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">{activeStage.title}</h2>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-[#161824] px-3 py-1.5 rounded-lg border border-white/5">
              +{activeStage.xpReward} XP
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Stage Objective:
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed bg-[#131520] p-4 rounded-xl border border-white/5">
              {activeStage.objective}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Required Execution Steps:
            </h3>
            <ol className="space-y-2.5 text-xs text-gray-300 list-decimal list-inside leading-relaxed bg-[#0c0d14] p-4 rounded-xl border border-white/5">
              {activeStage.instructions.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Required Mastery:</span>
              <span className="text-amber-400 font-semibold font-mono bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                {activeStage.expectedConcept}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleToggleStage(activeStage.stageNumber)}
                className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                  isStageDone
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-[#141624] text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isStageDone ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{isStageDone ? 'Stage Completed ✓' : 'Mark Stage Complete'}</span>
              </button>
              <button
                onClick={handleCompleteActiveStage}
                className="px-6 py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Validate & Advance Stage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dataset & Architecture Info */}
        <div className="space-y-6">
          <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" /> Global Dataset Architecture
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {activeStage.datasetDescription}
            </p>
            <div className="bg-[#12141f] p-3 rounded-xl border border-white/5 text-xs space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Active Range:</span>
              <code className="text-amber-300 font-mono block">
                {activeStage.targetCells.join(', ')}
              </code>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#121420] to-[#0c0d14] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Final Certification Rule
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              According to SarlaYash Mission PRD guidelines, achieving the final{' '}
              <strong className="text-amber-300">Visual Business Engineer</strong> designation requires
              passing all 9 stages with rigorous numerical accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
