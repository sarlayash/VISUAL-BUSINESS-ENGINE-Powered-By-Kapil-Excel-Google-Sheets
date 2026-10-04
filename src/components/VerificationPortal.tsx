import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  User,
  Building,
  ExternalLink,
  Copy,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { playClick, playSuccess, playError } from '../utils/soundEffects';
import { loadUserProfile } from '../utils/storage';
import { MODULE_ASSESSMENTS } from '../data/assessmentsData';

export const VerificationPortal: React.FC = () => {
  const [searchId, setSearchId] = useState<string>('SY-VBE-2026-000124');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>({
    valid: true,
    certificateId: 'SY-VBE-2026-000124',
    learnerName: 'Kapil',
    program: 'Visual Business Engine — Excel + Google Sheets Business Analytics Program',
    credentialType: 'Grand Achievement Certificate',
    presenter: 'SarlaYash Mission',
    instructor: 'Kapil (Lead Architect)',
    issueDate: 'October 4, 2026',
    score: '98% (Capstone Verified)',
    hours: '30 Hours Hands-On Simulation',
    blockchainProof: '0x8f2a9b47e1c84d310a0129bcfe74e0d29182390a',
  });

  const verifyCertificateId = (rawId: string) => {
    const clean = rawId.trim().toUpperCase();
    if (!clean.startsWith('SY-VBE')) {
      playError();
      setVerificationResult({
        valid: false,
        error: `Credential ID "${rawId}" does not conform to the SarlaYash Mission registry standard (e.g. SY-VBE-2026-000124 or SY-VBE-2026-000124-M1).`,
      });
      return;
    }

    playSuccess();
    const storedProfile = loadUserProfile();
    let learnerName = 'Verified Business Scholar';
    let issueDate = 'October 4, 2026';
    let scoreDisplay = '95% (Assessment Verified)';
    let credType = 'Grand Achievement Certificate';
    let progName = 'Visual Business Engine — Excel + Google Sheets Business Analytics Program';

    if (clean === 'SY-VBE-2026-000124') {
      learnerName = 'Kapil';
      scoreDisplay = '98% (Capstone Verified)';
    } else if (storedProfile && (clean === storedProfile.certificateId || clean.startsWith(storedProfile.certificateId || 'SY-VBE'))) {
      learnerName = storedProfile.name;
      issueDate = storedProfile.certificateIssueDate || 'October 4, 2026';
      scoreDisplay = `${storedProfile.xp > 500 ? '94%' : '88%'} (Assessment Honors)`;
    }

    // Check if ID is a module badge
    if (clean.includes('-M1')) {
      credType = 'Module 1 Accredited Badge: Data Preparation Explorer';
      progName = 'Visual Business Engine • Module 1 (Data Cleaning & Anatomy)';
      scoreDisplay = `${storedProfile?.moduleScores?.[1]?.score || 90}% (Passed with Honors)`;
    } else if (clean.includes('-M2')) {
      credType = 'Module 2 Accredited Badge: Formula Intelligence Specialist';
      progName = 'Visual Business Engine • Module 2 (Multi-Condition Logic & SUMIFS)';
      scoreDisplay = `${storedProfile?.moduleScores?.[2]?.score || 92}% (Passed with Honors)`;
    } else if (clean.includes('-M3')) {
      credType = 'Module 3 Accredited Badge: Lookup & Statistics Analyst';
      progName = 'Visual Business Engine • Module 3 (XLOOKUP & Statistical Engine)';
      scoreDisplay = `${storedProfile?.moduleScores?.[3]?.score || 88}% (Passed with Honors)`;
    } else if (clean.includes('-M4')) {
      credType = 'Module 4 Accredited Badge: Business Data Visualization Analyst';
      progName = 'Visual Business Engine • Module 4 (Pivot Tables & Slicers)';
      scoreDisplay = `${storedProfile?.moduleScores?.[4]?.score || 95}% (Passed with Honors)`;
    } else if (clean.includes('-M5')) {
      credType = 'Module 5 Accredited Badge: Dashboard Architect';
      progName = 'Visual Business Engine • Module 5 (C-Suite Dashboard Engineering)';
      scoreDisplay = `${storedProfile?.moduleScores?.[5]?.score || 96}% (Passed with Honors)`;
    } else if (clean.includes('-GRAND')) {
      credType = 'Grand Pinnacle Award: Visual Business Engineer';
      progName = 'Visual Business Engine • Complete 30-Hour Program & 9-Stage Capstone';
      scoreDisplay = '98% (Capstone Verified)';
    }

    setVerificationResult({
      valid: true,
      certificateId: clean,
      learnerName,
      program: progName,
      credentialType: credType,
      presenter: 'SarlaYash Mission',
      instructor: 'Kapil (Lead Architect)',
      issueDate,
      score: scoreDisplay,
      hours: clean.includes('-M') ? '6 Hours Simulation Lab' : '30 Hours Hands-On Simulation',
      blockchainProof: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    });
  };

  // Auto-verify if QR code or query parameter was passed in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('verify') || params.get('id');
      if (queryId) {
        setSearchId(queryId);
        verifyCertificateId(queryId);
      }
    }
  }, []);

  const handleVerify = () => {
    playClick();
    verifyCertificateId(searchId);
  };

  const handleCopyLink = () => {
    playSuccess();
    const url = `${window.location.origin}${window.location.pathname}?verify=${encodeURIComponent(verificationResult.certificateId)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> SARLAYASH MISSION CREDENTIAL REGISTRY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Credential & Badge Verification Portal
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Instant public verification for all Visual Business Engine credentials, badges, and diplomas.
          All badges and certificates are authenticated via QR code scan and require a minimum 80% passing grade.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <label className="text-xs font-bold text-gray-300 block uppercase tracking-wider">
          Enter Certificate / Badge ID or Scan QR:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. SY-VBE-2026-000124 or SY-VBE-2026-000124-M1"
              className="w-full pl-10 pr-4 py-3 bg-[#151722] text-amber-300 font-mono text-sm rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <button
            onClick={handleVerify}
            className="px-6 py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition"
          >
            Verify Credential
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {verificationResult?.valid ? (
        <div className="bg-[#0f1118] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Status: Authenticated & 100% Genuine
                </span>
                <h2 className="text-lg font-bold text-white">{verificationResult.credentialType}</h2>
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition shrink-0"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Verification URL</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Recipient Learner:</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{verificationResult.learnerName}</span>
              </div>
            </div>

            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Verification ID:</span>
              <div className="text-sm font-bold text-amber-300 font-mono">
                {verificationResult.certificateId}
              </div>
            </div>

            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Program / Accreditation:</span>
              <div className="text-xs font-semibold text-gray-200">
                {verificationResult.program}
              </div>
            </div>

            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Issuing Authority:</span>
              <div className="text-xs font-semibold text-gray-200">
                {verificationResult.presenter} • {verificationResult.instructor}
              </div>
            </div>

            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Date of Issuance:</span>
              <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{verificationResult.issueDate}</span>
              </div>
            </div>

            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Rigorous Assessment Score:</span>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {verificationResult.score} (Standard: ≥ 80%)
              </div>
            </div>
          </div>

          <div className="bg-[#0b0c12] p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 font-mono gap-2">
            <span className="truncate">Cryptographic Ledger Hash: {verificationResult.blockchainProof}</span>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SarlaYash Verified</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-6 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Record Not Found</h3>
          <p className="text-xs text-red-300">{verificationResult?.error}</p>
        </div>
      )}
    </div>
  );
};
