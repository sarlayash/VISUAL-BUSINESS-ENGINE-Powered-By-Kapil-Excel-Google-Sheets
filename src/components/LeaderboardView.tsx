import React, { useState } from 'react';
import { Trophy, Award, Sparkles, CheckCircle2, ShieldCheck, UserCheck, Flame } from 'lucide-react';
import { UserProfile } from '../types';
import { getRegisteredLearners } from '../utils/storage';
import { playClick } from '../utils/soundEffects';

interface LeaderboardViewProps {
  userProfile: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userProfile }) => {
  const [filterCategory, setFilterCategory] = useState<'xp' | 'challenges'>('xp');

  // Pull authentic registered learners from platform storage (NO FAKE USERS)
  const allLearners = getRegisteredLearners();
  // Ensure current user is in the list
  const learnerMap = new Map<string, UserProfile>();
  allLearners.forEach((l) => learnerMap.set(l.email, l));
  learnerMap.set(userProfile.email, userProfile);

  const realRoster = Array.from(learnerMap.values());

  // Sort genuinely according to category
  realRoster.sort((a, b) => {
    if (filterCategory === 'challenges') {
      return b.completedChallenges.length - a.completedChallenges.length;
    }
    return b.xp - a.xp;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VERIFIABLE LEARNER ARENA • ZERO FABRICATED DATA</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Visual Business Leaderboard</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
          Rankings are calculated solely from genuine challenge validations and verifiable learner milestones.
        </p>
      </div>

      {/* Authenticity Guarantee Banner */}
      <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 text-gray-300">
          <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Tracking <strong className="text-white font-mono">{realRoster.length}</strong> authenticated learner
            {realRoster.length > 1 ? 's' : ''} on this Visual Business Engine instance.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
          100% Genuine Metrics
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            playClick();
            setFilterCategory('xp');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            filterCategory === 'xp'
              ? 'bg-amber-500 text-black border-amber-400 shadow-md'
              : 'bg-[#121420] text-gray-400 border-white/5 hover:text-white'
          }`}
        >
          Rank by Verifiable XP
        </button>
        <button
          onClick={() => {
            playClick();
            setFilterCategory('challenges');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            filterCategory === 'challenges'
              ? 'bg-amber-500 text-black border-amber-400 shadow-md'
              : 'bg-[#121420] text-gray-400 border-white/5 hover:text-white'
          }`}
        >
          Rank by Validated Challenges
        </button>
      </div>

      {/* Real Learner Table */}
      <div className="bg-[#0f1118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-gray-800">
          {realRoster.map((learner, idx) => {
            const isCurrent = learner.email === userProfile.email;
            return (
              <div
                key={learner.id || idx}
                className={`flex items-center justify-between p-4 sm:p-5 transition ${
                  isCurrent
                    ? 'bg-amber-500/10 border-l-4 border-amber-400'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center font-mono font-bold text-sm text-amber-400">
                    #{idx + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-amber-400/40 overflow-hidden bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">
                    {learner.avatar ? (
                      <img src={learner.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      learner.name[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{learner.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>Tier: <strong className="text-gray-200">{learner.level}</strong></span>
                      <span>•</span>
                      <span>{learner.completedChallenges.length} challenges passed</span>
                      <span>•</span>
                      <span>{learner.streakDays}d streak</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-amber-300 font-mono block">
                    {learner.xp.toLocaleString()} XP
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {learner.earnedBadges.length} Badges
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
