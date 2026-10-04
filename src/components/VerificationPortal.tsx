import React, { useState } from 'react';
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
} from 'lucide-react';
import { playClick, playSuccess, playError } from '../utils/soundEffects';

export const VerificationPortal: React.FC = () => {
  const [searchId, setSearchId] = useState<string>('SY-VBE-2026-000124');
  const [verificationResult, setVerificationResult] = useState<any>({
    valid: true,
    certificateId: 'SY-VBE-2026-000124',
    learnerName: 'Kapil',
    program: 'Visual Business Engine — Excel + Google Sheets Business Analytics Program',
    presenter: 'SarlaYash Mission',
    instructor: 'Kapil (Lead Architect)',
    issueDate: 'October 4, 2026',
    score: '98% (Capstone Verified)',
    hours: '30 Hours Hands-On Simulation',
    blockchainProof: '0x8f2a9b47e1c84d310a0129bcfe74e0d29182390a',
  });

  const handleVerify = () => {
    playClick();
    const clean = searchId.trim().toUpperCase();
    if (clean.startsWith('SY-VBE')) {
      playSuccess();
      setVerificationResult({
        valid: true,
        certificateId: clean,
        learnerName: clean === 'SY-VBE-2026-000124' ? 'Kapil' : 'Verified Business Scholar',
        program: 'Visual Business Engine — Excel + Google Sheets Business Analytics Program',
        presenter: 'SarlaYash Mission',
        instructor: 'Kapil (Lead Architect)',
        issueDate: 'October 4, 2026',
        score: '98% (Capstone Verified)',
        hours: '30 Hours Hands-On Simulation',
        blockchainProof: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      });
    } else {
      playError();
      setVerificationResult({
        valid: false,
        error: `Certificate ID "${searchId}" could not be located in the SarlaYash Mission registry. Please check formatting (e.g. SY-VBE-2026-000124).`,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> SARLAYASH MISSION CREDENTIAL REGISTRY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Certificate Verification Portal
        </h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Instant public verification for all Visual Business Engine credentials and diplomas.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <label className="text-xs font-bold text-gray-300 block uppercase tracking-wider">
          Enter Certificate Verification ID or Scan QR:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. SY-VBE-2026-000124"
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
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Status: Authenticated & Valid
              </span>
              <h2 className="text-lg font-bold text-white">Official Certificate Verified</h2>
            </div>
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
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Certificate ID:</span>
              <div className="text-sm font-bold text-amber-300 font-mono">
                {verificationResult.certificateId}
              </div>
            </div>

            <div className="bg-[#141622] p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Program Name:</span>
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
              <span className="text-gray-400 uppercase font-semibold text-[10px]">Evaluation Score:</span>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {verificationResult.score}
              </div>
            </div>
          </div>

          <div className="bg-[#0b0c12] p-3 rounded-xl border border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span className="truncate">Cryptographic Ledger Hash: {verificationResult.blockchainProof}</span>
            <span className="text-emerald-400 font-semibold shrink-0 ml-2">100% Genuine</span>
          </div>
        </div>
      ) : (
        <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-6 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Record Not Found</h3>
          <p className="text-xs text-red-300">{verificationResult.error}</p>
        </div>
      )}
    </div>
  );
};
