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
} from 'lucide-react';
import { UserProfile } from '../types';
import { MODULE_ASSESSMENTS } from '../data/assessmentsData';
import {
  drawCertificateToCanvas,
  downloadCertificatePng,
  printCertificatePdf,
} from '../utils/certificateGenerator';
import { playClick, playSuccess, playError } from '../utils/soundEffects';

interface BadgesAndCertificatesViewProps {
  userProfile: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

export const BadgesAndCertificatesView: React.FC<BadgesAndCertificatesViewProps> = ({
  userProfile,
  onNavigateTab,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [certType, setCertType] = useState<'final' | 'module'>('final');
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState<boolean>(false);

  const certId = userProfile.certificateId || 'SY-VBE-2026-000124';
  const issueDate = userProfile.certificateIssueDate || 'October 4, 2026';

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

  const isCurrentCertUnlocked =
    certType === 'final' ? isFinalCertUnlocked : isModuleCertUnlocked;

  // Average score calculation
  const totalScores = [1, 2, 3, 4, 5].map((m) => userProfile.moduleScores?.[m]?.score || 0);
  const avgScore = Math.round(totalScores.reduce((a, b) => a + b, 0) / 5);

  // Redraw certificate whenever parameters change
  useEffect(() => {
    if (canvasRef.current) {
      drawCertificateToCanvas(canvasRef.current, {
        learnerName: userProfile.name,
        type: certType,
        moduleTitle: currentModAssessment.moduleTitle,
        certificateId: certId,
        issueDate: issueDate,
        score: certType === 'final' ? Math.max(80, avgScore) : Math.max(80, moduleScore),
      });
    }
  }, [
    userProfile.name,
    certType,
    selectedModuleId,
    currentModAssessment.moduleTitle,
    certId,
    issueDate,
    avgScore,
    moduleScore,
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

  const copyLinkedInPost = () => {
    if (!isCurrentCertUnlocked) {
      playError();
      alert('Achieve ≥ 80% on the assessment before sharing your credential on LinkedIn!');
      return;
    }
    playSuccess();
    const postText = `🚀 Proud to announce that I have achieved the VISUAL BUSINESS ENGINEER certification from SarlaYash Mission, powered by Kapil!\n\nCompleted 30 hours of 100% hands-on simulation training across Microsoft Excel & Google Sheets—solving real business challenges in Retail, Banking, SaaS, HR, and Supply Chain with an assessment score of ${
      certType === 'final' ? avgScore : moduleScore
    }%!\n\nCertificate ID: ${certId}\nVerify Credential: https://visualbusinessengine.sarlayash.org/verify?id=${certId}\n\n#VisualBusinessEngine #DataAnalytics #BusinessIntelligence #Excel #GoogleSheets #SarlaYash #SarlaYashMission`;
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
          <div className="flex items-center bg-[#151722] p-1 rounded-xl border border-white/10 text-xs">
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
                    : `Requires a score of ≥ 80% on the Module ${selectedModuleId} Timed Assessment. Your current score: ${moduleScore}%.`}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      playClick();
                      onNavigateTab('assessments');
                    }}
                    className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                  >
                    <Clock className="w-4 h-4 fill-black" />
                    <span>Take Module {certType === 'module' ? selectedModuleId : '1'} Assessment Now</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Certificate Metadata & 1-Click LinkedIn Share */}
        <div className="bg-[#121420] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifiable Certificate ID:</span>
              <strong className="text-amber-400 font-mono">{certId}</strong>
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
      </div>

      {/* ================= 6 BADGES ARCHITECTURE WITH STRICT 80% SCORE LOCKING ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Badges Architecture
            </h2>
            <p className="text-xs text-gray-400">
              Each badge unlocks ONLY upon attaining a passing grade of ≥ 80% in the module exam
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {
              allBadges.filter((b) => {
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
            const modScore = badge.moduleId > 0 ? userProfile.moduleScores?.[badge.moduleId]?.score || 0 : 0;
            const isEarned = badge.isGrand
              ? allModulesPassed && userProfile.capstoneCompleted
              : modScore >= 80;

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  badge.isGrand
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
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked ({badge.moduleId > 0 ? `${modScore}%` : 'Honors'})
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
                    <button
                      onClick={() => {
                        playClick();
                        alert(`PNG Badge for "${badge.title}" exported!`);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Badge PNG
                    </button>
                  ) : (
                    onNavigateTab && (
                      <button
                        onClick={() => {
                          playClick();
                          onNavigateTab('assessments');
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Take Assessment (Score ≥ 80%)</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
