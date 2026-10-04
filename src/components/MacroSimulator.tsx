import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Code,
  Layers,
  ArrowRight,
  Database,
  FileCode,
  Circle,
  Copy,
  Zap,
  Clock,
  Send,
  Printer,
  Table,
} from 'lucide-react';
import { playClick, playSuccess } from '../utils/soundEffects';

interface MacroRecipe {
  id: string;
  title: string;
  domain: string;
  description: string;
  excelVba: string;
  googleAppsScript: string;
  actions: string[];
}

const PRESET_MACROS: MacroRecipe[] = [
  {
    id: 'clean_data',
    title: 'Automated Data Cleansing & Standardization',
    domain: 'Data Operations',
    description: 'Trims leading/trailing whitespace, converts customer names to Proper Case, and highlights duplicates.',
    actions: [
      'Looping through active used range...',
      'Applying TRIM() to remove irregular whitespace...',
      'Converting text strings to PROPER case...',
      'Conditional formatting applied to flag duplicates in Column A.',
      'Data Cleansing Complete: 48 cells standardized.',
    ],
    excelVba: `Sub CleanAndStandardizeData()
    Dim ws As Worksheet
    Dim rng As Range, cell As Range
    Set ws = ActiveSheet
    Set rng = ws.Range("A2:D10")
    
    Application.ScreenUpdating = False
    For Each cell In rng
        If Not IsEmpty(cell.Value) And VarType(cell.Value) = vbString Then
            cell.Value = Application.WorksheetFunction.Trim(cell.Value)
            cell.Value = Application.WorksheetFunction.Proper(cell.Value)
        End If
    Next cell
    Application.ScreenUpdating = True
    MsgBox "Data Cleansing Complete!", vbInformation
End Sub`,
    googleAppsScript: `function cleanAndStandardizeData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange("A2:D10");
  const values = range.getValues();
  
  const cleaned = values.map(row => 
    row.map(cell => {
      if (typeof cell === 'string') {
        const trimmed = cell.trim().replace(/\\s+/g, ' ');
        return trimmed.replace(/\\b\\w/g, c => c.toUpperCase());
      }
      return cell;
    })
  );
  range.setValues(cleaned);
  SpreadsheetApp.getUi().alert("Data Cleansing Complete!");
}`,
  },
  {
    id: 'exec_report',
    title: 'C-Suite Executive Report Formatting',
    domain: 'Executive Reporting',
    description: 'Applies corporate obsidian/gold palette, bolds headers, sets column widths, and adds a calculated Grand Total row.',
    actions: [
      'Applying dark obsidian theme (#07080B) with amber border to header...',
      'Bolding header row text and aligning numbers right...',
      'Auto-fitting column widths A:E for perfect glanceability...',
      'Injecting dynamic =SUM(E2:E6) in Grand Total footer cell.',
      'Report Styling Applied: Boardroom ready.',
    ],
    excelVba: `Sub FormatExecutiveBoardroomReport()
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    With ws.Range("A1:E1")
        .Font.Bold = True
        .Font.Color = RGB(245, 158, 11) ' Amber
        .Interior.Color = RGB(15, 17, 24) ' Obsidian
        .HorizontalAlignment = xlCenter
    End With
    
    ws.Columns("A:E").AutoFit
    ws.Range("E7").Formula = "=SUM(E2:E6)"
    ws.Range("E7").Font.Bold = True
End Sub`,
    googleAppsScript: `function formatExecutiveBoardroomReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const header = sheet.getRange("A1:E1");
  
  header.setFontWeight("bold")
        .setFontColor("#f59e0b")
        .setBackground("#0f1118")
        .setHorizontalAlignment("center");
        
  sheet.autoResizeColumns(1, 5);
  sheet.getRange("E7").setFormula("=SUM(E2:E6)").setFontWeight("bold");
}`,
  },
  {
    id: 'email_dispatch',
    title: 'Automated Invoice & Summary Email Dispatcher',
    domain: 'Finance & Accounts',
    description: 'Loops through pending ledger rows and sends automated balance notifications via Gmail or Outlook.',
    actions: [
      'Scanning Client Account Ledger for pending balances > ₹0...',
      'Extracting recipient emails and contact names...',
      'Rendering personalized HTML invoice template...',
      'Dispatching notification via authenticated mail transport...',
      'Mail Dispatch Complete: Sent 3 automated notifications.',
    ],
    excelVba: `Sub SendOutlookLedgerNotifications()
    Dim OutApp As Object, OutMail As Object
    Dim cell As Range
    Set OutApp = CreateObject("Outlook.Application")
    
    For Each cell In Range("A2:A4")
        Set OutMail = OutApp.CreateItem(0)
        With OutMail
            .To = cell.Offset(0, 1).Value
            .Subject = "Pending Account Statement - " & cell.Value
            .Body = "Dear Client, Please find attached your Q3 billing summary."
            .Send
        End With
    Next cell
End Sub`,
    googleAppsScript: `function sendGmailLedgerNotifications() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getRange("A2:C4").getValues();
  
  data.forEach(([client, email, amount]) => {
    GmailApp.sendEmail(
      email,
      \`Pending Account Statement - \${client}\`,
      \`Dear Client, your active outstanding balance is ₹\${amount}. Thank you!\`
    );
  });
}`,
  },
  {
    id: 'pdf_export',
    title: 'Dynamic PDF Export & Cloud Archival',
    domain: 'Compliance & Audit',
    description: 'Calculates the active sheet, sets print areas, and exports a high-resolution PDF document to cloud storage.',
    actions: [
      'Configuring Page Setup: Fit to 1 page wide by 1 page tall...',
      'Hiding operational calculation scratch tabs...',
      'Rendering vector PDF stream with timestamped filename...',
      'Archiving document to cloud storage repository.',
      'PDF Export Generated: Visual_Business_Report_2026.pdf',
    ],
    excelVba: `Sub ExportActiveSheetAsPDF()
    Dim ws As Worksheet
    Dim exportPath As String
    Set ws = ActiveSheet
    exportPath = Application.DefaultFilePath & "\\Executive_Summary.pdf"
    
    ws.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        Filename:=exportPath, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True, _
        IgnorePrintAreas:=False
    MsgBox "PDF saved to: " & exportPath
End Sub`,
    googleAppsScript: `function exportSheetAsPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const blob = ss.getAs('application/pdf');
  const folder = DriveApp.getRootFolder();
  const file = folder.createFile(blob).setName("Executive_Summary.pdf");
  SpreadsheetApp.getUi().alert("PDF created: " + file.getUrl());
}`,
  },
];

export const MacroSimulator: React.FC = () => {
  const [selectedMacroId, setSelectedMacroId] = useState<string>('clean_data');
  const [activeCodeTab, setActiveCodeTab] = useState<'vba' | 'appsScript'>('vba');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSteps, setRecordedSteps] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [gridState, setGridState] = useState<{
    headersBold: boolean;
    goldTheme: boolean;
    cleanedText: boolean;
    hasTotal: boolean;
  }>({
    headersBold: false,
    goldTheme: false,
    cleanedText: false,
    hasTotal: false,
  });

  const activeMacro = PRESET_MACROS.find((m) => m.id === selectedMacroId) || PRESET_MACROS[0];

  // Run Macro Simulation with animated step-by-step logs
  const handleExecuteMacro = () => {
    playClick();
    setIsRunning(true);
    setExecutionLogs(['[SYSTEM] Initializing Macro Execution Sandbox...']);

    activeMacro.actions.forEach((act, idx) => {
      setTimeout(() => {
        setExecutionLogs((prev) => [...prev, `[STEP ${idx + 1}] ${act}`]);
        if (idx === activeMacro.actions.length - 1) {
          setIsRunning(false);
          playSuccess();
          // Apply visual transform to grid
          if (activeMacro.id === 'clean_data') setGridState((g) => ({ ...g, cleanedText: true }));
          if (activeMacro.id === 'exec_report') setGridState((g) => ({ ...g, headersBold: true, goldTheme: true, hasTotal: true }));
        }
      }, (idx + 1) * 600);
    });
  };

  // Interactive Recorder action
  const handleRecordAction = (actionDesc: string, transformKey?: keyof typeof gridState) => {
    playClick();
    if (!isRecording) return;
    setRecordedSteps((prev) => [...prev, actionDesc]);
    if (transformKey) {
      setGridState((prev) => ({ ...prev, [transformKey]: true }));
    }
    playSuccess();
  };

  const handleReset = () => {
    playClick();
    setIsRecording(false);
    setRecordedSteps([]);
    setExecutionLogs([]);
    setGridState({
      headersBold: false,
      goldTheme: false,
      cleanedText: false,
      hasTotal: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              ENTERPRISE SPREADSHEET AUTOMATION ENGINE
            </span>
            <span className="text-xs text-emerald-400 font-mono">Dual VBA & Apps Script</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Macros & Script Automation Simulator</h1>
          <p className="text-sm text-gray-400 mt-1">
            Record actions, simulate code execution, and compare Microsoft Excel VBA vs Google Apps Script (JavaScript) side-by-side.
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-[#151724] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {/* ================= MACRO PRESET RECIPES ================= */}
      <div className="bg-[#0f111a] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Enterprise Macro Library
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono">4 Production Recipes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_MACROS.map((m) => {
            const isSelected = m.id === selectedMacroId;
            return (
              <button
                key={m.id}
                onClick={() => {
                  playClick();
                  setSelectedMacroId(m.id);
                  setExecutionLogs([]);
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                    : 'bg-[#151724] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-300 mb-2 inline-block">
                    {m.domain}
                  </span>
                  <h4 className="text-xs font-bold text-white mb-1">{m.title}</h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{m.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-amber-400">
                  <span>VBA + Apps Script</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= INTERACTIVE MACRO RECORDER & CODE RUNNER ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Simulated Spreadsheet & Recorder */}
        <div className="lg:col-span-6 bg-[#0e1018] rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-base">📊</span>
              <h3 className="text-sm font-bold text-white">Interactive Spreadsheet Sandbox</h3>
            </div>

            {/* Recorder Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClick();
                  setIsRecording(!isRecording);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-[#181a28] text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                <Circle className={`w-3 h-3 fill-current ${isRecording ? 'animate-ping' : ''}`} />
                <span>{isRecording ? 'Recording Macro...' : 'Record Macro'}</span>
              </button>

              <button
                disabled={isRunning}
                onClick={handleExecuteMacro}
                className="px-4 py-1.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Run Macro</span>
              </button>
            </div>
          </div>

          {/* Interactive Action Buttons for Recorder */}
          {isRecording && (
            <div className="p-3 bg-[#151724] border border-rose-500/30 rounded-xl space-y-2">
              <div className="text-[11px] text-rose-300 font-bold uppercase tracking-wider">
                Click actions below to simulate recording into macro:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleRecordAction('ws.Range("A1:D1").Font.Bold = True', 'headersBold')}
                  className="px-2.5 py-1 rounded bg-[#1e2236] hover:bg-white/10 text-white text-[11px] border border-white/10"
                >
                  Bold Headers
                </button>
                <button
                  onClick={() => handleRecordAction('ws.Range("A1:D1").Interior.Color = RGB(245,158,11)', 'goldTheme')}
                  className="px-2.5 py-1 rounded bg-[#1e2236] hover:bg-white/10 text-amber-300 text-[11px] border border-white/10"
                >
                  Apply Gold Theme
                </button>
                <button
                  onClick={() => handleRecordAction('Apply TRIM & PROPER to range', 'cleanedText')}
                  className="px-2.5 py-1 rounded bg-[#1e2236] hover:bg-white/10 text-emerald-300 text-[11px] border border-white/10"
                >
                  Trim & Proper Case
                </button>
                <button
                  onClick={() => handleRecordAction('ws.Range("D7").Formula = "=SUM(D2:D6)"', 'hasTotal')}
                  className="px-2.5 py-1 rounded bg-[#1e2236] hover:bg-white/10 text-blue-300 text-[11px] border border-white/10"
                >
                  Insert Total SUM
                </button>
              </div>
            </div>
          )}

          {/* Mini Spreadsheet Grid Preview */}
          <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#07080b]">
            <table className="w-full text-xs text-left">
              <thead
                className={`transition-colors font-mono ${
                  gridState.goldTheme
                    ? 'bg-amber-500/20 text-amber-300 border-b border-amber-500/40'
                    : 'bg-[#121422] text-gray-300 border-b border-white/10'
                }`}
              >
                <tr>
                  <th className="p-2.5 border-r border-white/10">Order ID</th>
                  <th className={`p-2.5 border-r border-white/10 ${gridState.headersBold ? 'font-black' : ''}`}>
                    Customer Name
                  </th>
                  <th className="p-2.5 border-r border-white/10">Category</th>
                  <th className="p-2.5 text-right">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {[
                  { id: 'ORD-101', name: gridState.cleanedText ? 'Rahul Sharma' : 'rahul   sharma', cat: 'Electronics', rev: 45000 },
                  { id: 'ORD-102', name: gridState.cleanedText ? 'Priya Nair' : 'PRIYA  NAIR  ', cat: 'Furniture', rev: 85000 },
                  { id: 'ORD-103', name: gridState.cleanedText ? 'Vikram Joshi' : 'vikram joshi', cat: 'Audio', rev: 32000 },
                  { id: 'ORD-104', name: gridState.cleanedText ? 'Ananya Roy' : '  ananya   ROY', cat: 'Electronics', rev: 110000 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-2.5 border-r border-white/10 text-amber-400">{row.id}</td>
                    <td className="p-2.5 border-r border-white/10 text-white font-sans">{row.name}</td>
                    <td className="p-2.5 border-r border-white/10 text-gray-300">{row.cat}</td>
                    <td className="p-2.5 text-right text-gray-200">₹{row.rev.toLocaleString()}</td>
                  </tr>
                ))}
                {gridState.hasTotal && (
                  <tr className="bg-amber-500/15 font-bold text-amber-300 border-t-2 border-amber-500/40">
                    <td colSpan={3} className="p-2.5 text-right uppercase">
                      Grand Total:
                    </td>
                    <td className="p-2.5 text-right font-black">₹272,000</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Real-time execution logs terminal */}
          <div className="bg-[#050608] border border-white/10 rounded-xl p-3 font-mono text-xs space-y-1 h-32 overflow-y-auto">
            <div className="text-gray-500 text-[10px] uppercase font-bold flex items-center justify-between border-b border-white/5 pb-1">
              <span>Execution Terminal Logs</span>
              <span className="text-emerald-400">Sandbox Ready</span>
            </div>
            {executionLogs.length === 0 ? (
              <div className="text-gray-600 text-[11px] italic pt-2">
                Click "Run Macro" above to simulate step-by-step code execution.
              </div>
            ) : (
              executionLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`text-[11px] ${
                    log.includes('Complete') ? 'text-emerald-400 font-bold' : 'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Dual Code Editor (VBA vs Google Apps Script) */}
        <div className="lg:col-span-6 bg-[#0f111a] rounded-2xl p-5 border border-amber-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Generated Macro Source Code</h3>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#151724] p-1 rounded-xl border border-white/5 text-xs">
              <button
                onClick={() => {
                  playClick();
                  setActiveCodeTab('vba');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeCodeTab === 'vba'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Excel VBA (.bas)
              </button>
              <button
                onClick={() => {
                  playClick();
                  setActiveCodeTab('appsScript');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeCodeTab === 'appsScript'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Google Apps Script (.gs)
              </button>
            </div>
          </div>

          {/* Code display block */}
          <div className="relative bg-[#07080b] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => {
                playSuccess();
                navigator.clipboard.writeText(
                  activeCodeTab === 'vba' ? activeMacro.excelVba : activeMacro.googleAppsScript
                );
                alert('Macro code copied to clipboard!');
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#181a26] hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-[11px] flex items-center gap-1 transition"
              title="Copy Code"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Copy</span>
            </button>

            <pre className="text-amber-200/90 leading-relaxed pt-2">
              {activeCodeTab === 'vba' ? activeMacro.excelVba : activeMacro.googleAppsScript}
            </pre>
          </div>

          {/* Kapil's Architecture Insight */}
          <div className="bg-[#121422] p-4 rounded-xl border border-white/5 space-y-1.5 text-xs">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kapil's Automation Architecture Note:</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {activeCodeTab === 'vba'
                ? 'Excel VBA runs locally on client hardware via COM objects. Always disable ScreenUpdating before loops (Application.ScreenUpdating = False) for a 10x speed boost.'
                : 'Google Apps Script executes on Google Cloud infrastructure. Always batch read and write operations via range.getValues() and range.setValues() to avoid multiple slow HTTP round-trips.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
