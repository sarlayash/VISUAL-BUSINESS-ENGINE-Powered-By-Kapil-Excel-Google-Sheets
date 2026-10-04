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
  BarChart2,
  Terminal,
  Lightbulb,
  ShieldCheck,
  FileText,
  QrCode,
} from 'lucide-react';
import { UserProfile, ModuleInfo } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import { playClick } from '../utils/soundEffects';

interface DashboardViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string, meta?: any) => void;
  onSelectChallenge: (challengeId: string) => void;
  onLoadDemoUser?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onNavigateTab,
  onSelectChallenge,
  onLoadDemoUser,
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

  // Badges & Certificates Accreditation Data
  const allModulesPassed = [1, 2, 3, 4, 5].every(
    (m) => (userProfile.moduleScores?.[m]?.score || 0) >= 80
  );
  const isGrandDiplomaUnlocked =
    allModulesPassed && (userProfile.capstoneCompleted || (userProfile.capstoneStage || 0) >= 9);

  const passedAssessmentsCount = [1, 2, 3, 4, 5].filter(
    (m) => (userProfile.moduleScores?.[m]?.score || 0) >= 80
  ).length;

  const dashboardBadges = [
    {
      id: 'b1',
      moduleId: 1,
      title: 'Data Preparation Explorer',
      module: 'Module 1',
      icon: '🧹',
      desc: 'Spreadsheet anatomy, data cleaning & foundational formulas.',
    },
    {
      id: 'b2',
      moduleId: 2,
      title: 'Formula Intelligence Specialist',
      module: 'Module 2',
      icon: '🧠',
      desc: 'Multi-condition logic, SUMIFS, and What-If scenarios.',
    },
    {
      id: 'b3',
      moduleId: 3,
      title: 'Lookup & Statistics Analyst',
      module: 'Module 3',
      icon: '🔍',
      desc: 'XLOOKUP, INDEX+MATCH, and statistical distributions.',
    },
    {
      id: 'b4',
      moduleId: 4,
      title: 'Business Data Visualization Analyst',
      module: 'Module 4',
      icon: '📊',
      desc: 'Pivot Tables, interactive slicers, and storytelling.',
    },
    {
      id: 'b5',
      moduleId: 5,
      title: 'Dashboard Architect',
      module: 'Module 5',
      icon: '🏛️',
      desc: 'Boardroom C-Suite executive control dashboards.',
    },
    {
      id: 'bf',
      moduleId: 0,
      title: 'Visual Business Engineer',
      module: 'Capstone Final',
      icon: '🏆',
      desc: '9-Stage Capstone & all 5 module exams passed ≥ 80%.',
      isGrand: true,
    },
  ];

  const unlockedBadgesCount = dashboardBadges.filter((b) => {
    if (b.isGrand) return isGrandDiplomaUnlocked;
    return (userProfile.moduleScores?.[b.moduleId]?.score || 0) >= 80;
  }).length;

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

      {/* ================= BADGES & VERIFIABLE CERTIFICATES SHOWCASE (User Request) ================= */}
      <div className="rounded-2xl bg-gradient-to-br from-[#121422] via-[#0d0f18] to-[#161324] border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                ACCREDITATION & CREDENTIALS
              </span>
              <span className="text-xs text-gray-400">• Strict 80% Passing Rule</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Badges & Verifiable Certificates</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Official SarlaYash Mission Accreditation • Powered by Kapil • Live ISO Scannable QR Codes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onLoadDemoUser && !isGrandDiplomaUnlocked && (
              <button
                onClick={() => {
                  playClick();
                  onLoadDemoUser();
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 font-bold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95"
                title="Preview all 6 badges and certificates unlocked as Demo Graduate"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>🎓 Demo User (Preview All Unlocked)</span>
              </button>
            )}

            <button
              onClick={() => {
                playClick();
                onNavigateTab('certificates');
              }}
              className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
            >
              <span>View Credential Portal</span>
              <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Certificate Status & Quick Metrics Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Diploma Card */}
          <div className="lg:col-span-2 bg-[#090b12] border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 justify-between relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1d1928] to-[#121422] border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-lg shrink-0">
                {isGrandDiplomaUnlocked ? '🏆' : '📜'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Visual Business Engineer Diploma</span>
                  {isGrandDiplomaUnlocked ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> UNLOCKED & VERIFIED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> LOCKED (Needs 5 Exams ≥ 80% + Capstone)
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {isGrandDiplomaUnlocked
                    ? `Issued to ${userProfile.name} • Credential ID: ${userProfile.certificateId || 'SY-VBE-2026-000124'}`
                    : `Pass all 5 module exams with ≥ 80% (Currently: ${passedAssessmentsCount}/5 passed) and complete Capstone.`}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> ISO Scannable QR Matrix
                  </span>
                  <span>•</span>
                  <span>Zero-Crop High-Res Print PDF</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  playClick();
                  onNavigateTab('certificates');
                }}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isGrandDiplomaUnlocked
                    ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <span>{isGrandDiplomaUnlocked ? 'Download / Print Diploma' : 'Inspect Certificate'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  playClick();
                  onNavigateTab('verify');
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#141624] hover:bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>Verify Credential ID</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="bg-[#090b12] border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Accreditation Summary</span>
              <span className="text-xs font-mono text-amber-400 font-bold">{unlockedBadgesCount} of 6 Badges</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Module Exams (≥ 80%):</span>
                <span className="font-mono text-white font-bold">{passedAssessmentsCount} / 5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Capstone Completion:</span>
                <span className="font-mono text-white font-bold">
                  {userProfile.capstoneCompleted ? '100% Completed' : `Stage ${userProfile.capstoneStage || 1}/9`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Accredited Level:</span>
                <span className="font-mono text-amber-300 font-bold">{userProfile.level}</span>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                onNavigateTab('assessments');
              }}
              className="w-full py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Take Module Exams to Unlock</span>
            </button>
          </div>
        </div>

        {/* 6 Badges Showcase Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>6 Program Badges (Module Mastery)</span>
            </h3>
            <button
              onClick={() => {
                playClick();
                onNavigateTab('certificates');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View All in Certificate Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {dashboardBadges.map((badge) => {
              const modScore = badge.moduleId > 0 ? userProfile.moduleScores?.[badge.moduleId]?.score || 0 : 0;
              const isEarned = badge.isGrand
                ? isGrandDiplomaUnlocked
                : modScore >= 80;

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    playClick();
                    onNavigateTab('certificates');
                  }}
                  className={`rounded-xl p-3.5 border transition cursor-pointer flex flex-col justify-between hover:scale-[1.02] ${
                    isEarned
                      ? badge.isGrand
                        ? 'bg-gradient-to-br from-[#1d1928] to-[#121422] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#0f121a] border-amber-500/40 shadow'
                      : 'bg-[#090a10] border-white/5 opacity-70 hover:opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161826] text-amber-300 border border-white/5">
                        {badge.module}
                      </span>
                      {isEarned ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> {badge.moduleId > 0 ? `${modScore}%` : 'Done'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> {modScore > 0 ? `${modScore}%` : '80%'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-2xl ${!isEarned ? 'grayscale opacity-50' : ''}`}>
                        {badge.icon}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{badge.title}</h4>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight">{badge.desc}</p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span className={isEarned ? 'text-amber-400 font-semibold' : 'text-gray-500'}>
                      {isEarned ? 'Verified' : 'Locked'}
                    </span>
                    <span className="text-amber-400">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

      {/* ================= NEW SIMULATORS & KNOWLEDGE SUITE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pivot Tables & Charts Simulator */}
        <div className="bg-[#0f111a] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                MULTI-DIMENSIONAL BI
              </span>
              <span className="text-xs text-amber-400 font-mono">Real-time Slicers</span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 group-hover:text-amber-300 transition">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              Pivot Tables & Charts Simulator
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Build cross-tabulated matrix summaries (Rows, Columns, Values, Aggregations), slice by Region/Quarter, and visualize via Column, Bar, Line, or Donut Pivot Charts.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onNavigateTab('pivots');
            }}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <span>Launch Pivot & Charts Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Macros & VBA Sandbox Simulator */}
        <div className="bg-[#0f111a] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                ENTERPRISE CODE
              </span>
              <span className="text-xs text-amber-400 font-mono">VBA vs Apps Script</span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 group-hover:text-amber-300 transition">
              <Terminal className="w-4 h-4 text-amber-400" />
              Macros & Automation Simulator
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Step through live macro simulations: automated data cleansing, payroll tax calculators, and email dispatchers. Compare Excel VBA and Google Apps Script side-by-side.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onNavigateTab('macros');
            }}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <span>Launch Macro Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 50 Differences Knowledge Bytes */}
        <div className="bg-[#0f111a] border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                KAPIL'S CURRICULUM
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {userProfile.acknowledgedBytes?.length || 0}/50 Done
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 group-hover:text-amber-300 transition">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              50 Differences: Sheets vs Excel
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Authoritative 50-item comparative curriculum with Kapil's verdicts across Calculation Speed, Collaboration, Query Syntax, Copilot/Gemini, and Pricing.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onNavigateTab('knowledge');
            }}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <span>Explore 50 Differences</span>
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
