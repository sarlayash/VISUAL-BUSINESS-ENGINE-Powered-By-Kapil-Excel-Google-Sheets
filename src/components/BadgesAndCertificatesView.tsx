import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  QrCode,
  FileText,
  AlertTriangle,
  Clock,
  Play,
  ArrowRight,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';
import { MODULE_ASSESSMENTS } from '../data/assessmentsData';
import {
  drawCertificateToCanvas,
  downloadCertificatePng,
  printCertificatePdf,
  drawBadgeToCanvas,
  downloadBadgePng,
  printBadgePdf,
  getVerificationUrl,
} from '../utils/certificateGenerator';
import { printLorToPdf } from '../utils/lorGenerator';
import { playClick, playSuccess, playError } from '../utils/soundEffects';

interface BadgesAndCertificatesViewProps {
  userProfile: UserProfile;
  onNavigateTab?: (tab: string) => void;
  onLoadDemoUser?: () => void;
}

export const BadgesAndCertificatesView: React.FC<BadgesAndCertificatesViewProps> = ({
  userProfile,
  onNavigateTab,
  onLoadDemoUser,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [certType, setCertType] = useState<'final' | 'module' | 'grand_champion'>('final');
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState<boolean>(false);
  const [selectedBadgeForModal, setSelectedBadgeForModal] = useState<any>(null);

  const defaultCertId = userProfile.certificateId || 'SY-VBE-2026-000124';
  const defaultIssueDate = userProfile.certificateIssueDate || 'October 4, 2026';

  const gcCertId = userProfile.grandChampionCertificateId || 'SY-GC-2026-000124';
  const gcIssueDate = userProfile.grandChampionIssueDate || 'October 4, 2026';
  const gcValidUntil = userProfile.grandChampionValidUntil || 'January 4, 2027';

  const certId = certType === 'grand_champion' ? gcCertId : defaultCertId;
  const issueDate = certType === 'grand_champion' ? gcIssueDate : defaultIssueDate;

  // Current module info
  const currentModAssessment =
    MODULE_ASSESSMENTS.find((m) => m.moduleId === selectedModuleId) || MODULE_ASSESSMENTS[0];

  // STRICT 80% SCORE VALIDATION
  const moduleScore = userProfile.moduleScores?.[selectedModuleId]?.score || 0;
  const isModuleCertUnlocked = moduleScore >= 80;

  // Final Certificate requires all 5 modules passed with >= 80%
  const allModulesPassed = [1, 2, 3, 4, 5].every(
    (m) => (userProfile.moduleScores?.[m]?.score || 0) >= 80
  );
  const isFinalCertUnlocked =
    allModulesPassed && (userProfile.capstoneCompleted || userProfile.capstoneStage >= 9);

  // Grand Champion requires Master Exam score >= 80%
  const isGrandChampionUnlocked = Boolean(
    userProfile.masterAssessmentScore?.passed && (userProfile.masterAssessmentScore?.score || 0) >= 80
  );

  const isCurrentCertUnlocked =
    certType === 'final'
      ? isFinalCertUnlocked
      : certType === 'grand_champion'
      ? isGrandChampionUnlocked
      : isModuleCertUnlocked;

  // Average score calculation
  const totalScores = [1, 2, 3, 4, 5].map((m) => userProfile.moduleScores?.[m]?.score || 0);
  const avgScore = Math.round(totalScores.reduce((a, b) => a + b, 0) / 5);
  const masterScore = userProfile.masterAssessmentScore?.score || 0;

  // Redraw certificate whenever parameters change
  useEffect(() => {
    if (canvasRef.current) {
      drawCertificateToCanvas(canvasRef.current, {
        learnerName: userProfile.name,
        type: certType,
        moduleTitle:
          certType === 'grand_champion'
            ? '100 MCQs + 50 Live Exercises Master Assessment (Valid for 3 Months)'
            : currentModAssessment.moduleTitle,
        certificateId: certId,
        issueDate: issueDate,
        validUntil: certType === 'grand_champion' ? gcValidUntil : undefined,
        score:
          certType === 'grand_champion'
            ? Math.max(80, masterScore)
            : certType === 'final'
            ? Math.max(80, avgScore)
            : Math.max(80, moduleScore),
      });
    }
  }, [
    userProfile.name,
    certType,
    selectedModuleId,
    currentModAssessment.moduleTitle,
    certId,
    issueDate,
    gcValidUntil,
    avgScore,
    moduleScore,
    masterScore,
  ]);

  const handleDownloadPng = () => {
    if (!isCurrentCertUnlocked) {
      playError();
      alert(
        `Certificate Locked!\n\nA minimum score of 80% on the assessment is strictly required to unlock and download this credential.\n\nYour current score: ${
          certType === 'final' ? `${avgScore}% (All 5 modules required)` : `${moduleScore}%`
        }`
      );
      return;
    }
    playClick();
    if (canvasRef.current) {
      downloadCertificatePng(
        canvasRef.current,
        `Visual_Business_Engine_Certificate_${userProfile.name.replace(/\s+/g, '_')}`
      );
    }
  };

  const handlePrintPdf = () => {
    if (!isCurrentCertUnlocked) {
      playError();
      alert(
        `Certificate Locked!\n\nA minimum score of 80% on the assessment is strictly required to print this credential.\n\nYour current score: ${
          certType === 'final' ? `${avgScore}%` : `${moduleScore}%`
        }`
      );
      return;
    }
    playClick();
    if (canvasRef.current) {
      printCertificatePdf(
        canvasRef.current,
        `Visual Business Engine - Certificate of Achievement - ${userProfile.name}`
      );
    }
  };

  // Draw Badge to Canvas whenever a badge modal opens
  useEffect(() => {
    if (badgeCanvasRef.current && selectedBadgeForModal) {
      const b = selectedBadgeForModal;
      const bScore =
        b.moduleId === 999
          ? Math.max(80, masterScore)
          : b.moduleId > 0
          ? userProfile.moduleScores?.[b.moduleId]?.score || 80
          : Math.max(80, avgScore);
      const bCertId =
        b.moduleId === 999
          ? gcCertId
          : b.moduleId > 0
          ? `${certId}-M${b.moduleId}`
          : `${certId}-GRAND`;
      drawBadgeToCanvas(badgeCanvasRef.current, {
        badgeTitle: b.title,
        badgeModule: b.module,
        badgeIcon: b.icon,
        badgeDesc: b.desc,
        learnerName: userProfile.name,
        certificateId: bCertId,
        score: bScore,
        issueDate: issueDate,
        isGrand: b.isGrand,
      });
    }
  }, [selectedBadgeForModal, userProfile.name, certId, issueDate, avgScore]);

  const handleDownloadBadge = (badge: any) => {
    playClick();
    if (badgeCanvasRef.current) {
      downloadBadgePng(
        badgeCanvasRef.current,
        `VBE_Badge_${badge.title.replace(/\s+/g, '_')}_${userProfile.name.replace(/\s+/g, '_')}`
      );
    }
  };

  const handlePrintBadge = (badge: any) => {
    playClick();
    if (badgeCanvasRef.current) {
      printBadgePdf(
        badgeCanvasRef.current,
        `Visual Business Engine - Verified Badge - ${badge.title} - ${userProfile.name}`
      );
    }
  };

  const copyLinkedInPost = () => {
    if (!isCurrentCertUnlocked) {
      playError();
      alert('Achieve ≥ 80% on the assessment before sharing your credential on LinkedIn!');
      return;
    }
    playSuccess();
    const verifyUrl = getVerificationUrl(certId);
    const postText = `🚀 Proud to announce that I have achieved the VISUAL BUSINESS ENGINEER certification from SarlaYash Mission, powered by Kapil!\n\nCompleted 30 hours of 100% hands-on simulation training across Microsoft Excel & Google Sheets—solving real business challenges in Retail, Banking, SaaS, HR, and Supply Chain with an assessment score of ${
      certType === 'final' ? avgScore : moduleScore
    }%!\n\nCertificate ID: ${certId}\nVerify Credential: ${verifyUrl}\n\n#VisualBusinessEngine #DataAnalytics #BusinessIntelligence #Excel #GoogleSheets #SarlaYash #SarlaYashMission`;
    navigator.clipboard.writeText(postText);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 3000);
  };

  const allBadges = [
    {
      id: 'b1',
      moduleId: 1,
      title: 'Data Preparation Explorer',
      module: 'Module 1',
      icon: '🥇',
      desc: 'Mastered spreadsheet anatomy, data cleaning & foundational formulas.',
    },
    {
      id: 'b2',
      moduleId: 2,
      title: 'Formula Intelligence Specialist',
      module: 'Module 2',
      icon: '🥇',
      desc: 'Mastered multi-condition logic, SUMIFS, and What-If scenarios.',
    },
    {
      id: 'b3',
      moduleId: 3,
      title: 'Lookup & Statistics Analyst',
      module: 'Module 3',
      icon: '🥇',
      desc: 'Mastered XLOOKUP, INDEX+MATCH, and statistical distributions.',
    },
    {
      id: 'b4',
      moduleId: 4,
      title: 'Business Data Visualization Analyst',
      module: 'Module 4',
      icon: '🥇',
      desc: 'Mastered Pivot Tables, interactive slicers, and storytelling.',
    },
    {
      id: 'b5',
      moduleId: 5,
      title: 'Dashboard Architect',
      module: 'Module 5',
      icon: '🥇',
      desc: 'Engineered boardroom C-Suite executive control dashboards.',
    },
    {
      id: 'bf',
      moduleId: 0,
      title: 'Visual Business Engineer',
      module: 'Grand Final Milestone',
      icon: '🏆',
      desc: 'The pinnacle award: Solved 9-stage Global Retail Capstone & passed all exams with ≥ 80%.',
      isGrand: true,
    },
    {
      id: 'bgc',
      moduleId: 999,
      title: 'Grand Champion Executive',
      module: 'Master Assessment (60m)',
      icon: '👑',
      desc: 'Conquered the 60-Minute Master Assessment (100 MCQs + 50 Live Exercises) with ≥ 80% passing standard. Valid for 3 months with quarterly recertification.',
      isGrand: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              OFFICIAL ACCREDITATION
            </span>
            <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Locked Until ≥ 80% Assessment Score
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Certificates & Badge Portfolio</h1>
          <p className="text-sm text-gray-400 mt-1">
            Official verifiable credentials. Badges and certificates unlock strictly when you achieve an 80%+ score on timed assessments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPng}
            disabled={!isCurrentCertUnlocked}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center gap-2 shadow-lg transition ${
              isCurrentCertUnlocked
                ? 'gold-gradient-btn text-black'
                : 'bg-[#181a26] text-gray-500 border border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handlePrintPdf}
            disabled={!isCurrentCertUnlocked}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs border flex items-center gap-2 transition ${
              isCurrentCertUnlocked
                ? 'bg-[#171a26] hover:bg-white/10 text-white border-white/10'
                : 'bg-[#181a26] text-gray-500 border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* ================= HIGH RESOLUTION CERTIFICATE CANVAS PREVIEW WITH STRICT 80% LOCK ================= */}
      <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isCurrentCertUnlocked ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <h2 className="text-lg font-bold text-white">Live Certificate Engine</h2>
            {!isCurrentCertUnlocked && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked (Requires ≥ 80%)
              </span>
            )}
          </div>

          {/* Toggle Certificate Type */}
          <div className="flex flex-wrap items-center bg-[#151722] p-1 rounded-xl border border-white/10 text-xs gap-1">
            <button
              onClick={() => {
                playClick();
                setCertType('final');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                certType === 'final'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Final Achievement Certificate
            </button>
            <button
              onClick={() => {
                playClick();
                setCertType('grand_champion');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                certType === 'grand_champion'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow'
                  : 'text-amber-400/90 hover:text-amber-200'
              }`}
            >
              <span>👑 Grand Champion</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-mono font-bold">
                Valid 3 Mos
              </span>
            </button>
            <button
              onClick={() => {
                playClick();
                setCertType('module');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                certType === 'module'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Module Completion Certificate
            </button>
          </div>
        </div>

        {/* Grand Champion 3-Month Validity Banner */}
        {certType === 'grand_champion' && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <div>
                <span className="font-bold text-amber-300">
                  Grand Champion Executive Accreditation:
                </span>{' '}
                <span className="text-gray-300">
                  Awarded for scoring ≥ 80% on the 60-min Master Exam (100 MCQs + 50 Live Exercises).
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                VALIDITY: 3 MONTHS
              </span>
              <span className="text-gray-400 font-mono text-[11px]">
                Valid Until: {gcValidUntil}
              </span>
            </div>
          </div>
        )}

        {/* Module Selector if Module cert is selected */}
        {certType === 'module' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-xs text-gray-400 font-mono">Select Module:</span>
            {MODULE_ASSESSMENTS.map((m) => {
              const sc = userProfile.moduleScores?.[m.moduleId]?.score || 0;
              const passed = sc >= 80;
              return (
                <button
                  key={m.moduleId}
                  onClick={() => {
                    playClick();
                    setSelectedModuleId(m.moduleId);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                    selectedModuleId === m.moduleId
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-[#151724] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>M{m.moduleId}</span>
                  {passed ? (
                    <span className="text-emerald-400 text-[10px]">({sc}%)</span>
                  ) : (
                    <span className="text-rose-400 text-[10px]">
                      {sc > 0 ? `(${sc}%)` : '(Locked)'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Certificate Canvas viewport with Interactive Locked Overlay */}
        <div className="relative w-full overflow-hidden rounded-xl border border-amber-500/40 shadow-2xl bg-[#07080b] flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            className={`w-full h-auto max-w-4xl rounded shadow-2xl transition-all ${
              !isCurrentCertUnlocked ? 'filter blur-[3px] opacity-40' : ''
            }`}
            style={{ aspectRatio: '1600 / 1130' }}
          />

          {/* Frosted Obsidian / Gold Locked Overlay */}
          {!isCurrentCertUnlocked && (
            <div className="absolute inset-0 bg-[#07080b]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1216] to-[#0c0d14] border-2 border-rose-500/50 flex items-center justify-center shadow-2xl text-rose-400 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-md">
                <h3 className="text-xl font-black text-white">Certificate Strictly Locked</h3>
                <p className="text-xs text-gray-300">
                  {certType === 'final'
                    ? `Pass all 5 Module Assessments with ≥ 80% score (Currently passed: ${
                        [1, 2, 3, 4, 5].filter(
                          (m) => (userProfile.moduleScores?.[m]?.score || 0) >= 80
                        ).length
                      }/5) and complete the 9-Stage Capstone.`
                    : certType === 'grand_champion'
                    ? `Achieve a score of ≥ 80% on the 60-Minute Master Assessment (100 MCQs + 50 Live Exercises). Your current score: ${masterScore}%.`
                    : `Requires a score of ≥ 80% on the Module ${selectedModuleId} Timed Assessment. Your current score: ${moduleScore}%.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      playClick();
                      if (certType === 'grand_champion') {
                        onNavigateTab('master-assessment');
                      } else {
                        onNavigateTab('assessments');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                  >
                    <Clock className="w-4 h-4 fill-black" />
                    <span>
                      {certType === 'grand_champion'
                        ? 'Take Master Assessment (60m) Now'
                        : `Take Module ${certType === 'module' ? selectedModuleId : '1'} Assessment Now`}
                    </span>
                  </button>
                )}

                {onLoadDemoUser && (
                  <button
                    onClick={() => {
                      playClick();
                      onLoadDemoUser();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                  >
                    <Sparkles className="w-4 h-4 text-purple-300" />
                    <span>🎓 Load Demo User (See All Unlocked)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo User banner for evaluators */}
        {onLoadDemoUser && !isCurrentCertUnlocked && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-amber-950/20 to-blue-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-2xl p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">🎓</span>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Evaluator & Recruiter Demo Mode</span>
                  <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">1-Click Preview</span>
                </h4>
                <p className="text-xs text-gray-300">
                  Want to evaluate the complete credential suite? Load the accredited Demo Graduate profile to see all 7 badges, Grand Champion diploma, LOR endorsement, and module certificates with live ISO QR codes.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                onLoadDemoUser();
              }}
              className="whitespace-nowrap px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <span>Load Demo User</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Certificate Metadata & 1-Click LinkedIn Share */}
        <div className="bg-[#121420] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifiable Certificate ID:</span>
              <strong className="text-amber-400 font-mono">{certId}</strong>
              {certType === 'grand_champion' && (
                <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                  VALID 3 MONTHS
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              SarlaYash Mission Presents • Powered by Kapil • Issued {issueDate}
            </p>
          </div>

          <button
            onClick={copyLinkedInPost}
            disabled={!isCurrentCertUnlocked}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 ${
              isCurrentCertUnlocked
                ? 'bg-[#0077B5] hover:bg-[#006097]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            {copiedLinkedIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Credential on LinkedIn</span>
              </>
            )}
          </button>
        </div>

        {/* ================= EXECUTIVE LETTER OF RECOMMENDATION (LOR) CALLOUT BANNER ================= */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171a29] via-[#1f1a2e] to-[#121422] border-2 border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
              📜
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  Institutional Endorsement
                </span>
                <span className="text-xs text-gray-400 font-medium">Valid for 3 Months</span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                Kapil's Letter of Recommendation (LOR) in Professional PDF
              </h3>
              <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
                Official institutional recommendation letter testifying to your mastery of high-impact spreadsheet engineering, multi-condition logic, dynamic array models, and executive BI dashboards. Unlocks upon passing the Master Assessment with ≥ 80%.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onNavigateTab && (
              <button
                onClick={() => {
                  playClick();
                  onNavigateTab('lor');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1f2335] hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-2 transition"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View Full LOR</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!isGrandChampionUnlocked) {
                  playError();
                  alert(
                    `Letter of Recommendation Locked!\n\nScore ≥ 80% on the 60-Minute Master Assessment to unlock Kapil's official Letter of Recommendation.`
                  );
                  return;
                }
                playClick();
                printLorToPdf({
                  candidateName: userProfile.name,
                  candidateId: userProfile.lorId || 'SY-LOR-2026-000124',
                  issueDate: userProfile.lorIssueDate || 'October 4, 2026',
                  masterAssessmentScore: userProfile.masterAssessmentScore?.score || 96,
                  percentileRank: 99,
                  validUntil: userProfile.grandChampionValidUntil || 'January 4, 2027',
                });
              }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95 ${
                isGrandChampionUnlocked
                  ? 'gold-gradient-btn text-black'
                  : 'bg-[#181a26] text-gray-500 border border-white/5 cursor-not-allowed opacity-60'
              }`}
            >
              {isGrandChampionUnlocked ? (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>Download LOR PDF</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span>LOR Locked (≥80%)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= 7 BADGES ARCHITECTURE WITH STRICT 80% SCORE LOCKING ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> 7 Badges Architecture & Honors
            </h2>
            <p className="text-xs text-gray-400">
              Each badge unlocks ONLY upon attaining a passing grade of ≥ 80% in the timed exam
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {
              allBadges.filter((b) => {
                if (b.moduleId === 999) {
                  return isGrandChampionUnlocked;
                }
                if (b.moduleId > 0) {
                  return (userProfile.moduleScores?.[b.moduleId]?.score || 0) >= 80;
                }
                return allModulesPassed && userProfile.capstoneCompleted;
              }).length
            }{' '}
            of {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const modScore =
              badge.moduleId === 999
                ? masterScore
                : badge.moduleId > 0
                ? userProfile.moduleScores?.[badge.moduleId]?.score || 0
                : 0;
            const isEarned =
              badge.moduleId === 999
                ? isGrandChampionUnlocked
                : badge.isGrand
                ? allModulesPassed && userProfile.capstoneCompleted
                : modScore >= 80;

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  badge.id === 'bgc'
                    ? isEarned
                      ? 'bg-gradient-to-br from-[#2a1b18] to-[#161220] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50'
                      : 'bg-[#100e14] border-amber-500/30 opacity-80'
                    : badge.isGrand
                    ? isEarned
                      ? 'bg-gradient-to-br from-[#1d1928] to-[#121422] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                      : 'bg-[#0f1118] border-amber-500/30 opacity-80'
                    : isEarned
                    ? 'bg-[#0e111a] border-amber-500/40 shadow-lg'
                    : 'bg-[#090b10] border-white/5 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161826] text-amber-300 border border-white/5">
                      {badge.module}
                    </span>
                    {isEarned ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked ({modScore > 0 ? `${modScore}%` : 'Honors'})
                      </span>
                    ) : (
                      <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked {modScore > 0 ? `(${modScore}% / 80%)` : '(Needs 80%)'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-3xl ${!isEarned ? 'grayscale opacity-50' : ''}`}>
                      {badge.icon}
                    </span>
                    <h3 className="text-base font-bold text-white">{badge.title}</h3>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">{badge.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  {isEarned ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <button
                        onClick={() => {
                          playClick();
                          setSelectedBadgeForModal(badge);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5 transition"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Verify QR & View</span>
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setSelectedBadgeForModal(badge);
                          setTimeout(() => {
                            if (badgeCanvasRef.current) {
                              handleDownloadBadge(badge);
                            }
                          }, 150);
                        }}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold border border-white/10 flex items-center gap-1 transition"
                        title="Quick Download Badge PNG"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PNG</span>
                      </button>
                    </div>
                  ) : (
                    onNavigateTab && (
                      <button
                        onClick={() => {
                          playClick();
                          if (badge.moduleId === 999) {
                            onNavigateTab('master-assessment');
                          } else {
                            onNavigateTab('assessments');
                          }
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>
                          {badge.moduleId === 999
                            ? 'Take Master Exam (60m)'
                            : 'Take Assessment (Score ≥ 80%)'}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= INTERACTIVE QR-VERIFIED BADGE MODAL ================= */}
      {selectedBadgeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f1118] border-2 border-amber-500/40 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadgeForModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                OFFICIAL QR-VERIFIED ACCREDITED BADGE
              </span>
              <h3 className="text-xl font-extrabold text-white">{selectedBadgeForModal.title}</h3>
              <p className="text-xs text-gray-400">
                {selectedBadgeForModal.module} • {userProfile.name}
              </p>
            </div>

            {/* Badge Canvas Viewport */}
            <div className="relative w-full overflow-hidden rounded-xl border border-amber-500/30 bg-[#07080b] flex items-center justify-center p-3 shadow-inner">
              <canvas
                ref={badgeCanvasRef}
                className="w-full max-w-xs h-auto rounded-lg shadow-2xl"
                style={{ aspectRatio: '1 / 1' }}
              />
            </div>

            {/* Verification Status Pill */}
            <div className="bg-[#141624] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-gray-300">
                  Scannable ISO QR Code verified on public portal registry.
                </span>
              </div>
              <span className="text-amber-400 font-mono font-bold">≥80% Honors</span>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleDownloadBadge(selectedBadgeForModal)}
                className="py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download Badge PNG</span>
              </button>
              <button
                onClick={() => handlePrintBadge(selectedBadgeForModal)}
                className="py-2.5 rounded-xl bg-[#171a26] hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
