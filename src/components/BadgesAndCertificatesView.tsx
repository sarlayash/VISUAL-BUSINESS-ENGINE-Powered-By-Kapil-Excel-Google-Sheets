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
} from 'lucide-react';
import { UserProfile } from '../types';
import { MODULES_DATA } from '../data/modulesData';
import {
  drawCertificateToCanvas,
  downloadCertificatePng,
  printCertificatePdf,
} from '../utils/certificateGenerator';
import { playClick, playSuccess } from '../utils/soundEffects';

interface BadgesAndCertificatesViewProps {
  userProfile: UserProfile;
}

export const BadgesAndCertificatesView: React.FC<BadgesAndCertificatesViewProps> = ({
  userProfile,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [certType, setCertType] = useState<'final' | 'module'>('final');
  const [selectedModuleTitle, setSelectedModuleTitle] = useState<string>(
    'Advanced Lookup & Statistical Functions'
  );
  const [copiedLinkedIn, setCopiedLinkedIn] = useState<boolean>(false);

  const certId = userProfile.certificateId || 'SY-VBE-2026-000124';
  const issueDate = userProfile.certificateIssueDate || 'October 4, 2026';

  // Redraw certificate whenever parameters change
  useEffect(() => {
    if (canvasRef.current) {
      drawCertificateToCanvas(canvasRef.current, {
        learnerName: userProfile.name,
        type: certType,
        moduleTitle: selectedModuleTitle,
        certificateId: certId,
        issueDate: issueDate,
        score: 98,
      });
    }
  }, [userProfile.name, certType, selectedModuleTitle, certId, issueDate]);

  const handleDownloadPng = () => {
    playClick();
    if (canvasRef.current) {
      downloadCertificatePng(
        canvasRef.current,
        `Visual_Business_Engine_Certificate_${userProfile.name.replace(/\s+/g, '_')}`
      );
    }
  };

  const handlePrintPdf = () => {
    playClick();
    if (canvasRef.current) {
      printCertificatePdf(
        canvasRef.current,
        `Visual Business Engine - Certificate of Achievement - ${userProfile.name}`
      );
    }
  };

  const copyLinkedInPost = () => {
    playSuccess();
    const postText = `🚀 Proud to announce that I have achieved the VISUAL BUSINESS ENGINEER certification from SarlaYash Mission, powered by Kapil!\n\nCompleted 30 hours of 100% hands-on simulation training across Microsoft Excel & Google Sheets—solving real business challenges in Retail, Banking, SaaS, HR, and Supply Chain.\n\nCertificate ID: ${certId}\nVerify Credential: https://visualbusinessengine.sarlayash.org/verify?id=${certId}\n\n#VisualBusinessEngine #DataAnalytics #BusinessIntelligence #Excel #GoogleSheets #SarlaYash #SarlaYashMission`;
    navigator.clipboard.writeText(postText);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 3000);
  };

  const allBadges = [
    {
      id: 'b1',
      title: 'Data Preparation Explorer',
      module: 'Module 1',
      icon: '🥇',
      desc: 'Mastered spreadsheet anatomy, data cleaning & foundational formulas.',
    },
    {
      id: 'b2',
      title: 'Formula Intelligence Specialist',
      module: 'Module 2',
      icon: '🥇',
      desc: 'Mastered multi-condition logic, SUMIFS, and What-If scenarios.',
    },
    {
      id: 'b3',
      title: 'Lookup & Statistics Analyst',
      module: 'Module 3',
      icon: '🥇',
      desc: 'Mastered XLOOKUP, INDEX+MATCH, and statistical distributions.',
    },
    {
      id: 'b4',
      title: 'Business Data Visualization Analyst',
      module: 'Module 4',
      icon: '🥇',
      desc: 'Mastered Pivot Tables, interactive slicers, and storytelling.',
    },
    {
      id: 'b5',
      title: 'Dashboard Architect',
      module: 'Module 5',
      icon: '🥇',
      desc: 'Engineered boardroom C-Suite executive control dashboards.',
    },
    {
      id: 'bf',
      title: 'Visual Business Engineer',
      module: 'Grand Final Milestone',
      icon: '🏆',
      desc: 'The pinnacle award: Solved 9-stage Global Retail Capstone.',
      isGrand: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              OFFICIAL ACCREDITATION
            </span>
            <span className="text-xs text-gray-400">Verifiable Credentials</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Certificates & Badge Portfolio</h1>
          <p className="text-sm text-gray-400 mt-1">
            Download high-resolution social-media-ready PNGs and printable PDFs
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPng}
            className="px-4 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wide flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2.5 rounded-xl bg-[#171a26] hover:bg-white/10 text-white font-semibold text-xs border border-white/10 flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* ================= HIGH RESOLUTION CERTIFICATE CANVAS PREVIEW ================= */}
      <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
            <h2 className="text-lg font-bold text-white">Live Certificate Engine</h2>
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

        {/* Certificate Canvas viewport */}
        <div className="w-full overflow-hidden rounded-xl border border-amber-500/40 shadow-2xl bg-[#07080b] flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-w-4xl rounded shadow-2xl transition-all"
            style={{ aspectRatio: '1600 / 1130' }}
          />
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
            className="px-5 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
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

      {/* ================= 6 BADGES ARCHITECTURE SHOWCASE (PRD Page 21) ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Badges Architecture
            </h2>
            <p className="text-xs text-gray-400">
              5 Module Badges + The Grand Visual Business Engineer Trophy
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {userProfile.earnedBadges.length} of {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const isEarned = userProfile.earnedBadges.includes(badge.title);
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
                    : 'bg-[#090b10] border-white/5 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161826] text-amber-300 border border-white/5">
                      {badge.module}
                    </span>
                    {isEarned ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{badge.icon}</span>
                    <h3 className="text-base font-bold text-white">{badge.title}</h3>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">{badge.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Badge Download</span>
                  <button
                    onClick={() => {
                      playClick();
                      alert(`PNG Badge for "${badge.title}" exported!`);
                    }}
                    disabled={!isEarned}
                    className="text-xs text-amber-400 hover:text-amber-300 disabled:opacity-30 font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PNG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
