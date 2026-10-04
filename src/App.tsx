import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SpreadsheetSimulator } from './components/SpreadsheetSimulator';
import { CurriculumView } from './components/CurriculumView';
import { BusinessLabsView } from './components/BusinessLabsView';
import { CapstoneView } from './components/CapstoneView';
import { BadgesAndCertificatesView } from './components/BadgesAndCertificatesView';
import { VerificationPortal } from './components/VerificationPortal';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminDashboard } from './components/AdminDashboard';
import { MODULES_DATA } from './data/modulesData';
import { Challenge, IndustryLab, UserProfile } from './types';
import { loadUserProfile, saveUserProfile, addXpAndProgress } from './utils/storage';
import { playClick, playSuccess, playLevelUp } from './utils/soundEffects';
import { Smartphone, Download, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  const [activeChallengeId, setActiveChallengeId] = useState<string>('m1_c1');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);

  // Capture PWA beforeinstallprompt event
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
      alert('To install Visual Business Engine:\n\n• On Android/Chrome: Tap Chrome menu (⋮) → "Install app" or "Add to Home screen"\n• On iPhone/Safari: Tap Share (⎋) → "Add to Home Screen"');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPwaBanner(false);
      setDeferredPrompt(null);
    }
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
    setUserProfile(nextProfile);

    // Check if entire module is complete
    const currentMod = MODULES_DATA.find((m) => m.id === currentChallenge.moduleId);
    if (currentMod) {
      const allInModPassed = currentMod.challenges.every((c) =>
        nextProfile.completedChallenges.includes(c.id)
      );
      if (allInModPassed && !nextProfile.completedModules.includes(currentMod.id)) {
        const withMod = addXpAndProgress(200, undefined, currentMod.badgeName, currentMod.id);
        setUserProfile(withMod);
        playLevelUp();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#F59E0B', '#FBBF24', '#FFFFFF'],
          });
        } catch (e) {}
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
    // Generate ad-hoc challenge matching lab
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
        { level: 1, title: 'Concept', text: `Use mathematical or conditional formulas to answer: ${lab.keyQuestions[0]}`, penaltyXp: 10 },
        { level: 2, title: 'Direction', text: `Recommended syntax: ${lab.starterFormulaHint}`, penaltyXp: 20 },
        { level: 3, title: 'Guided', text: `Enter ${lab.starterFormulaHint} in target cell.`, penaltyXp: 30 },
      ],
      solutionExplanation: `Successfully synthesized business intelligence for ${lab.companyName}!`,
      excelFormula: lab.starterFormulaHint,
      googleSheetsFormula: lab.starterFormulaHint,
      xpReward: 160,
    };

    // Set as custom challenge
    MODULES_DATA[3].challenges.push(labChallenge);
    setActiveChallengeId(labChallenge.id);
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
      />

      {/* Main App Container */}
      <main className="flex-1 flex flex-col">
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

        {activeTab === 'curriculum' && (
          <CurriculumView
            userProfile={userProfile}
            onSelectChallenge={(id) => setActiveChallengeId(id)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'labs' && (
          <BusinessLabsView onLaunchSimulatorWithLab={handleLaunchSimulatorWithLab} />
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
          <BadgesAndCertificatesView userProfile={userProfile} />
        )}

        {activeTab === 'verify' && <VerificationPortal />}

        {activeTab === 'leaderboard' && <LeaderboardView userProfile={userProfile} />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* FOOTER (PRD Page 1, 30, 37, 44) */}
      <footer className="bg-[#050608] border-t border-white/5 py-8 px-4 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-gray-400 font-semibold">
          <span className="text-amber-400">SARLAYASH MISSION PRESENTS</span>
          <span>•</span>
          <span className="text-white">VISUAL BUSINESS ENGINE</span>
          <span>•</span>
          <span className="text-amber-400">POWERED BY KAPIL</span>
        </div>
        <p className="max-w-2xl mx-auto text-gray-500">
          "Don't just learn Excel. Build a Business Engine." • 10% Concept + 90% Hands-On • Zero Software Architecture •
          PWA 100% Offline Enabled for Phones & Desktops.
        </p>
        <p className="text-[11px] text-gray-600">
          © 2026 SarlaYash Mission. All business simulations and curriculum certified.
        </p>
      </footer>
    </div>
  );
}

export default App;
