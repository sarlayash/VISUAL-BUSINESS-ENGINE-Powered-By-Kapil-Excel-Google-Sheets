import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flag,
  FileCheck,
  Zap,
  Play,
  Download,
  Share2,
  Lock,
} from 'lucide-react';
import { UserProfile, AssessmentScore } from '../types';
import {
  MASTER_ASSESSMENT_MCQS,
  MASTER_ASSESSMENT_EXERCISES,
  getShuffledMasterExamSession,
  ShuffledMCQ,
} from '../data/masterAssessmentData';
import { evaluateFormula } from '../utils/formulaEngine';
import { playClick, playSuccess, playError } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MasterAssessmentViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
  onTryInIde?: (dataset: any, formula: string, taskTitle: string) => void;
}

export const MasterAssessmentView: React.FC<MasterAssessmentViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateTab,
  onTryInIde,
}) => {
  // Session State
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledMCQ[]>([]);
  const [shuffledExercises, setShuffledExercises] = useState(MASTER_ASSESSMENT_EXERCISES);

  // Active Navigation
  const [activeTab, setActiveTab] = useState<'mcq' | 'exercise'>('mcq');
  const [currentMcqIndex, setCurrentMcqIndex] = useState<number>(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  // Answers State
  const [userMcqAnswers, setUserMcqAnswers] = useState<{ [qIndex: number]: number }>({});
  const [flaggedMcqs, setFlaggedMcqs] = useState<{ [qIndex: number]: boolean }>({});
  
  // Exercise inputs & execution
  const [exerciseFormulas, setExerciseFormulas] = useState<{ [eIndex: number]: string }>({});
  const [exerciseResults, setExerciseResults] = useState<{
    [eIndex: number]: { passed: boolean; evaluatedValue: any; message: string };
  }>({});
  const [flaggedExercises, setFlaggedExercises] = useState<{ [eIndex: number]: boolean }>({});

  // 60-Minute Countdown Timer (3600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const timerRef = useRef<any>(null);

  // Initialize a fresh, randomized session
  const startNewExamSession = () => {
    playClick();
    const session = getShuffledMasterExamSession();
    setShuffledQuestions(session.questions);
    setShuffledExercises(session.exercises);
    setUserMcqAnswers({});
    setFlaggedMcqs({});
    setExerciseFormulas({});
    setExerciseResults({});
    setFlaggedExercises({});
    setCurrentMcqIndex(0);
    setCurrentExerciseIndex(0);
    setActiveTab('mcq');
    setSecondsRemaining(3600); // 60 minutes
    setExamStarted(true);
    setExamSubmitted(false);
  };

  // Timer Tick
  useEffect(() => {
    if (examStarted && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, examSubmitted]);

  // Submit Exam & Score Evaluation
  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate MCQ Score
    let correctMcqCount = 0;
    shuffledQuestions.forEach((q, idx) => {
      if (userMcqAnswers[idx] === q.correctIndex) {
        correctMcqCount++;
      }
    });

    // Calculate Exercise Score
    let correctExerciseCount = 0;
    shuffledExercises.forEach((_, idx) => {
      if (exerciseResults[idx]?.passed) {
        correctExerciseCount++;
      }
    });

    const totalQuestions = shuffledQuestions.length || 100;
    const totalExercises = shuffledExercises.length || 50;
    const totalItems = totalQuestions + totalExercises;
    const totalCorrect = correctMcqCount + correctExerciseCount;
    const finalScore = Math.round((totalCorrect / totalItems) * 100);
    const hasPassed = finalScore >= 80;

    const timeSpent = 3600 - secondsRemaining;
    const issueDateStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Valid until 90 days / 3 months later
    const validUntilDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const validUntilStr = validUntilDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const scoreObj: AssessmentScore = {
      moduleId: 999, // Master ID
      score: finalScore,
      passed: hasPassed,
      correctQuestions: correctMcqCount,
      totalQuestions: totalQuestions,
      correctExercises: correctExerciseCount,
      totalExercises: totalExercises,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
    };

    const nextProfile: UserProfile = {
      ...userProfile,
      masterAssessmentScore: scoreObj,
      xp: userProfile.xp + (hasPassed ? 1000 : 250),
    };

    if (hasPassed) {
      playSuccess();
      nextProfile.grandChampionCertificateId = userProfile.grandChampionCertificateId || `SY-GC-${Date.now().toString().slice(-6)}`;
      nextProfile.grandChampionIssueDate = issueDateStr;
      nextProfile.grandChampionValidUntil = validUntilStr;
      nextProfile.lorId = userProfile.lorId || `SY-LOR-${Date.now().toString().slice(-6)}`;
      nextProfile.lorIssueDate = issueDateStr;
      if (!nextProfile.earnedBadges.includes('Grand Champion')) {
        nextProfile.earnedBadges = [...nextProfile.earnedBadges, 'Grand Champion'];
      }

      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#FFFFFF'],
        });
      } catch (e) {}
    } else {
      playError();
    }

    onUpdateProfile(nextProfile);
    setExamSubmitted(true);
  };

  // Evaluate single exercise in live simulation
  const handleExecuteExercise = (exerciseIndex: number) => {
    playClick();
    const ex = shuffledExercises[exerciseIndex];
    const formulaStr = exerciseFormulas[exerciseIndex]?.trim() || '';

    if (!formulaStr) {
      setExerciseResults((prev) => ({
        ...prev,
        [exerciseIndex]: { passed: false, evaluatedValue: '', message: 'Please enter a formula starting with "=".' },
      }));
      return;
    }

    const grid: any = {};
    ex.dataset.headers.forEach((h, colIdx) => {
      grid[`${String.fromCharCode(65 + colIdx)}1`] = { raw: h, computed: h };
    });
    ex.dataset.rows.forEach((row, rowIdx) => {
      row.forEach((cellVal, colIdx) => {
        grid[`${String.fromCharCode(65 + colIdx)}${rowIdx + 2}`] = { raw: String(cellVal), computed: cellVal };
      });
    });

    const evalResult = evaluateFormula(formulaStr, grid, ex.targetCell);
    let isValueMatch = false;

    if (typeof ex.expectedValue === 'number' && typeof evalResult.value === 'number') {
      const tol = ex.tolerance ?? 0.05;
      isValueMatch = Math.abs(evalResult.value - ex.expectedValue) <= tol;
    } else if (typeof ex.expectedValue === 'string') {
      isValueMatch =
        String(evalResult.value).trim().toLowerCase() === ex.expectedValue.trim().toLowerCase();
    } else if (typeof ex.expectedValue === 'boolean') {
      isValueMatch = Boolean(evalResult.value) === ex.expectedValue;
    }

    const upperFormula = formulaStr.toUpperCase();
    const hasRequiredKeywords =
      !ex.expectedFormulaKeywords ||
      ex.expectedFormulaKeywords.length === 0 ||
      ex.expectedFormulaKeywords.some((kw) => upperFormula.includes(kw.toUpperCase()));

    const passed = isValueMatch && hasRequiredKeywords && !evalResult.error;

    if (passed) {
      playSuccess();
    } else {
      playError();
    }

    setExerciseResults((prev) => ({
      ...prev,
      [exerciseIndex]: {
        passed,
        evaluatedValue: evalResult.value,
        message: passed
          ? `Verified! Output: ${evalResult.value}`
          : evalResult.error
          ? `Error: ${evalResult.error}`
          : `Computed: ${evalResult.value} (Expected: ${ex.expectedValue})`,
      },
    }));
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Current MCQ & Exercise objects
  const currentMcq = shuffledQuestions[currentMcqIndex];
  const currentExercise = shuffledExercises[currentExerciseIndex];

  // Total answered counts
  const answeredMcqCount = Object.keys(userMcqAnswers).length;
  const answeredExerciseCount = Object.keys(exerciseResults).filter((k) => exerciseResults[Number(k)]?.passed).length;
  const totalCompletedCount = answeredMcqCount + answeredExerciseCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-gray-200 animate-fade-in">
      {/* ================= INTRO SPLASH SCREEN (WHEN EXAM NOT ACTIVE) ================= */}
      {!examStarted && !examSubmitted && (
        <div className="rounded-3xl bg-gradient-to-br from-[#121424] via-[#0b0c14] to-[#1a1326] border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
                <span>🏆 PINNACLE EXECUTIVE ACCREDITATION</span>
                <span>•</span>
                <span>60-MINUTE BENCHMARK</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Grand Champion Master Assessment
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
                100 Business Scenario MCQs + 50 Live Interactive Exercises. Strict 60-minute duration with
                <strong> dynamically randomized answer sequences</strong> to test authentic analytical mastery.
              </p>
            </div>

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-5xl shadow-2xl shrink-0">
              🏆
            </div>
          </div>

          {/* Core Credentials & Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-mono">Exam Scope:</span>
              <h3 className="text-lg font-bold text-white">100 MCQs + 50 Exercises</h3>
              <p className="text-xs text-gray-400">150 Comprehensive Business Evaluation Points</p>
            </div>
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-mono">Time Duration:</span>
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> 60 Minutes
              </h3>
              <p className="text-xs text-gray-400">Strict countdown with live warnings & auto-submit</p>
            </div>
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-mono">Anti-Pattern Defense:</span>
              <h3 className="text-lg font-bold text-purple-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" /> Randomized Sequences
              </h3>
              <p className="text-xs text-gray-400">Questions & A/B/C/D answer options reshuffle each session</p>
            </div>
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-mono">Accredited Award:</span>
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> Grand Champion Cert
              </h3>
              <p className="text-xs text-gray-400">Valid for 3 Months + Official Executive LOR PDF</p>
            </div>
          </div>

          {/* Previous standing if already attempted */}
          {userProfile.masterAssessmentScore && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{userProfile.masterAssessmentScore.passed ? '🎖️' : '⏱️'}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Previous Attempt:{' '}
                    <strong className={userProfile.masterAssessmentScore.passed ? 'text-emerald-400' : 'text-amber-400'}>
                      {userProfile.masterAssessmentScore.score}% (
                      {userProfile.masterAssessmentScore.passed ? 'Passed ≥ 80%' : 'Needs ≥ 80%'})
                    </strong>
                  </h4>
                  <p className="text-xs text-gray-400">
                    {userProfile.grandChampionValidUntil
                      ? `Grand Champion Credential Active • Valid Until: ${userProfile.grandChampionValidUntil}`
                      : 'You can retake this exam anytime to unlock or renew your 3-month credential.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userProfile.masterAssessmentScore.passed && (
                  <button
                    onClick={() => onNavigateTab('lor')}
                    className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-400/50 text-purple-200 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/50 transition"
                  >
                    <span>Download LOR PDF</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('certificates')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  <span>View Certificates</span>
                </button>
              </div>
            </div>
          )}

          {/* Launch CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={startNewExamSession}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl gold-gradient-btn text-black font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Begin 60-Minute Master Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= ACTIVE 60-MINUTE EXAM VIEW ================= */}
      {examStarted && !examSubmitted && (
        <div className="space-y-6">
          {/* Top Sticky Status Bar with Timer & Progress */}
          <div className="sticky top-16 z-30 bg-[#07080b]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Master Exam in Progress
                </span>
              </div>

              {/* Progress counter */}
              <span className="text-xs font-mono text-amber-300 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                {totalCompletedCount} / 150 Completed
              </span>
            </div>

            {/* Middle: Tab Switcher (100 MCQs vs 50 Exercises) */}
            <div className="flex items-center bg-[#121422] p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => {
                  playClick();
                  setActiveTab('mcq');
                }}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === 'mcq' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Part 1: 100 MCQs ({answeredMcqCount}/100)
              </button>
              <button
                onClick={() => {
                  playClick();
                  setActiveTab('exercise');
                }}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === 'exercise' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Part 2: 50 Live Exercises ({answeredExerciseCount}/50)
              </button>
            </div>

            {/* Right: 60-Min Timer & Submit Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  secondsRemaining < 600
                    ? 'bg-red-950/50 border-red-500 text-red-300 animate-pulse'
                    : 'bg-[#141624] border-amber-500/40 text-amber-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              <button
                onClick={() => {
                  playClick();
                  if (
                    totalCompletedCount < 100 &&
                    !window.confirm(
                      `You have completed ${totalCompletedCount} of 150 items. Are you sure you want to submit now?`
                    )
                  ) {
                    return;
                  }
                  handleSubmitExam();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* ================= PART 1: 100 MCQS VIEW ================= */}
          {activeTab === 'mcq' && currentMcq && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Body (Col 1-3) */}
              <div className="lg:col-span-3 bg-[#0d0e16] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      Question {currentMcqIndex + 1} of {shuffledQuestions.length}
                    </span>
                    {flaggedMcqs[currentMcqIndex] && (
                      <span className="text-xs text-orange-400 font-bold flex items-center gap-1">
                        <Flag className="w-3.5 h-3.5 fill-orange-400" /> Flagged for Review
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      playClick();
                      setFlaggedMcqs((prev) => ({
                        ...prev,
                        [currentMcqIndex]: !prev[currentMcqIndex],
                      }));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                      flaggedMcqs[currentMcqIndex]
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-[#151724] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>{flaggedMcqs[currentMcqIndex] ? 'Unflag' : 'Flag'}</span>
                  </button>
                </div>

                {/* Scenario box */}
                <div className="bg-[#141624] p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Business Context Scenario:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 italic">{currentMcq.scenario}</p>
                </div>

                {/* Question Title */}
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentMcq.question}
                </h3>

                {/* Randomized Options */}
                <div className="space-y-3 pt-2">
                  {currentMcq.options.map((option, optIdx) => {
                    const isSelected = userMcqAnswers[currentMcqIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          playClick();
                          setUserMcqAnswers((prev) => ({
                            ...prev,
                            [currentMcqIndex]: optIdx,
                          }));
                        }}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                            : 'bg-[#11131e] border-white/5 hover:border-amber-500/30 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected
                                ? 'bg-amber-500 text-black'
                                : 'bg-[#191b29] text-gray-400 border border-white/5'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Prev / Next MCQ Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    disabled={currentMcqIndex === 0}
                    onClick={() => {
                      playClick();
                      setCurrentMcqIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    disabled={currentMcqIndex === shuffledQuestions.length - 1}
                    onClick={() => {
                      playClick();
                      setCurrentMcqIndex((prev) => Math.min(shuffledQuestions.length - 1, prev + 1));
                    }}
                    className="px-5 py-2 rounded-xl gold-gradient-btn text-black disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 fill-black" />
                  </button>
                </div>
              </div>

              {/* Navigation Palette (Col 4) */}
              <div className="bg-[#0b0c14] border border-white/5 rounded-2xl p-4 space-y-4 h-fit max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Questions Palette</h4>
                  <span className="text-[10px] text-gray-400">100 Items</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {shuffledQuestions.map((_, idx) => {
                    const isAnswered = userMcqAnswers[idx] !== undefined;
                    const isCurrent = currentMcqIndex === idx;
                    const isFlagged = flaggedMcqs[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          playClick();
                          setCurrentMcqIndex(idx);
                        }}
                        className={`h-8 rounded-lg font-mono text-[11px] font-bold transition flex items-center justify-center relative ${
                          isCurrent
                            ? 'ring-2 ring-amber-400 bg-amber-500/30 text-white'
                            : isFlagged
                            ? 'bg-orange-500/20 border border-orange-500 text-orange-300'
                            : isAnswered
                            ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                            : 'bg-[#151724] text-gray-500 hover:text-white'
                        }`}
                      >
                        {idx + 1}
                        {isFlagged && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= PART 2: 50 LIVE EXERCISES VIEW ================= */}
          {activeTab === 'exercise' && currentExercise && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Exercise Workspace (Col 1-3) */}
              <div className="lg:col-span-3 bg-[#0d0e16] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                      Exercise {currentExerciseIndex + 1} of {shuffledExercises.length}
                    </span>
                    {exerciseResults[currentExerciseIndex]?.passed ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 font-mono">
                        Target Cell: {currentExercise.targetCell}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onTryInIde && (
                      <button
                        onClick={() => {
                          playClick();
                          onTryInIde(
                            currentExercise.dataset,
                            exerciseFormulas[currentExerciseIndex] || currentExercise.starterFormula || '',
                            `Exercise: ${currentExercise.title}`
                          );
                        }}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 text-xs font-semibold border border-white/10 flex items-center gap-1 transition"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Try in IDE</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playClick();
                        setFlaggedExercises((prev) => ({
                          ...prev,
                          [currentExerciseIndex]: !prev[currentExerciseIndex],
                        }));
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                        flaggedExercises[currentExerciseIndex]
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                          : 'bg-[#151724] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Flag className="w-3 h-3" />
                      <span>{flaggedExercises[currentExerciseIndex] ? 'Unflag' : 'Flag'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{currentExercise.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{currentExercise.scenario}</p>
                </div>

                {/* Task Instructions */}
                <div className="bg-[#141624] border-l-4 border-amber-400 p-4 rounded-r-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Required Analytical Task:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 font-medium">{currentExercise.task}</p>
                </div>

                {/* Dataset Grid Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-gray-400">Simulation Data Grid:</span>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#171926] text-amber-300 font-mono border-b border-white/10">
                        <tr>
                          {currentExercise.dataset.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-3 py-2 font-bold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#0a0b12] font-mono text-gray-300">
                        {currentExercise.dataset.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/5">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                                {cell === '' ? (
                                  <span className="text-amber-400/80 italic font-sans text-[11px]">
                                    [Target: {currentExercise.targetCell}]
                                  </span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Live Formula Input Bar */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 bg-[#121422] border border-amber-500/40 rounded-xl p-2.5">
                    <span className="text-amber-400 font-mono font-bold text-sm px-2">fx</span>
                    <input
                      type="text"
                      placeholder={`e.g. ${currentExercise.starterFormula || '=B2*C2'}`}
                      value={exerciseFormulas[currentExerciseIndex] ?? (currentExercise.starterFormula || '')}
                      onChange={(e) =>
                        setExerciseFormulas({
                          ...exerciseFormulas,
                          [currentExerciseIndex]: e.target.value,
                        })
                      }
                      className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => handleExecuteExercise(currentExerciseIndex)}
                      className="px-4 py-1.5 rounded-lg gold-gradient-btn text-black font-extrabold text-xs uppercase transition shadow active:scale-95"
                    >
                      Validate
                    </button>
                  </div>

                  {/* Execution Feedback Message */}
                  {exerciseResults[currentExerciseIndex] && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                        exerciseResults[currentExerciseIndex].passed
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                          : 'bg-red-950/40 border-red-500 text-red-300'
                      }`}
                    >
                      {exerciseResults[currentExerciseIndex].passed ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                      )}
                      <span>{exerciseResults[currentExerciseIndex].message}</span>
                    </div>
                  )}
                </div>

                {/* Prev / Next Exercise Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    disabled={currentExerciseIndex === 0}
                    onClick={() => {
                      playClick();
                      setCurrentExerciseIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Exercise
                  </button>

                  <button
                    disabled={currentExerciseIndex === shuffledExercises.length - 1}
                    onClick={() => {
                      playClick();
                      setCurrentExerciseIndex((prev) => Math.min(shuffledExercises.length - 1, prev + 1));
                    }}
                    className="px-5 py-2 rounded-xl gold-gradient-btn text-black disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition shadow"
                  >
                    <span>Next Exercise</span>
                    <ChevronRight className="w-4 h-4 fill-black" />
                  </button>
                </div>
              </div>

              {/* Navigation Palette for Exercises (Col 4) */}
              <div className="bg-[#0b0c14] border border-white/5 rounded-2xl p-4 space-y-4 h-fit max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Exercises Palette</h4>
                  <span className="text-[10px] text-gray-400">50 Items</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {shuffledExercises.map((_, idx) => {
                    const isPassed = exerciseResults[idx]?.passed;
                    const isCurrent = currentExerciseIndex === idx;
                    const isFlagged = flaggedExercises[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          playClick();
                          setCurrentExerciseIndex(idx);
                        }}
                        className={`h-8 rounded-lg font-mono text-[11px] font-bold transition flex items-center justify-center relative ${
                          isCurrent
                            ? 'ring-2 ring-amber-400 bg-amber-500/30 text-white'
                            : isFlagged
                            ? 'bg-orange-500/20 border border-orange-500 text-orange-300'
                            : isPassed
                            ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                            : 'bg-[#151724] text-gray-500 hover:text-white'
                        }`}
                      >
                        {idx + 1}
                        {isFlagged && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= POST-EXAM RESULTS SCREEN ================= */}
      {examSubmitted && userProfile.masterAssessmentScore && (
        <div className="rounded-3xl bg-gradient-to-br from-[#121424] via-[#0b0c14] to-[#1a1326] border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-4xl shadow-2xl">
              {userProfile.masterAssessmentScore.passed ? '🏆' : '⏱️'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {userProfile.masterAssessmentScore.passed
                ? 'Master Assessment Triumphed!'
                : 'Master Assessment Completed'}
            </h2>
            <p className="text-sm text-gray-300 max-w-lg mx-auto">
              {userProfile.masterAssessmentScore.passed
                ? 'Congratulations! You have attained the pinnacle benchmark score of ≥ 80% and unlocked the Grand Champion Executive Accreditation.'
                : 'You scored below the strict 80% threshold. Review the results below and retake with a newly randomized session.'}
            </p>
          </div>

          {/* Results Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-xs text-gray-400 font-mono">Final Combined Score:</span>
              <div
                className={`text-3xl font-black font-mono mt-1 ${
                  userProfile.masterAssessmentScore.passed ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {userProfile.masterAssessmentScore.score}%
              </div>
              <span className="text-[11px] text-gray-400">Strict passing benchmark: 80%</span>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-xs text-gray-400 font-mono">Part 1 MCQs Correct:</span>
              <div className="text-3xl font-black font-mono text-white mt-1">
                {userProfile.masterAssessmentScore.correctQuestions} / 100
              </div>
              <span className="text-[11px] text-gray-400">Randomized sequences</span>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-xs text-gray-400 font-mono">Part 2 Exercises:</span>
              <div className="text-3xl font-black font-mono text-white mt-1">
                {userProfile.masterAssessmentScore.correctExercises} / 50
              </div>
              <span className="text-[11px] text-gray-400">Live grid executions</span>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-4 text-center">
              <span className="text-xs text-gray-400 font-mono">Validity Period:</span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                3 Months
              </div>
              <span className="text-[11px] text-gray-400">
                {userProfile.grandChampionValidUntil ? `Until ${userProfile.grandChampionValidUntil}` : 'Quarterly cycle'}
              </span>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10">
            {userProfile.masterAssessmentScore.passed && (
              <>
                <button
                  onClick={() => onNavigateTab('certificates')}
                  className="px-6 py-3.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                >
                  <Award className="w-4 h-4 fill-black" />
                  <span>View Grand Champion Certificate (Valid 3 Mos)</span>
                </button>

                <button
                  onClick={() => onNavigateTab('lor')}
                  className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official LOR PDF</span>
                </button>
              </>
            )}

            <button
              onClick={startNewExamSession}
              className="px-6 py-3.5 rounded-xl bg-[#141624] hover:bg-white/10 border border-white/10 text-gray-200 font-bold text-xs flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Master Assessment (New Random Session)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
