import React, { useState } from 'react';
import {
  Map,
  Search,
  BookOpen,
  Code,
  BarChart2,
  Terminal,
  Briefcase,
  Trophy,
  Lightbulb,
  Clock,
  Award,
  ShieldCheck,
  LayoutDashboard,
  TrendingUp,
  Smartphone,
  ExternalLink,
  ArrowRight,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../types';
import { playClick, playSuccess } from '../utils/soundEffects';

interface SiteMapViewProps {
  userProfile: UserProfile | null;
  onNavigateTab: (tab: string, meta?: any) => void;
  onLoadDemoUser?: () => void;
}

interface SiteMapSection {
  id: string;
  category: string;
  icon: any;
  items: {
    title: string;
    description: string;
    tabId: string;
    meta?: any;
    badge: string;
    badgeColor: string;
    isInteractive: boolean;
  }[];
}

export const SiteMapView: React.FC<SiteMapViewProps> = ({
  userProfile,
  onNavigateTab,
  onLoadDemoUser,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const siteMapSections: SiteMapSection[] = [
    {
      id: 'curriculum',
      category: '30-Hour Core Curriculum',
      icon: BookOpen,
      items: [
        {
          title: 'Module 1: Spreadsheet Anatomy & Data Cleansing',
          description: 'Cell addresses, formulas vs text, FLASH FILL, TRIM, PROPER, data normalization (6 Hours).',
          tabId: 'curriculum',
          meta: { moduleId: 1 },
          badge: '6 Hours • 4 Challenges',
          badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
          isInteractive: true,
        },
        {
          title: 'Module 2: Logic, Conditionals & Financial Modeling',
          description: 'Nested IFs, IFS, AND/OR, SUMIFS, AVERAGEIFS, COUNTIFS, and commission tiers (6 Hours).',
          tabId: 'curriculum',
          meta: { moduleId: 2 },
          badge: '6 Hours • 4 Challenges',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          isInteractive: true,
        },
        {
          title: 'Module 3: Lookups, Matrix Models & Advanced Statistics',
          description: 'XLOOKUP, VLOOKUP, INDEX+MATCH, MEDIAN, PERCENTILE, standard deviation analysis (6 Hours).',
          tabId: 'curriculum',
          meta: { moduleId: 3 },
          badge: '6 Hours • 4 Challenges',
          badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          isInteractive: true,
        },
        {
          title: 'Module 4: Dynamic Arrays, Pivot Tables & Data Storytelling',
          description: 'FILTER, UNIQUE, SORT, multi-dimensional Pivot Tables, slicers, and storytelling (6 Hours).',
          tabId: 'curriculum',
          meta: { moduleId: 4 },
          badge: '6 Hours • 4 Challenges',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          isInteractive: true,
        },
        {
          title: 'Module 5: C-Suite Executive Dashboard Architecture',
          description: 'Boardroom KPI cards, dynamic charts, conditional heatmaps, executive cockpit design (6 Hours).',
          tabId: 'curriculum',
          meta: { moduleId: 5 },
          badge: '6 Hours • 4 Challenges',
          badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          isInteractive: true,
        },
      ],
    },
    {
      id: 'simulators',
      category: 'Simulation Engines & Labs',
      icon: Code,
      items: [
        {
          title: 'Spreadsheet Simulator IDE',
          description: 'Interactive spreadsheet workspace with formula bar (fx), live calculations, Excel vs Sheets modes, and instant validation.',
          tabId: 'simulator',
          badge: 'Core IDE Engine',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          isInteractive: true,
        },
        {
          title: 'fx Inbuilt Functions Lab',
          description: 'Interactive catalog of 30+ enterprise functions with 1-click dataset loaders (Sales, Payroll, Inventory, Loan) and IDE executor.',
          tabId: 'functions',
          badge: '30+ Functions',
          badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
          isInteractive: true,
        },
        {
          title: 'Pivot Tables & Pivot Charts Simulator',
          description: 'Multi-dimensional cross-tabulation engine (Rows, Columns, Values, Aggregations) with live Column, Bar, Line, and Donut Pivot Charts and slicers.',
          tabId: 'pivots',
          badge: 'Multi-Dimensional BI',
          badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          isInteractive: true,
        },
        {
          title: 'Macros & Automation Simulator',
          description: 'Side-by-side Excel VBA vs Google Apps Script comparison, interactive macro step recorder, and sandboxed terminal execution.',
          tabId: 'macros',
          badge: 'VBA vs Apps Script',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          isInteractive: true,
        },
      ],
    },
    {
      id: 'practicum',
      category: 'Industry Practicum & Business Cases',
      icon: Briefcase,
      items: [
        {
          title: '10 Real-World Industry Simulation Labs',
          description: 'Retail, Banking, SaaS, Healthcare, Manufacturing, E-Commerce, Consulting, HR, Logistics, and Crypto scenarios.',
          tabId: 'labs',
          badge: '10 Enterprises',
          badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
          isInteractive: true,
        },
        {
          title: 'Global Retail Corporation Capstone',
          description: 'Flagship 9-stage enterprise challenge with 10,000+ transaction dataset, margins, distributions, and executive presentation.',
          tabId: 'capstone',
          badge: '9 Enterprise Stages',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          isInteractive: true,
        },
        {
          title: '50 Differences: Google Sheets vs MS Excel',
          description: 'Authoritative comparative knowledge bytes across Cloud Collaboration, Big Data, Dynamic Arrays, VBA vs GAS, AI Copilot vs Gemini, and TCO.',
          tabId: 'knowledge',
          badge: '50 Knowledge Bytes',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          isInteractive: true,
        },
        {
          title: 'Business Intelligence Index (BII) in Excel & Sheets',
          description: '10-dimensional architectural comparison across Scalability, Concurrency, Dynamic Arrays, Dashboards, Automation, ETL/Power Query, Security/Governance, Solver/Financial, AI/Copilot, Cost/TCO.',
          tabId: 'bi-index',
          badge: '10 Dimensions • BII',
          badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
          isInteractive: true,
        },
      ],
    },
    {
      id: 'credentials',
      category: 'Accreditation, Mock Tests & Certificates',
      icon: Award,
      items: [
        {
          title: '60-Minute Master Assessment (100 MCQs + 50 Live Exercises)',
          description: 'Comprehensive 150-point examination with dynamic anti-pattern question and option shuffling. Strict ≥ 80% passing benchmark.',
          tabId: 'master-assessment',
          badge: '150 Points • 60 Mins',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          isInteractive: true,
        },
        {
          title: 'Timer-Based Module Mock Tests',
          description: 'Strict 25-minute examination per module with 10 scenario questions + 5 interactive exercises. Badges and certificates locked until ≥ 80%.',
          tabId: 'assessments',
          badge: 'Strict 80% Benchmark',
          badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          isInteractive: true,
        },
        {
          title: 'Grand Champion Certificate (Valid for 3 Months)',
          description: 'Prestigious accreditation for master graduates with explicit 3-month quarterly validity, recertification schedule, and ISO QR verification.',
          tabId: 'certificates',
          badge: 'Valid for 3 Months',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          isInteractive: true,
        },
        {
          title: "Kapil's Letter of Recommendation (LOR) in Professional PDF",
          description: 'Institutional letter of recommendation on SarlaYash letterhead, verifying candidate mastery, percentile standing, cursive signature, and zero-crop A4 PDF export.',
          tabId: 'lor',
          badge: 'Institutional PDF LOR',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          isInteractive: true,
        },
        {
          title: 'Badges Portfolio (7 Accredited Badges)',
          description: 'Verifiable digital badges with unique IDs and scannable ISO QR codes, high-res 800x800 canvas preview, PNG export, and PDF print.',
          tabId: 'certificates',
          badge: '7 QR-Verified Badges',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          isInteractive: true,
        },
        {
          title: 'Official Canvas Certificate Engine',
          description: 'High-res 1600x1130 obsidian & gold foil credential with dynamic name scaling, real scannable QR code, PNG download, and zero-crop PDF print.',
          tabId: 'certificates',
          badge: 'High-Res PDF / PNG',
          badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          isInteractive: true,
        },
        {
          title: 'Public Credential Verification Portal',
          description: 'Publicly accessible verification registry allowing employers, recruiters, and colleagues to authenticate any certificate or badge ID via QR scan.',
          tabId: 'verify',
          badge: 'Public Registry',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          isInteractive: true,
        },
      ],
    },
    {
      id: 'platform',
      category: 'Platform Operations & Utilities',
      icon: LayoutDashboard,
      items: [
        {
          title: 'Learner Control Tower Dashboard',
          description: 'Personalized progress cockpit showing XP, daily streak, current persona tier, quick resume, and 30-hour curriculum status.',
          tabId: 'dashboard',
          badge: 'Overview',
          badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
          isInteractive: true,
        },
        {
          title: 'Global Ground-Truth Leaderboard',
          description: 'Transparent rankings based strictly on solved challenges, earned XP, and active streaks with zero fake users.',
          tabId: 'leaderboard',
          badge: 'Rankings',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          isInteractive: true,
        },
        {
          title: 'Administrative Control Console',
          description: 'Platform metrics, progress resets, and state debugging tools.',
          tabId: 'admin',
          badge: 'Admin Tools',
          badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          isInteractive: true,
        },
        {
          title: 'Progressive Web App (PWA) Offline Engine',
          description: 'Installable on iOS, Android, macOS, and Windows with 100% offline cache support and zero external spreadsheet dependencies.',
          tabId: 'dashboard',
          badge: '100% Offline PWA',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          isInteractive: true,
        },
      ],
    },
  ];

  const categories = ['All', ...siteMapSections.map((s) => s.category)];

  const filteredSections = siteMapSections
    .map((sec) => {
      const matchCat = selectedCategory === 'All' || sec.category === selectedCategory;
      if (!matchCat) return null;

      const filteredItems = sec.items.filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        );
      });

      if (filteredItems.length === 0) return null;

      return {
        ...sec,
        items: filteredItems,
      };
    })
    .filter(Boolean) as SiteMapSection[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-gray-200">
      {/* ================= HERO HEADER ================= */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#141624] via-[#0d0f17] to-[#1a1626] border border-amber-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                PLATFORM ARCHITECTURE & SITE MAP
              </span>
              <span className="text-xs text-gray-400">• Complete Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <Map className="w-8 h-8 text-amber-400" /> Visual Business Engine Site Map
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Explore the entire curriculum architecture, simulation labs, industry practicums,
              timed assessments, and QR-verified credentialing systems.
            </p>
          </div>

          {/* Quick Demo User Trigger */}
          {onLoadDemoUser && (
            <div className="bg-[#121422] border border-amber-500/30 p-4 rounded-xl text-center shrink-0 space-y-2 shadow-xl">
              <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Testing Mode
              </div>
              <button
                onClick={() => {
                  playSuccess();
                  onLoadDemoUser();
                }}
                className="w-full px-4 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
              >
                <UserCheck className="w-4 h-4 fill-black" />
                <span>Load Demo User (See Unlocked Badges & Certs)</span>
              </button>
              <span className="text-[10px] text-gray-400 block">
                Unlocks 100% of badges, certificates, and scores
              </span>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections, modules, or engines..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b0c12] text-sm text-white rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTIONS GRID ================= */}
      <div className="space-y-8">
        {filteredSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <SectionIcon className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white">{section.category}</h2>
                <span className="text-xs text-gray-500 font-mono">({section.items.length} items)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0f1118] border border-white/10 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group hover:scale-[1.01]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => {
                          playClick();
                          onNavigateTab(item.tabId, item.meta);
                        }}
                        className="w-full py-2 rounded-xl bg-white/5 group-hover:bg-amber-500/20 text-gray-300 group-hover:text-amber-300 border border-white/10 group-hover:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <span>Launch / Open Section</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
