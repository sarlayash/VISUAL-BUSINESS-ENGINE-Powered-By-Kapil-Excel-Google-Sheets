import React, { useState, useEffect } from 'react';
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Award,
  Lock,
  ChevronRight,
  Code,
  FileSpreadsheet,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile, AssessmentScore, CellValue } from '../types';
import { MODULE_ASSESSMENTS } from '../data/assessmentsData';
import { saveModuleAssessmentResult } from '../utils/storage';
import { evaluateFormula } from '../utils/formulaEngine';
import { playClick, playSuccess, playError } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface AssessmentsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onTryInIde?: (dataset: any, formula: string, taskTitle: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onTryInIde,
  onNavigateTab,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [exerciseFormulas, setExerciseFormulas] = useState<{ [eId: string]: string }>({});
  const [exerciseResults, setExerciseResults] = useState<{
    [eId: string]: { value: CellValue; passed: boolean; message?: string };
  }>({});
  const [submittedScore, setSubmittedScore] = useState<AssessmentScore | null>(null);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

  const activeAssessment =
    MODULE_ASSESSMENTS.find((m) => m.moduleId === selectedModuleId) || MODULE_ASSESSMENTS[0];

  // Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (isTestActive && secondsRemaining > 0 && !submittedScore) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, secondsRemaining, submittedScore]);

  // Start Assessment
  const handleStartTest = (moduleId: number) => {
    playClick();
    setSelectedModuleId(moduleId);
    const assessment = MODULE_ASSESSMENTS.find((m) => m.moduleId === moduleId) || MODULE_ASSESSMENTS[0];
    setSecondsRemaining(assessment.timeLimitMinutes * 60);
    setAnswers({});
    const initialFormulas: { [id: string]: string } = {};
    assessment.exercises.forEach((ex) => {
      initialFormulas[ex.id] = ex.starterFormula || '';
    });
    setExerciseFormulas(initialFormulas);
    setExerciseResults({});
    setSubmittedScore(null);
    setIsReviewMode(false);
    setIsTestActive(true);
  };

  // Test an individual exercise formula live
  const handleTestExerciseFormula = (exerciseId: string) => {
    playClick();
    const exercise = activeAssessment.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const rawFormula = (exerciseFormulas[exerciseId] || '').trim();
    if (!rawFormula.startsWith('=')) {
      setExerciseResults((prev) => ({
        ...prev,
        [exerciseId]: {
          value: '#ERROR!',
          passed: false,
          message: 'Formula must start with an equals sign (=). Example: =SUM(B2:B5)',
        },
      }));
      playError();
      return;
    }

    // Build grid from exercise initial dataset
    const grid: any = {};
    exercise.dataset.headers.forEach((h, colIdx) => {
      const colLetter = String.fromCharCode(65 + colIdx);
      grid[`${colLetter}1`] = { raw: h, computed: h };
    });
    exercise.dataset.rows.forEach((row, rowIdx) => {
      row.forEach((cellVal, colIdx) => {
        const colLetter = String.fromCharCode(65 + colIdx);
        grid[`${colLetter}${rowIdx + 2}`] = { raw: String(cellVal), computed: cellVal };
      });
    });

    const evaluated = evaluateFormula(rawFormula, grid, exercise.targetCell);

    // Validate expected result
    let passed = false;
    let message = '';

    const hasKeywords = exercise.expectedFormulaKeywords.every((kw) =>
      rawFormula.toUpperCase().includes(kw.toUpperCase())
    );

    let valMatches = false;
    if (typeof exercise.expectedValue === 'number') {
      const actualNum = typeof evaluated.value === 'number' ? evaluated.value : parseFloat(String(evaluated.value));
      const tolerance = exercise.tolerance || 0.01;
      valMatches = !isNaN(actualNum) && Math.abs(actualNum - (exercise.expectedValue as number)) <= tolerance;
    } else {
      valMatches =
        String(evaluated.value).toLowerCase().trim() ===
        String(exercise.expectedValue).toLowerCase().trim();
    }

    if (valMatches && hasKeywords) {
      passed = true;
      message = `Verified! Computed result: ${evaluated.value}`;
      playSuccess();
    } else if (!valMatches) {
      passed = false;
      message = `Computed ${evaluated.value}, expected ${exercise.expectedValue}`;
      playError();
    } else {
      passed = false;
      message = `Expected formula logic containing ${exercise.expectedFormulaKeywords.join(', ')}`;
      playError();
    }

    setExerciseResults((prev) => ({
      ...prev,
      [exerciseId]: { value: evaluated.value, passed, message },
    }));
  };

  // Submit Assessment
  const handleSubmitAssessment = () => {
    let correctQuestions = 0;
    activeAssessment.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctQuestions += 1;
      }
    });

    let correctExercises = 0;
    activeAssessment.exercises.forEach((ex) => {
      // Evaluate if not already run
      if (exerciseResults[ex.id]?.passed) {
        correctExercises += 1;
      } else {
        // Run verification on current formula string
        const formula = (exerciseFormulas[ex.id] || '').trim();
        const grid: any = {};
        ex.dataset.headers.forEach((h, colIdx) => {
          grid[`${String.fromCharCode(65 + colIdx)}1`] = { raw: h, computed: h };
        });
        ex.dataset.rows.forEach((row, rowIdx) => {
          row.forEach((cellVal, colIdx) => {
            grid[`${String.fromCharCode(65 + colIdx)}${rowIdx + 2}`] = { raw: String(cellVal), computed: cellVal };
          });
        });
        const evalRes = evaluateFormula(formula, grid, ex.targetCell);
        let valMatch = false;
        if (typeof ex.expectedValue === 'number') {
          const num = typeof evalRes.value === 'number' ? evalRes.value : parseFloat(String(evalRes.value));
          valMatch = !isNaN(num) && Math.abs(num - (ex.expectedValue as number)) <= (ex.tolerance || 0.01);
        } else {
          valMatch = String(evalRes.value).toLowerCase().trim() === String(ex.expectedValue).toLowerCase().trim();
        }
        const kwMatch = ex.expectedFormulaKeywords.every((kw) =>
          formula.toUpperCase().includes(kw.toUpperCase())
        );
        if (valMatch && kwMatch) {
          correctExercises += 1;
          exerciseResults[ex.id] = { value: evalRes.value, passed: true, message: 'Verified!' };
        }
      }
    });

    const totalQuestions = activeAssessment.questions.length; // 10
    const totalExercises = activeAssessment.exercises.length; // 5
    const totalItems = totalQuestions + totalExercises; // 15
    const totalEarned = correctQuestions + correctExercises;
    const finalScorePercent = Math.round((totalEarned / totalItems) * 100);

    const timeSpent = activeAssessment.timeLimitMinutes * 60 - secondsRemaining;

    // Save strictly with 80% passing rule
    const res = saveModuleAssessmentResult(
      activeAssessment.moduleId,
      activeAssessment.badgeName,
      finalScorePercent,
      correctQuestions,
      totalQuestions,
      correctExercises,
      totalExercises,
      timeSpent
    );

    if (res) {
      onUpdateProfile(res.profile);
    }

    const scoreObj: AssessmentScore = {
      moduleId: activeAssessment.moduleId,
      score: finalScorePercent,
      passed: finalScorePercent >= 80,
      correctQuestions,
      totalQuestions,
      correctExercises,
      totalExercises,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
    };

    setSubmittedScore(scoreObj);
    setIsReviewMode(true);

    if (finalScorePercent >= 80) {
      playSuccess();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#FFFFFF', '#FBBF24'],
        });
      } catch (e) {}
    } else {
      playError();
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your assessment for grading...');
    handleSubmitAssessment();
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              TIMER-BASED CERTIFICATION EXAMS
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Strict 80% Passing Threshold Required
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Module Assessments & Mock Tests</h1>
          <p className="text-sm text-gray-400 mt-1">
            Timed testing environments: 10 scenario questions + 5 interactive spreadsheet exercises for every module
          </p>
        </div>

        {/* Passing Rule Pill */}
        <div className="flex items-center gap-2 bg-[#141624] px-4 py-2 rounded-xl border border-amber-500/30">
          <Award className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <div className="text-gray-400">Accreditation Benchmark:</div>
            <strong className="text-amber-300">≥ 80% Score to Unlock Badges & Certs</strong>
          </div>
        </div>
      </div>

      {/* ================= IF NOT CURRENTLY IN ACTIVE EXAM: SHOW 5 MODULE CARDS ================= */}
      {!isTestActive && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULE_ASSESSMENTS.map((m) => {
              const prevResult = userProfile.moduleScores?.[m.moduleId];
              const isPassed = prevResult?.passed || false;
              const bestScore = prevResult?.score || 0;

              return (
                <div
                  key={m.moduleId}
                  className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    isPassed
                      ? 'bg-[#0c131a] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : bestScore > 0
                      ? 'bg-[#151118] border-amber-500/30'
                      : 'bg-[#0f111a] border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#181a28] text-amber-300 border border-white/5">
                        Module {m.moduleId} Exam
                      </span>
                      {isPassed ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Certified ({bestScore}%)
                        </span>
                      ) : bestScore > 0 ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Needs 80% ({bestScore}%)
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-amber-400/70" />
                          Badge Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">{m.moduleTitle}</h3>

                    <div className="space-y-2 text-xs text-gray-400 bg-[#08090f] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span>Associated Badge:</span>
                        <strong className="text-amber-300">{m.badgeName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Format:</span>
                        <span className="text-gray-300">10 Questions + 5 Exercises</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time Limit:</span>
                        <span className="text-gray-300">{m.timeLimitMinutes} Minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Required to Unlock:</span>
                        <strong className="text-amber-400">80% (12 / 15 correct)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-gray-500">
                      {isPassed ? 'Ready to retake anytime' : 'Strict 80% unlock policy'}
                    </div>
                    <button
                      onClick={() => handleStartTest(m.moduleId)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                        isPassed
                          ? 'bg-[#181c28] hover:bg-white/10 text-emerald-300 border border-emerald-500/30'
                          : 'gold-gradient-btn text-black shadow-lg'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isPassed ? 'Retake Exam' : 'Start Assessment'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ACTIVE ASSESSMENT TEST RUNNER ================= */}
      {isTestActive && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Sticky Test Bar */}
          <div className="sticky top-16 z-30 bg-[#0c0d14]/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                Module {activeAssessment.moduleId} Assessment
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                {activeAssessment.moduleTitle}
              </h2>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
                  secondsRemaining < 300
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                    : 'bg-[#181b28] text-amber-300 border-amber-500/30'
                }`}
              >
                <Timer className="w-4 h-4 text-amber-400" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>

              {!submittedScore ? (
                <button
                  onClick={handleSubmitAssessment}
                  className="px-5 py-2 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wide shadow-lg active:scale-95 transition"
                >
                  Submit & Grade Test
                </button>
              ) : (
                <button
                  onClick={() => setIsTestActive(false)}
                  className="px-4 py-2 rounded-xl bg-[#191b28] text-gray-300 hover:text-white border border-white/10 text-xs font-semibold"
                >
                  Exit Exam View
                </button>
              )}
            </div>
          </div>

          {/* ================= SUBMITTED SCORE SUMMARY BANNER ================= */}
          {submittedScore && (
            <div
              className={`p-6 sm:p-8 rounded-2xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 ${
                submittedScore.passed
                  ? 'bg-gradient-to-r from-[#0c1d18] to-[#0d1624] border-emerald-500/50'
                  : 'bg-gradient-to-r from-[#201018] to-[#141624] border-rose-500/40'
              }`}
            >
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  {submittedScore.passed ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PASSED WITH HONORS (≥ 80%)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-400" /> PASSING REQUIREMENT NOT MET
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white">
                  {submittedScore.passed
                    ? `Congratulations! You scored ${submittedScore.score}%!`
                    : `Score: ${submittedScore.score}% — 80% is Required to Unlock Badge & Certificate`}
                </h3>

                <p className="text-xs text-gray-300 max-w-xl">
                  {submittedScore.passed
                    ? `You successfully answered ${submittedScore.correctQuestions}/${submittedScore.totalQuestions} questions and passed ${submittedScore.correctExercises}/${submittedScore.totalExercises} practical spreadsheet exercises. Badge "${activeAssessment.badgeName}" is now UNLOCKED!`
                    : `You got ${submittedScore.correctQuestions}/${submittedScore.totalQuestions} questions and ${submittedScore.correctExercises}/${submittedScore.totalExercises} exercises correct. Review the solutions below and retake the test to secure your verified badge.`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  onClick={() => handleStartTest(activeAssessment.moduleId)}
                  className="px-4 py-2.5 rounded-xl bg-[#1a1d2e] hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Retake Test</span>
                </button>

                {submittedScore.passed && onNavigateTab && (
                  <button
                    onClick={() => {
                      playClick();
                      onNavigateTab('certificates');
                    }}
                    className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wide flex items-center gap-2 shadow-xl"
                  >
                    <Award className="w-4 h-4 fill-black" />
                    <span>View Unlocked Badge</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION 1: 10 SCENARIO QUESTIONS ================= */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs border border-amber-500/30">
                1
              </span>
              <h3 className="text-xl font-bold text-white">
                Part A: 10 Scenario & Conceptual Questions
              </h3>
            </div>

            <div className="space-y-6">
              {activeAssessment.questions.map((q, qIndex) => {
                const userSelected = answers[q.id];
                const isCorrect = userSelected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`bg-[#0f111a] rounded-2xl p-6 border transition-all ${
                      submittedScore
                        ? isCorrect
                          ? 'border-emerald-500/40 bg-[#0b1614]'
                          : 'border-rose-500/40 bg-[#160d13]'
                        : 'border-white/10'
                    }`}
                  >
                    {/* Scenario pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Question {qIndex + 1} of 10
                      </span>
                      {submittedScore && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            isCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" /> Incorrect (0)
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 italic mb-2">Scenario: {q.scenario}</div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-4 leading-relaxed">
                      {q.question}
                    </h4>

                    {/* 4 Multiple Choice Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        const isAnswerKey = q.correctIndex === optIdx;

                        let btnStyle = 'bg-[#151724] border-white/10 text-gray-300 hover:border-amber-400/50';
                        if (submittedScore) {
                          if (isAnswerKey) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isChosen && !isAnswerKey) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 line-through';
                          } else {
                            btnStyle = 'bg-[#10121c] border-white/5 text-gray-500';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={!!submittedScore}
                            onClick={() => {
                              playClick();
                              setAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            }}
                            className={`p-3.5 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {submittedScore && (
                      <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-300 bg-[#0a0b12] p-3 rounded-xl">
                        <strong className="text-amber-400">Kapil's Solution Note: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= SECTION 2: 5 INTERACTIVE EXERCISES ================= */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs border border-amber-500/30">
                2
              </span>
              <h3 className="text-xl font-bold text-white">
                Part B: 5 Practical Hands-On Spreadsheet Exercises
              </h3>
            </div>

            <div className="space-y-6">
              {activeAssessment.exercises.map((ex, exIndex) => {
                const result = exerciseResults[ex.id];
                const isPassed = result?.passed || false;

                return (
                  <div
                    key={ex.id}
                    className={`bg-[#0f111a] rounded-2xl p-6 border transition-all ${
                      submittedScore
                        ? isPassed
                          ? 'border-emerald-500/40 bg-[#0b1614]'
                          : 'border-rose-500/40 bg-[#160d13]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Exercise {exIndex + 1} of 5 • Target Cell: {ex.targetCell}
                      </span>
                      {result && (
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            result.passed ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {result.passed ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Exercise Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" /> Test Failed
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{ex.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{ex.scenario}</p>
                    <div className="p-3 bg-[#151724] border border-amber-500/20 rounded-xl text-xs text-amber-200 mb-4 font-medium">
                      🎯 <strong>Objective:</strong> {ex.task}
                    </div>

                    {/* Dataset Preview Grid */}
                    <div className="overflow-x-auto mb-4 border border-white/10 rounded-xl bg-[#08090f]">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#121422] text-amber-300 border-b border-white/10 font-mono">
                          <tr>
                            <th className="p-2 border-r border-white/10 w-10 text-center text-gray-500">
                              #
                            </th>
                            {ex.dataset.headers.map((h, i) => (
                              <th key={i} className="p-2 border-r border-white/10">
                                {String.fromCharCode(65 + i)}: {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ex.dataset.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="p-2 border-r border-white/10 font-mono text-center text-gray-500">
                                {rIdx + 2}
                              </td>
                              {row.map((cellVal, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`p-2 border-r border-white/10 font-mono ${
                                    cellVal === '' ? 'bg-amber-500/10 text-amber-300 italic' : 'text-gray-300'
                                  }`}
                                >
                                  {cellVal === '' ? `[Target ${ex.targetCell}]` : String(cellVal)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Formula Input Box & Live Test Runner */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            disabled={!!submittedScore}
                            value={exerciseFormulas[ex.id] || ''}
                            onChange={(e) =>
                              setExerciseFormulas((prev) => ({
                                ...prev,
                                [ex.id]: e.target.value,
                              }))
                            }
                            placeholder={`Type formula for cell ${ex.targetCell} (e.g. ${ex.starterFormula || '=SUM(...)'})`}
                            className="w-full bg-[#141624] border border-amber-500/40 rounded-xl px-4 py-2.5 font-mono text-sm text-amber-300 focus:outline-none focus:border-amber-400 placeholder-gray-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={!!submittedScore}
                            onClick={() => handleTestExerciseFormula(ex.id)}
                            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Verify Formula</span>
                          </button>

                          {/* Try in IDE button */}
                          {onTryInIde && (
                            <button
                              onClick={() => {
                                playClick();
                                onTryInIde(
                                  ex.dataset,
                                  exerciseFormulas[ex.id] || ex.starterFormula || '',
                                  ex.title
                                );
                              }}
                              className="px-3 py-2.5 rounded-xl bg-[#181b28] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5"
                              title="Open in full Spreadsheet Simulator IDE"
                            >
                              <Code className="w-3.5 h-3.5 text-amber-400" />
                              <span className="hidden sm:inline">Try in IDE</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Result feedback */}
                      {result && (
                        <div
                          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            result.passed
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {result.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span>{result.message}</span>
                        </div>
                      )}

                      {/* Hint or Solution */}
                      {submittedScore && (
                        <div className="mt-3 text-xs bg-[#090a12] p-3 rounded-xl border border-white/5 space-y-1">
                          <div className="text-amber-400 font-bold">Kapil's Solution Note:</div>
                          <div className="text-gray-300">{ex.explanation}</div>
                          <div className="font-mono text-emerald-400">
                            Accepted formula: {ex.starterFormula}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Submit Action */}
          {!submittedScore && (
            <div className="bg-[#121422] p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-300">
                Finished all 10 questions and 5 practical exercises? Click submit to verify your score against the strict 80% certification benchmark.
              </div>
              <button
                onClick={handleSubmitAssessment}
                className="px-6 py-3 rounded-xl gold-gradient-btn text-black font-black text-xs uppercase tracking-wider shadow-2xl active:scale-95 transition"
              >
                Submit & Grade Assessment (15 Items)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
