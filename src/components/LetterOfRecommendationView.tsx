import React, { useState } from 'react';
import {
  Download,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { UserProfile } from '../types';
import { printLorToPdf, LorConfig } from '../utils/lorGenerator';
import { playClick } from '../utils/soundEffects';

interface LetterOfRecommendationViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: string) => void;
  onLoadDemoUser?: () => void;
}

export const LetterOfRecommendationView: React.FC<LetterOfRecommendationViewProps> = ({
  userProfile,
  onNavigateTab,
  onLoadDemoUser,
}) => {
  const masterScore = userProfile.masterAssessmentScore?.score || 0;
  const isLorUnlocked =
    (userProfile.masterAssessmentScore?.passed ?? false) ||
    (userProfile.capstoneCompleted && [1, 2, 3, 4, 5].every((m) => (userProfile.moduleScores?.[m]?.score || 0) >= 80));

  const candidateId = userProfile.lorId || userProfile.certificateId || 'SY-LOR-2026-000124';
  const issueDate = userProfile.lorIssueDate || userProfile.certificateIssueDate || 'October 4, 2026';
  const effectiveScore = isLorUnlocked ? Math.max(88, masterScore || 95) : masterScore;

  const handleDownloadPdf = () => {
    playClick();
    if (!isLorUnlocked) {
      alert('Letter of Recommendation is strictly locked until passing the 60-Minute Master Assessment or Capstone with ≥ 80%.');
      return;
    }
    const config: LorConfig = {
      candidateName: userProfile.name,
      candidateId: candidateId,
      issueDate: issueDate,
      masterAssessmentScore: effectiveScore,
      percentileRank: 99,
      validUntil: userProfile.grandChampionValidUntil,
    };
    printLorToPdf(config);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-gray-200 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
              EXECUTIVE ENDORSEMENT
            </span>
            <span className="text-xs text-gray-400">• Institutional Credential</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-amber-400" />
            <span>Official Letter of Recommendation (LOR)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Institutional endorsement authored by <strong>Kapil</strong> (Lead Program Architect, SarlaYash Mission) for C-Suite, recruiters, and academic review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onLoadDemoUser && !isLorUnlocked && (
            <button
              onClick={() => {
                playClick();
                onLoadDemoUser();
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 font-bold text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>🎓 Load Demo User</span>
            </button>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={!isLorUnlocked}
            className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition active:scale-95 ${
              isLorUnlocked
                ? 'gold-gradient-btn text-black hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Professional PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Preview Container */}
      <div className="relative rounded-3xl bg-[#0f1118] border-2 border-amber-500/30 p-4 sm:p-8 shadow-2xl">
        {/* If Locked: Frost Overlay */}
        {!isLorUnlocked && (
          <div className="absolute inset-0 bg-[#07080b]/90 backdrop-blur-md z-20 rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1216] to-[#0c0d14] border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-2xl animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md">
              <h3 className="text-xl font-black text-white">Letter of Recommendation Locked</h3>
              <p className="text-xs text-gray-300">
                An institutional Letter of Recommendation is reserved exclusively for candidates who score{' '}
                <strong className="text-amber-400">≥ 80%</strong> on the 60-Minute Master Assessment or complete all 5 module exams with ≥ 80% and the Capstone.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  playClick();
                  onNavigateTab('master-assessment');
                }}
                className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
              >
                <span>Take 60-Minute Master Assessment</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              {onLoadDemoUser && (
                <button
                  onClick={() => {
                    playClick();
                    onLoadDemoUser();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                >
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>🎓 Load Demo User (View Unlocked LOR)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Paper Document Representation */}
        <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-12 shadow-inner font-sans text-xs sm:text-sm space-y-6 max-w-4xl mx-auto border border-gray-200">
          {/* Official Letterhead */}
          <div className="border-b-2 border-amber-500 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-wider text-gray-900 uppercase">
                SarlaYash Mission
              </div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-0.5">
                Visual Business Engine • Executive Endorsement Council
              </div>
            </div>
            <div className="text-left sm:text-right text-[11px] font-mono text-gray-500 space-y-0.5">
              <div>Ref: <strong className="text-gray-900">{candidateId}-LOR</strong></div>
              <div>Date: <strong className="text-gray-900">{issueDate}</strong></div>
              <div>Validation: <strong className="text-emerald-700">Official Institutional Endorsement</strong></div>
            </div>
          </div>

          <div className="font-bold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
            TO WHOM IT MAY CONCERN / EXECUTIVE HIRING COMMITTEE
          </div>

          <p className="text-justify leading-relaxed text-gray-700">
            It is my distinct professional honor to provide this institutional Letter of Recommendation on behalf of{' '}
            <strong className="text-gray-900 text-sm">{userProfile.name}</strong>, who has demonstrated verified
            quantitative excellence and achieved accredited status as an elite{' '}
            <strong>Visual Business Engineer</strong> within the SarlaYash Mission Executive Analytics curriculum.
          </p>

          {/* Performance Highlight Pill */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">Candidate Assessment Standing:</span>
              <strong className="text-sm font-mono text-gray-900">
                Score: {effectiveScore}% • Top 1% (99th Percentile)
              </strong>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider block">Verified Credential ID:</span>
              <strong className="text-sm font-mono text-amber-800">{candidateId}</strong>
            </div>
          </div>

          <p className="text-justify leading-relaxed text-gray-700">
            Unlike candidates whose credentials rest upon passive video lecture consumption, {userProfile.name} has
            completed over 30 intensive hours of rigorous, in-browser business simulation engineering under active
            timer constraints. Throughout this evaluation, the candidate solved multi-channel corporate challenges with zero
            external software aids, building resilient data architecture from first principles.
          </p>

          <p className="text-gray-800 font-semibold">
            Specifically, the candidate was comprehensively tested across the following core technical and strategic competencies:
          </p>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-gray-800">
              <strong>1. Resilient Data Architecture:</strong> Advanced data cleaning (TRIM, TEXTSPLIT, regularized mixed references), anomaly detection, and schema reconciliation.
            </div>
            <div className="bg-gray-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-gray-800">
              <strong>2. Multi-Condition Logic Modeling:</strong> Complex nested logic, multi-criteria aggregates (SUMIFS, COUNTIFS, AVERAGEIFS), and what-if sensitivity engines.
            </div>
            <div className="bg-gray-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-gray-800">
              <strong>3. High-Performance Retrieval:</strong> Two-way matrix lookups using modern XLOOKUP, INDEX+MATCH, and dynamic array operators (FILTER, SORT, UNIQUE).
            </div>
            <div className="bg-gray-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-gray-800">
              <strong>4. Financial & Statistical Math:</strong> Amortization mechanics (PMT), investment discounting (NPV, IRR), distribution analysis (PERCENTILE, STDEV).
            </div>
            <div className="bg-gray-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-gray-800">
              <strong>5. Multi-Dimensional BI Synthesis:</strong> Pivot table architecture, interactive slicers, calculated fields, and executive KPI dashboard control towers.
            </div>
            <div className="bg-gray-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-gray-800">
              <strong>6. Full-Stack Spreadsheet Agility:</strong> Fluency across both Microsoft Excel and Google Sheets enterprise ecosystems (VBA vs Apps Script, Power Query vs BigQuery).
            </div>
          </div>

          <p className="text-justify leading-relaxed text-gray-700">
            In our 60-Minute Master Assessment—encompassing 100 scenario-driven evaluation MCQs and 50 live spreadsheet exercises
            with randomized sequence controls—{userProfile.name} exhibited superior composure, flawless analytical velocity,
            and deep conceptual grasp of the underlying business imperatives guiding corporate leadership.
          </p>

          <p className="text-justify leading-relaxed text-gray-700">
            I endorse {userProfile.name} with the highest degree of confidence for roles in{' '}
            <strong>Business Intelligence, Financial Modeling, Management Consulting, Data Strategy, and Corporate Analytics</strong>.
            The candidate possesses the rare ability to translate raw transactional data into unambiguous executive decision-making clarity.
          </p>

          {/* Signature & QR Footer */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div>
              <div className="font-serif italic text-3xl sm:text-4xl text-gray-900 mb-1">
                Kapil
              </div>
              <div className="font-bold text-sm text-gray-900">KAPIL NARULA</div>
              <div className="text-xs text-gray-600">Lead Program Architect & Data Executive</div>
              <div className="text-xs text-gray-500">SarlaYash Mission • Visual Business Engine</div>
              <div className="text-[11px] font-mono text-gray-400 mt-0.5">kapil@visualbusinessengine.internal</div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-white border border-gray-300 rounded-lg flex items-center justify-center p-1">
                <span className="text-3xl">📱</span>
              </div>
              <div className="text-[10px] text-gray-600 space-y-0.5">
                <div className="font-bold text-gray-900">ISO Scannable QR Matrix</div>
                <div>Instant Verification Portal</div>
                <div className="font-mono text-gray-500">{candidateId}</div>
                <div className="text-emerald-700 font-bold">Status: Certified Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
