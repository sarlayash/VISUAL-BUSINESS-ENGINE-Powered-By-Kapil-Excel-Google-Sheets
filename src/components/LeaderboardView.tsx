import React, { useState } from 'react';
import { Trophy, Medal, Sparkles, TrendingUp, Flame, Shield } from 'lucide-react';
import { UserProfile, LeaderboardUser } from '../types';
import { playClick } from '../utils/soundEffects';

interface LeaderboardViewProps {
  userProfile: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userProfile }) => {
  const [filterCategory, setFilterCategory] = useState<'xp' | 'accuracy' | 'challenges'>('xp');

  const baseUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'Aarav Sen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      xp: 8920,
      challengesSolved: 50,
      accuracy: 99.2,
    },
    {
      rank: 2,
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      xp: 8410,
      challengesSolved: 48,
      accuracy: 98.5,
    },
    {
      rank: 3,
      name: 'Rahul Verma',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      xp: 7980,
      challengesSolved: 45,
      accuracy: 97.8,
    },
    {
      rank: 4,
      name: userProfile.name,
      avatar: userProfile.avatar,
      xp: userProfile.xp,
      challengesSolved: userProfile.completedChallenges.length,
      accuracy: 96.5,
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: 'Ananya Iyer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      xp: 6850,
      challengesSolved: 41,
      accuracy: 95.0,
    },
    {
      rank: 6,
      name: 'Vikram Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      xp: 6200,
      challengesSolved: 38,
      accuracy: 94.2,
    },
    {
      rank: 7,
      name: 'Sneha Nair',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      xp: 5740,
      challengesSolved: 35,
      accuracy: 93.6,
    },
  ];

  // Sort according to category
  const sorted = [...baseUsers].sort((a, b) => {
    if (filterCategory === 'accuracy') return b.accuracy - a.accuracy;
    if (filterCategory === 'challenges') return b.challengesSolved - a.challengesSolved;
    return b.xp - a.xp;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Trophy className="w-4 h-4" /> WEEKLY PERFORMANCE ARENA
        </div>
        <h1 className="text-3xl font-extrabold text-white">Visual Business Leaderboard</h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          "Accuracy and business reasoning matter more than speed alone."
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-8 pb-4">
        {/* Rank 2 (Silver) */}
        <div className="bg-[#0f1118] border border-gray-700/60 rounded-2xl p-4 text-center flex flex-col items-center shadow-lg relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-400 mb-2">
            <img src={sorted[1].avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg">🥈</span>
          <span className="text-xs font-bold text-white truncate max-w-full">{sorted[1].name}</span>
          <span className="text-xs font-mono text-gray-400 mt-1 font-semibold">
            {sorted[1].xp.toLocaleString()} XP
          </span>
        </div>

        {/* Rank 1 (Gold - Elevated) */}
        <div className="bg-gradient-to-b from-[#1b1c2b] to-[#0f1118] border-2 border-amber-400 rounded-2xl p-5 text-center flex flex-col items-center shadow-2xl relative -translate-y-4">
          <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider shadow">
            Top Performer
          </div>
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 mb-2 mt-1">
            <img src={sorted[0].avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl">👑</span>
          <span className="text-sm font-extrabold text-white truncate max-w-full">{sorted[0].name}</span>
          <span className="text-sm font-mono text-amber-400 font-bold mt-1">
            {sorted[0].xp.toLocaleString()} XP
          </span>
          <span className="text-[10px] text-emerald-400 mt-0.5 font-semibold">
            {sorted[0].accuracy}% Accuracy
          </span>
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="bg-[#0f1118] border border-amber-700/60 rounded-2xl p-4 text-center flex flex-col items-center shadow-lg relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-700 mb-2">
            <img src={sorted[2].avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg">🥉</span>
          <span className="text-xs font-bold text-white truncate max-w-full">{sorted[2].name}</span>
          <span className="text-xs font-mono text-gray-400 mt-1 font-semibold">
            {sorted[2].xp.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        {[
          { id: 'xp', label: 'Rank by XP' },
          { id: 'accuracy', label: 'Rank by Accuracy %' },
          { id: 'challenges', label: 'Challenges Solved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClick();
              setFilterCategory(tab.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              filterCategory === tab.id
                ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                : 'bg-[#121420] text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0f1118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-gray-800">
          {sorted.map((user, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 transition ${
                user.isCurrentUser
                  ? 'bg-amber-500/10 border-l-4 border-amber-400'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-mono font-bold text-xs text-gray-400">
                  #{idx + 1}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-white/10 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{user.name}</span>
                    {user.isCurrentUser && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {user.challengesSolved} challenges • {user.accuracy}% accuracy
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-amber-300 font-mono">
                  {user.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
