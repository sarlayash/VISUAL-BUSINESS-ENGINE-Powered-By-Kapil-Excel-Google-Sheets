import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  Sparkles,
  Play,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import { INDUSTRY_LABS } from '../data/industryLabsData';
import { IndustryLab, UserProfile } from '../types';
import { playClick, playSuccess } from '../utils/soundEffects';
import { toggleLabComplete } from '../utils/storage';
import { ChartViewer } from './ChartViewer';

interface BusinessLabsViewProps {
  userProfile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onLaunchSimulatorWithLab: (lab: IndustryLab) => void;
}

export const BusinessLabsView: React.FC<BusinessLabsViewProps> = ({
  userProfile,
  onUpdateProfile,
  onLaunchSimulatorWithLab,
}) => {
  const [selectedLabId, setSelectedLabId] = useState<string>('retail');
  const activeLab = INDUSTRY_LABS.find((l) => l.id === selectedLabId) || INDUSTRY_LABS[0];

  const isLabCompleted = Boolean(userProfile?.completedLabs?.includes(activeLab.id));

  const handleToggleActiveLab = () => {
    playSuccess();
    const updated = toggleLabComplete(activeLab.id);
    if (updated && onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  // Generate chart data points from active lab dataset
  const chartData = activeLab.dataset.rows.map((row) => {
    const label = String(row[0]);
    // find first numeric value in row
    const numIdx = row.findIndex((val) => typeof val === 'number');
    const val = numIdx !== -1 ? Number(row[numIdx]) : 100;
    return {
      label,
      value: val,
      formatted: val.toLocaleString(),
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              CROSS-INDUSTRY ANALYTICS
            </span>
            <span className="text-xs text-gray-400">10 Real-World Business Labs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Industry Simulation Labs</h1>
          <p className="text-sm text-gray-400 mt-1">
            "You haven't joined an Excel course. You have been hired by 10 virtual enterprises to solve real business problems."
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleToggleActiveLab}
            className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition shadow-lg ${
              isLabCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-[#141624] text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isLabCompleted ? 'text-emerald-400' : 'text-gray-400'}`} />
            <span>{isLabCompleted ? 'Lab Completed' : 'Mark Lab Complete'}</span>
          </button>
          <button
            onClick={() => {
              playClick();
              onLaunchSimulatorWithLab(activeLab);
            }}
            className="px-6 py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch {activeLab.industry} Simulator</span>
          </button>
        </div>
      </div>

      {/* 10 Industry Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {INDUSTRY_LABS.map((lab) => {
          const isSelected = lab.id === selectedLabId;
          const isDone = Boolean(userProfile?.completedLabs?.includes(lab.id));
          return (
            <button
              key={lab.id}
              onClick={() => {
                playClick();
                setSelectedLabId(lab.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-lg scale-105'
                  : 'bg-[#0f1118] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <span className="text-base">{lab.icon}</span>
              <span>{lab.industry}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Lab Showcase: Scenario Brief & Interactive Data Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Business Brief & Key Inquiries */}
        <div className="space-y-6">
          <div className="bg-[#0f1118] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{activeLab.icon}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                {activeLab.difficulty}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Virtual Company:
              </span>
              <h2 className="text-xl font-bold text-white">{activeLab.companyName}</h2>
              <h3 className="text-sm text-gray-300 font-medium mt-0.5">{activeLab.title}</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#131520] p-3 rounded-xl border border-white/5">
              "{activeLab.scenario}"
            </p>

            {/* Questions Management Needs Answered */}
            <div className="space-y-2">
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Key Business Inquiries:
              </span>
              <ul className="space-y-2">
                {activeLab.keyQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Starter Formula Hint */}
            <div className="bg-[#0b0c12] p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Recommended Formula Engine:
              </span>
              <code className="text-xs text-amber-300 font-mono block">
                {activeLab.starterFormulaHint}
              </code>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleToggleActiveLab}
                className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition shadow-md ${
                  isLabCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-[#141624] text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isLabCompleted ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{isLabCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
              </button>
              <button
                onClick={() => {
                  playClick();
                  onLaunchSimulatorWithLab(activeLab);
                }}
                className="flex-[2] py-3 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Simulate Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dataset Preview & Real-Time Chart Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Chart Renderer */}
          <ChartViewer
            title={`${activeLab.companyName} — Performance Matrix`}
            subtitle={`Visualized metrics across ${activeLab.dataset.headers[0]}`}
            data={chartData}
            type="column"
          />

          {/* Dataset Interactive Table Preview */}
          <div className="bg-[#0f1118] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Active Simulation Dataset: <span className="font-mono text-amber-300">{activeLab.datasetName}</span>
                </h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {activeLab.dataset.rows.length} Records Loaded
              </span>
            </div>

            <div className="overflow-x-auto border border-gray-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#141622] border-b border-gray-800 text-amber-400 font-bold">
                    {activeLab.dataset.headers.map((h, i) => (
                      <th key={i} className="py-3 px-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 bg-[#0c0d14]">
                  {activeLab.dataset.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.03]">
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-3.5 text-gray-200 ${
                            typeof val === 'number' ? 'text-right text-amber-200' : ''
                          }`}
                        >
                          {typeof val === 'number' ? val.toLocaleString() : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
