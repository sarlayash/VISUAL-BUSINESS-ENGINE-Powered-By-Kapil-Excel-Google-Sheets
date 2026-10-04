import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  FileSpreadsheet,
  Zap,
  Globe,
  Smartphone,
  BookOpen,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { playClick, playSuccess, playError } from '../utils/soundEffects';
import { signInWithGoogleFirebase } from '../utils/firebase';

interface LandingPageViewProps {
  onSignIn: (name: string, email: string, avatar?: string, uid?: string) => void;
  onExplorePreview?: () => void;
  onLoadDemoUser?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onSignIn,
  onLoadDemoUser,
  onNavigateTab,
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Real Firebase Google OAuth Popup Sign-In
  const handleFirebasePopup = async () => {
    playClick();
    setIsFirebaseLoading(true);
    setFirebaseError(null);
    try {
      const googleUser = await signInWithGoogleFirebase();
      playSuccess();
      onSignIn(
        googleUser.displayName || 'Google Learner',
        googleUser.email,
        googleUser.photoURL,
        googleUser.uid
      );
    } catch (err: any) {
      console.warn('Firebase sign-in popup notice:', err);
      setIsFirebaseLoading(false);
      if (err?.code === 'auth/popup-closed-by-user') {
        setFirebaseError('Sign-in popup was closed. Click again or enter your details below.');
      } else if (err?.code === 'auth/network-request-failed' || !navigator.onLine) {
        setFirebaseError('Working offline? Enter your name & email below to continue in 100% offline mode.');
      } else {
        setFirebaseError(err?.message || 'Google Auth connection error. You can continue below.');
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;
    playSuccess();
    onSignIn(userName.trim(), userEmail.trim());
  };

  const handleQuickDemo = () => {
    playSuccess();
    onSignIn('Kapil', 'kapil@sarlayash.org');
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f3f4f6] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* ================= HERO SECTION (PRD Page 31 & User Request) ================= */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 border-b border-amber-500/20">
        {/* Ambient lighting glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141624] border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SARLAYASH MISSION PRESENTS • POWERED BY KAPIL</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                VISUAL <span className="gold-gradient-text">BUSINESS</span> ENGINE
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 font-medium">
                Turn Spreadsheets Into Business Intelligence.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-gray-300 font-medium">
                <span className="flex items-center gap-1.5 bg-[#12141f] px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Excel + Google Sheets
                </span>
                <span className="flex items-center gap-1.5 bg-[#12141f] px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Hands-On
                </span>
                <span className="flex items-center gap-1.5 bg-[#12141f] px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Software Required
                </span>
              </div>

              <p className="text-sm text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                No Microsoft Excel installation. No Google Sheets desktop software. No Microsoft Office subscription. 
                Learners work directly inside realistic business simulations, live formula validations, and 
                executive dashboards—100% in your browser and on mobile phones offline.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 flex-wrap">
                <button
                  onClick={() => {
                    playClick();
                    setShowSignInModal(true);
                  }}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl gold-gradient-btn text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Start Your Mission</span>
                </button>

                {onLoadDemoUser && (
                  <button
                    onClick={() => {
                      playSuccess();
                      onLoadDemoUser();
                    }}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 border border-amber-500/50 text-amber-300 hover:text-white font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-lg hover:border-amber-400"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Demo User (See Badges & Certs)</span>
                  </button>
                )}

                {onNavigateTab && (
                  <button
                    onClick={() => {
                      playClick();
                      onNavigateTab('sitemap');
                    }}
                    className="w-full sm:w-auto px-5 py-4 rounded-xl bg-[#141624] hover:bg-white/10 text-white font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition"
                  >
                    <span>🗺️ Site Map</span>
                  </button>
                )}

                <a
                  href="#note-from-kapil"
                  className="w-full sm:w-auto px-5 py-4 rounded-xl bg-[#141624] hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition"
                >
                  <span>Note From Kapil</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Right Column: OFFICIAL POSTER IMAGE (Provided by User) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm sm:max-w-md w-full">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-[#0c0d14]">
                  <img
                    src="./landing-hero.jpg"
                    alt="Visual Business Engine - Powered by Kapil - SarlaYash Mission Presents"
                    className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-center">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                      Official Program Architecture
                    </span>
                    <span className="text-xs text-gray-300">
                      Excel + Google Sheets • 100% In-Browser Simulation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRUST STRIP (PRD Page 31) */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { num: '30 HOURS', label: 'Structured Learning' },
              { num: '5 MODULES', label: '6 Hours Each' },
              { num: '10+ DOMAINS', label: 'Industry Real-World Labs' },
              { num: '100% HANDS-ON', label: '10% Concept + 90% Practice' },
              { num: 'ZERO INSTALLS', label: 'Pure In-Browser PWA' },
              { num: 'VERIFIABLE', label: 'Certificates + Badges' },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0f1118] border border-white/5 rounded-xl p-3.5 shadow">
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono block">
                  {item.num}
                </span>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NOTE FROM KAPIL (User Request) ================= */}
      <section id="note-from-kapil" className="py-16 md:py-24 bg-[#0a0b10] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-[#131522] to-[#0e1018] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Seal background watermark */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg text-black font-extrabold text-xl">
                  K
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">A Personal Note From Kapil</h2>
                  <p className="text-xs text-amber-400 font-semibold">
                    Lead Program Architect • SarlaYash Mission
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Dear Learner,</strong>
                </p>
                <p>
                  Spreadsheets are not an academic textbook subject. They are the <em>living nervous system</em> of modern business decision-making. 
                  Every company on earth—from Silicon Valley tech titans to retail chains, hospitals, banks, and supply chains—runs on spreadsheets.
                </p>
                <p>
                  Yet almost every traditional course fails you. They subject you to 20-hour video lectures where someone talks over slides, 
                  forcing you to memorize syntax without ever understanding the underlying business question: 
                  <strong className="text-amber-300"> "What decision does the VP or CEO actually need to make from this data?"</strong>
                </p>
                <p className="bg-[#181a28] p-4 rounded-xl border border-amber-500/20 text-amber-200 font-medium">
                  At SarlaYash Mission, we built the <strong>Visual Business Engine</strong> on a strict radical principle: 
                  <span className="text-white font-bold"> 10% Concept + 90% Hands-On Simulation</span>. 
                  You don't need Excel installed. You don't need Google Sheets installed. You don't need prior data analytics background.
                </p>
                <p>
                  The moment you log in, you are not taking a course. 
                  <strong className="text-white"> You have joined a virtual company, and you have been hired to solve real business problems.</strong>
                </p>
              </div>

              {/* Sign-off */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-serif italic text-white">Kapil</div>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    Lead Mentor, SarlaYash Mission
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    SarlaYash Philosophy: Learn • Simulate • Solve • Transform
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OFFICIAL ACCREDITATION: BADGES & CERTIFICATES SHOWCASE ================= */}
      <section id="credentials-preview" className="py-16 md:py-24 bg-[#08090f] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
              ACCREDITATION & DIGITAL CREDENTIALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Earn Verified Badges & Accredited Diplomas
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Every credential is mathematically anchored to a strict <strong>≥ 80% passing standard</strong> on timed assessments. Featuring ISO scannable QR verification, PNG exports, and zero-crop printable diplomas.
            </p>
          </div>

          {/* Certificate Showcase Banner */}
          <div className="bg-gradient-to-r from-[#121422] via-[#0d0f18] to-[#161324] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e1728] to-[#121424] border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-xl shrink-0">
                🏆
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white">Visual Business Engineer Diploma</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Official Credential
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">
                  Awarded upon completing all 5 modules, passing all 5 timer-based exams with ≥ 80%, and completing the 9-Stage Global Retail Capstone.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> ISO QR Verification
                  </span>
                  <span>•</span>
                  <span>LinkedIn 1-Click Share</span>
                  <span>•</span>
                  <span>High-Res Print PDF</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {onLoadDemoUser && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onLoadDemoUser();
                  }}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>🎓 Load Demo User (See All Badges)</span>
                </button>
              )}
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onNavigateTab('verify');
                  }}
                  className="px-5 py-3 rounded-xl bg-[#141624] hover:bg-white/5 border border-white/10 text-gray-200 font-bold text-xs flex items-center gap-2 transition"
                >
                  <span>Verify Credential ID</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 6 Badges Architecture */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>6 Program Badges Architecture</span>
              </h3>
              <span className="text-xs text-amber-400 font-mono">Requires ≥ 80% on Module Mock Exams</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'b1',
                  mod: 'Module 1',
                  title: 'Data Preparation Explorer',
                  icon: '🧹',
                  desc: 'Mastered spreadsheet anatomy, data cleaning & foundational formulas.',
                },
                {
                  id: 'b2',
                  mod: 'Module 2',
                  title: 'Formula Intelligence Specialist',
                  icon: '🧠',
                  desc: 'Mastered multi-condition logic, SUMIFS, and What-If scenarios.',
                },
                {
                  id: 'b3',
                  mod: 'Module 3',
                  title: 'Lookup & Statistics Analyst',
                  icon: '🔍',
                  desc: 'Mastered XLOOKUP, INDEX+MATCH, and statistical distributions.',
                },
                {
                  id: 'b4',
                  mod: 'Module 4',
                  title: 'Business Data Visualization Analyst',
                  icon: '📊',
                  desc: 'Mastered Pivot Tables, interactive slicers, and storytelling.',
                },
                {
                  id: 'b5',
                  mod: 'Module 5',
                  title: 'Dashboard Architect',
                  icon: '🏛️',
                  desc: 'Engineered boardroom C-Suite executive control dashboards.',
                },
                {
                  id: 'bf',
                  mod: 'Grand Final Milestone',
                  title: 'Visual Business Engineer',
                  icon: '🏆',
                  desc: 'The pinnacle award: Solved 9-stage Global Retail Capstone & passed all exams with ≥ 80%.',
                  isGrand: true,
                },
              ].map((b) => (
                <div
                  key={b.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between ${
                    b.isGrand
                      ? 'bg-gradient-to-br from-[#1d1928] to-[#121422] border-amber-400/60 shadow-lg'
                      : 'bg-[#0e111a] border-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161826] text-amber-300 border border-white/5">
                        {b.mod}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> Unlock at ≥ 80%
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{b.icon}</span>
                      <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUESTION: "READY TO DIVE IN?" + GOOGLE SIGN-IN ================= */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-[#07080b]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
              Instant Access • 100% Free Hands-On Portal
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to dive in?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto">
              Continue with Google to initialize your personalized learner dashboard, track real XP, 
              earn verified badges, and build your Business Engine.
            </p>
          </div>

          {/* Interactive Google Sign-In Card with Firebase OAuth */}
          <div className="bg-[#0f1118] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6">
            {/* Primary Action: Direct One-Click Firebase Google Sign-In */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleFirebasePopup}
                disabled={isFirebaseLoading}
                className="w-full py-4 rounded-2xl bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isFirebaseLoading ? 'Connecting Google Account...' : 'Continue with Google (Instant Login)'}</span>
              </button>

              {firebaseError && (
                <div className="bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{firebaseError}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] font-mono text-gray-500 uppercase">
                Or Continue Offline / Manual Verification
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Offline-first / Manual profile inputs */}
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Full Name (Appears on your Official Certificate):
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Kapil Narula or Priya Sharma"
                  className="w-full bg-[#161824] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Google Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full bg-[#161824] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 text-sm font-medium transition"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3.5 rounded-xl gold-gradient-btn text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Launch Engine (Offline Ready)</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#171924] hover:bg-white/10 text-gray-300 font-semibold text-xs border border-white/10 transition"
                >
                  Instant Access as Kapil
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-white/5 text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verifiable data privacy • Firebase secure auth • Zero password management • Offline enabled</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Fallback */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0f1118] border border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center space-y-2 mb-6">
              <h3 className="text-xl font-bold text-white">Google Sign-In</h3>
              <p className="text-xs text-gray-400">
                Unlock Visual Business Engine simulators & 30-hour curriculum
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <button
                type="button"
                onClick={handleFirebasePopup}
                disabled={isFirebaseLoading}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isFirebaseLoading ? 'Connecting...' : 'One-Click Google Sign-In'}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex-1 h-px bg-white/10" />
                <span>or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Your Name:</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-[#161824] text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Google Email:</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-[#161824] text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase"
                >
                  Continue
                </button>
              </form>

              {onLoadDemoUser && (
                <div className="pt-2 border-t border-white/10 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignInModal(false);
                      onLoadDemoUser();
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center justify-center gap-1.5 mx-auto transition"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Explore as Demo User (All Badges & Certs Unlocked)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
