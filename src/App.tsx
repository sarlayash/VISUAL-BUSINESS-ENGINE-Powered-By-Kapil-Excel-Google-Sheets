import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPageView } from './components/LandingPageView';
import { DashboardView } from './components/DashboardView';
import { SpreadsheetSimulator } from './components/SpreadsheetSimulator';
import { CurriculumView } from './components/CurriculumView';
import { BusinessLabsView } from './components/BusinessLabsView';
import { CapstoneView } from './components/CapstoneView';
import { BadgesAndCertificatesView } from './components/BadgesAndCertificatesView';
import { VerificationPortal } from './components/VerificationPortal';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminDashboard } from './components/AdminDashboard';
import { InbuiltFunctionLab } from './components/InbuiltFunctionLab';
import { AssessmentsView } from './components/AssessmentsView';
import { PivotAndChartsSimulator } from './components/PivotAndChartsSimulator';
import { MacroSimulator } from './components/MacroSimulator';
import { KnowledgeBytesView } from './components/KnowledgeBytesView';
import { MODULES_DATA } from './data/modulesData';
import { Challenge, IndustryLab, UserProfile } from './types';
import {
  loadUserProfile,
  saveUserProfile,
  signInWithGoogle,
  signOutUser,
  addXpAndProgress,
} from './utils/storage';
import { signOutFirebase, onFirebaseAuthStateChange } from './utils/firebase';
import { playClick, playSuccess, playLevelUp } from './utils/soundEffects';
import { Smartphone, Download, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(loadUserProfile());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeChallengeId, setActiveChallengeId] = useState<string>('m1_c1');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChange((fbUser) => {
      if (fbUser) {
        setUserProfile((prev) => {
          if (!prev) {
            return signInWithGoogle(
              fbUser.displayName || 'Google Learner',
              fbUser.email || '',
              fbUser.photoURL || undefined,
              fbUser.uid
            );
          }
          return prev;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Capture PWA beforeinstallprompt event for phone installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert(
        'To install Visual Business Engine:\n\n• On Android/Chrome: Tap Chrome menu (⋮) → "Install app" or "Add to Home screen"\n• On iPhone/Safari: Tap Share (⎋) → "Add to Home Screen"'
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPwaBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleGoogleSignIn = (name: string, email: string, avatar?: string, uid?: string) => {
    const profile = signInWithGoogle(name, email, avatar, uid);
    setUserProfile(profile);
    setActiveTab('dashboard');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FBBF24', '#FFFFFF'],
      });
    } catch (e) {}
  };

  const handleSignOut = () => {
    signOutFirebase().catch(() => {});
    signOutUser();
    setUserProfile(null);
    setActiveTab('landing');
  };

  // Find active challenge object
  const getActiveChallenge = (): Challenge => {
    for (const mod of MODULES_DATA) {
      const found = mod.challenges.find((c) => c.id === activeChallengeId);
      if (found) return found;
    }
    return MODULES_DATA[0].challenges[0];
  };

  const currentChallenge = getActiveChallenge();

  // Handle Challenge Passed
  const handleChallengePassed = (challengeId: string, earnedXp: number) => {
    const nextProfile = addXpAndProgress(earnedXp, challengeId);
    if (!nextProfile) return;
    setUserProfile(nextProfile);

    // Check if entire module is complete
    const currentMod = MODULES_DATA.find((m) => m.id === currentChallenge.moduleId);
    if (currentMod) {
      const allInModPassed = currentMod.challenges.every((c) =>
        nextProfile.completedChallenges.includes(c.id)
      );
      if (allInModPassed && !nextProfile.completedModules.includes(currentMod.id)) {
        const withMod = addXpAndProgress(200, undefined, currentMod.badgeName, currentMod.id);
        if (withMod) {
          setUserProfile(withMod);
          playLevelUp();
          try {
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#F59E0B', '#FBBF24', '#FFFFFF'],
            });
          } catch (e) {}
        }
      }
    }
  };

  // Move to next challenge in curriculum
  const handleNextChallenge = () => {
    playClick();
    const allChallenges = MODULES_DATA.flatMap((m) => m.challenges);
    const currIdx = allChallenges.findIndex((c) => c.id === activeChallengeId);
    if (currIdx !== -1 && currIdx < allChallenges.length - 1) {
      setActiveChallengeId(allChallenges[currIdx + 1].id);
    } else {
      setActiveTab('capstone');
    }
  };

  // Launch Simulator with custom Industry Lab dataset
  const handleLaunchSimulatorWithLab = (lab: IndustryLab) => {
    const labChallenge: Challenge = {
      id: `lab_${lab.id}`,
      moduleId: 4,
      lessonId: `Lab-${lab.industry}`,
      title: `${lab.companyName} — ${lab.title}`,
      difficulty: 'Practitioner',
      businessDomain: lab.industry,
      businessStory: lab.scenario,
      businessGoal: `Analyze ${lab.industry} data and answer: ${lab.keyQuestions[0]}`,
      instructions: [
        'Inspect the loaded industry dataset in the simulation grid.',
        'Review the key management questions in the business panel.',
        `Compute metrics using formula: ${lab.starterFormulaHint}`,
        'Click Validate Result to audit your analytics.',
      ],
      initialData: {
        headers: lab.dataset.headers,
        rows: lab.dataset.rows,
      },
      validationRules: [
        {
          targetCell: 'E2',
          description: `Validate analytical calculation in ${lab.industry} ledger`,
          expectedFormulaKeywords: ['SUM', 'AVERAGE', 'IF', 'COUNT', '*'],
        },
      ],
      hints: [
        {
          level: 1,
          title: 'Concept',
          text: `Use mathematical or conditional formulas to answer: ${lab.keyQuestions[0]}`,
          penaltyXp: 10,
        },
        { level: 2, title: 'Direction', text: `Recommended syntax: ${lab.starterFormulaHint}`, penaltyXp: 20 },
        { level: 3, title: 'Guided', text: `Enter ${lab.starterFormulaHint} in target cell.`, penaltyXp: 30 },
      ],
      solutionExplanation: `Successfully synthesized business intelligence for ${lab.companyName}!`,
      excelFormula: lab.starterFormulaHint,
      googleSheetsFormula: lab.starterFormulaHint,
      xpReward: 160,
    };

    MODULES_DATA[3].challenges.push(labChallenge);
    setActiveChallengeId(labChallenge.id);
    setActiveTab('simulator');
  };

  // Launch Spreadsheet Simulator IDE with custom dataset & formula
  const handleTryInIde = (dataset: any, formula: string, taskTitle: string) => {
    const ideChallenge: Challenge = {
      id: `custom_ide_${Date.now()}`,
      moduleId: 1,
      lessonId: 'IDE',
      title: taskTitle || 'Spreadsheet Simulator IDE',
      difficulty: 'Practitioner',
      businessDomain: 'Enterprise',
      businessStory: 'Interactive IDE environment for custom dataset experimentation.',
      businessGoal: `Test formula ${formula} or experiment with any spreadsheet calculations.`,
      instructions: [
        'Explore the loaded dataset in the interactive spreadsheet grid.',
        'Use the formula bar (fx) to edit, test, and execute custom formulas.',
        'Toggle between Excel and Google Sheets modes.',
      ],
      initialData: {
        headers: dataset.headers,
        rows: dataset.rows,
      },
      validationRules: [],
      hints: [
        { level: 1, title: 'IDE Guide', text: `Currently executing: ${formula}`, penaltyXp: 0 },
      ],
      solutionExplanation: `Formula ${formula} evaluated on this dataset.`,
      excelFormula: formula,
      googleSheetsFormula: formula,
      xpReward: 50,
    };

    MODULES_DATA[0].challenges.push(ideChallenge);
    setActiveChallengeId(ideChallenge.id);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-[#07080b] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* PWA INSTALL FLOATING BANNER (FOR PHONE USERS) */}
      {showPwaBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xl relative z-50">
          <div className="flex items-center gap-2 truncate">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="truncate">
              📱 Install Visual Business Engine to your phone for 100% offline simulation access!
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallPwa}
              className="bg-black text-amber-300 hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
            >
              <Download className="w-3 h-3" /> Install App
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="p-1 hover:bg-black/10 rounded text-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global FAANG Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onUpdateProfile={(p) => {
          saveUserProfile(p);
          setUserProfile(p);
        }}
        deferredPrompt={deferredPrompt}
        onInstallPwa={handleInstallPwa}
        onSignOut={handleSignOut}
        onOpenSignIn={() => setActiveTab('landing')}
      />

      {/* Main App Container */}
      <main className="flex-1 flex flex-col">
        {/* If NOT signed in OR on landing tab: Render Landing Page */}
        {!userProfile || activeTab === 'landing' ? (
          <LandingPageView onSignIn={handleGoogleSignIn} />
        ) : (
          /* When signed in: All content loads dynamically! */
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                userProfile={userProfile}
                onNavigateTab={(tab, meta) => {
                  setActiveTab(tab);
                  if (meta?.challengeId) setActiveChallengeId(meta.challengeId);
                }}
                onSelectChallenge={(id) => setActiveChallengeId(id)}
              />
            )}

            {activeTab === 'simulator' && (
              <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
                <SpreadsheetSimulator
                  challenge={currentChallenge}
                  onChallengePassed={handleChallengePassed}
                  onNextChallenge={handleNextChallenge}
                />
              </div>
            )}

            {activeTab === 'functions' && (
              <InbuiltFunctionLab onTryInIde={handleTryInIde} />
            )}

            {activeTab === 'assessments' && (
              <AssessmentsView
                userProfile={userProfile}
                onUpdateProfile={(p) => {
                  saveUserProfile(p);
                  setUserProfile(p);
                }}
                onTryInIde={handleTryInIde}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'pivots' && (
              <PivotAndChartsSimulator onTryInIde={handleTryInIde} />
            )}

            {activeTab === 'macros' && (
              <MacroSimulator />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeBytesView
                userProfile={userProfile}
                onUpdateProfile={(p) => {
                  saveUserProfile(p);
                  setUserProfile(p);
                }}
              />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumView
                userProfile={userProfile}
                onUpdateProfile={(p) => {
                  saveUserProfile(p);
                  setUserProfile(p);
                }}
                onSelectChallenge={(id) => setActiveChallengeId(id)}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'labs' && (
              <BusinessLabsView
                userProfile={userProfile}
                onUpdateProfile={(p) => {
                  saveUserProfile(p);
                  setUserProfile(p);
                }}
                onLaunchSimulatorWithLab={handleLaunchSimulatorWithLab}
              />
            )}

            {activeTab === 'capstone' && (
              <CapstoneView
                userProfile={userProfile}
                onUpdateProfile={(p) => {
                  saveUserProfile(p);
                  setUserProfile(p);
                }}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'certificates' && (
              <BadgesAndCertificatesView
                userProfile={userProfile}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'verify' && <VerificationPortal />}

            {activeTab === 'leaderboard' && <LeaderboardView userProfile={userProfile} />}

            {activeTab === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#050608] border-t border-white/5 py-8 px-4 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-gray-400 font-semibold">
          <span className="text-amber-400">SARLAYASH MISSION PRESENTS</span>
          <span>•</span>
          <span className="text-white">VISUAL BUSINESS ENGINE</span>
          <span>•</span>
          <span className="text-amber-400">POWERED BY KAPIL</span>
        </div>
        <p className="max-w-2xl mx-auto text-gray-500">
          "Don't just learn Excel. Build a Business Engine." • 10% Concept + 90% Hands-On • Zero
          Software Architecture • PWA 100% Offline Enabled for Phones & Desktops.
        </p>
        <p className="text-[11px] text-gray-600">
          © 2026 SarlaYash Mission. All business simulations and curriculum verified.
        </p>
      </footer>
    </div>
  );
}

export default App;
