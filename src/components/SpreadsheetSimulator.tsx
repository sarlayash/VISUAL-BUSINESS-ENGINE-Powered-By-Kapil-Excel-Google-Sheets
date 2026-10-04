import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Filter,
  ArrowUpDown,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Play,
  Lightbulb,
  FileSpreadsheet,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Challenge, GridData, CellData, CellValue } from '../types';
import { evaluateFormula, indexToColLetter, colLetterToIndex } from '../utils/formulaEngine';
import { playClick, playSuccess, playError, playHintSound } from '../utils/soundEffects';
import { FormulaKeypadMobile } from './FormulaKeypadMobile';
import { KapilAiMentorModal } from './KapilAiMentorModal';
import { ChartViewer } from './ChartViewer';
import confetti from 'canvas-confetti';

interface SpreadsheetSimulatorProps {
  challenge: Challenge;
  onChallengePassed: (challengeId: string, earnedXp: number) => void;
  onNextChallenge?: () => void;
}

export const SpreadsheetSimulator: React.FC<SpreadsheetSimulatorProps> = ({
  challenge,
  onChallengePassed,
  onNextChallenge,
}) => {
  // Simulator State
  const [grid, setGrid] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [xpDeduction, setXpDeduction] = useState<number>(0);
  const [isValidationPassed, setIsValidationPassed] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isAiMentorOpen, setIsAiMentorOpen] = useState<boolean>(false);
  const [showChartDrawer, setShowChartDrawer] = useState<boolean>(false);
  const [viewToolMode, setViewToolMode] = useState<'excel' | 'sheets'>('excel');
  const [filterActiveCol, setFilterActiveCol] = useState<string | null>(null);

  const cellInputRef = useRef<HTMLInputElement>(null);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  const numCols = Math.max(challenge.initialData.headers.length + 2, 7);
  const numRows = Math.max(challenge.initialData.rows.length + 4, 12);

  // Initialize spreadsheet grid whenever challenge changes
  useEffect(() => {
    initializeGridFromChallenge();
  }, [challenge]);

  const initializeGridFromChallenge = () => {
    const newGrid: GridData = {};

    // Populate Headers (Row 1)
    challenge.initialData.headers.forEach((header, colIdx) => {
      const cellId = `${indexToColLetter(colIdx)}1`;
      newGrid[cellId] = {
        raw: header,
        computed: header,
        style: { bold: true, align: 'center', bgColor: '#181b28', textColor: '#f59e0b' },
      };
    });

    // Populate Data Rows (Row 2 onward)
    challenge.initialData.rows.forEach((row, rowIdx) => {
      row.forEach((cellVal, colIdx) => {
        const cellId = `${indexToColLetter(colIdx)}${rowIdx + 2}`;
        const rawStr = String(cellVal ?? '');
        const isFormula = rawStr.startsWith('=');
        newGrid[cellId] = {
          raw: rawStr,
          computed: cellVal,
          isFormula,
          style: {
            align: typeof cellVal === 'number' ? 'right' : 'left',
          },
        };
      });
    });

    // Evaluate pre-existing formulas
    Object.keys(newGrid).forEach((cellId) => {
      if (newGrid[cellId].raw.startsWith('=')) {
        const res = evaluateFormula(newGrid[cellId].raw, newGrid, cellId);
        newGrid[cellId].computed = res.value;
        newGrid[cellId].isError = Boolean(res.error || String(res.value).startsWith('#'));
      }
    });

    setGrid(newGrid);

    // Pick first target cell if available
    const targetCell = challenge.validationRules[0]?.targetCell || 'E2';
    setSelectedCell(targetCell);
    setFormulaInput(newGrid[targetCell]?.raw || '');
    setIsValidationPassed(false);
    setValidationErrors([]);
    setActiveHintLevel(0);
    setXpDeduction(0);
  };

  // Re-evaluate entire grid dependencies
  const recalculateGrid = (updatedGrid: GridData): GridData => {
    const nextGrid = { ...updatedGrid };
    // Multi-pass evaluation for dependencies
    for (let pass = 0; pass < 2; pass++) {
      Object.keys(nextGrid).forEach((cellId) => {
        const raw = nextGrid[cellId]?.raw;
        if (raw && raw.startsWith('=')) {
          const res = evaluateFormula(raw, nextGrid, cellId);
          nextGrid[cellId] = {
            ...nextGrid[cellId],
            computed: res.value,
            isFormula: true,
            isError: Boolean(res.error || String(res.value).startsWith('#')),
            errorMessage: res.error,
          };
        }
      });
    }
    return nextGrid;
  };

  const handleCellClick = (cellId: string) => {
    playClick();
    setSelectedCell(cellId);
    setFormulaInput(grid[cellId]?.raw || '');
    setIsEditing(false);
  };

  const handleCellDoubleClick = (cellId: string) => {
    setSelectedCell(cellId);
    setFormulaInput(grid[cellId]?.raw || '');
    setIsEditing(true);
    setTimeout(() => cellInputRef.current?.focus(), 50);
  };

  const commitFormulaValue = (valueToCommit: string) => {
    const nextGrid = { ...grid };
    const isFormula = valueToCommit.startsWith('=');

    nextGrid[selectedCell] = {
      ...(nextGrid[selectedCell] || {}),
      raw: valueToCommit,
      computed: isFormula ? '' : valueToCommit,
      isFormula,
    };

    const finalGrid = recalculateGrid(nextGrid);
    setGrid(finalGrid);
    setFormulaInput(valueToCommit);
    setIsEditing(false);

    // Check if error occurred
    if (finalGrid[selectedCell]?.isError) {
      playError();
    } else {
      playClick();
    }
  };

  // Formatting operations
  const applyCellStyle = (stylePatch: Partial<CellData['style']>) => {
    playClick();
    const cell = grid[selectedCell] || { raw: '', computed: '' };
    const updatedStyle = { ...(cell.style || {}), ...stylePatch };
    setGrid({
      ...grid,
      [selectedCell]: { ...cell, style: updatedStyle },
    });
  };

  // Sorting columns
  const handleSort = (colLetter: string, ascending: boolean) => {
    playClick();
    const colIdx = colLetterToIndex(colLetter);
    const rows = [...challenge.initialData.rows];

    rows.sort((a, b) => {
      const valA = a[colIdx];
      const valB = b[colIdx];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return ascending ? valA - valB : valB - valA;
      }
      return ascending
        ? String(valA || '').localeCompare(String(valB || ''))
        : String(valB || '').localeCompare(String(valA || ''));
    });

    const nextGrid = { ...grid };
    rows.forEach((row, rowIdx) => {
      row.forEach((cVal, cIdx) => {
        const id = `${indexToColLetter(cIdx)}${rowIdx + 2}`;
        if (nextGrid[id]) {
          nextGrid[id] = { ...nextGrid[id], raw: String(cVal), computed: cVal };
        }
      });
    });

    setGrid(recalculateGrid(nextGrid));
  };

  // Validate Challenge
  const handleValidateSubmission = () => {
    playClick();
    const errors: string[] = [];

    challenge.validationRules.forEach((rule) => {
      const cell = grid[rule.targetCell];
      if (!cell) {
        errors.push(`Target cell ${rule.targetCell} is empty.`);
        return;
      }

      // Check expected keywords in formula
      if (rule.expectedFormulaKeywords && rule.expectedFormulaKeywords.length > 0) {
        const rawUpper = cell.raw.toUpperCase();
        const hasKeyword = rule.expectedFormulaKeywords.some((kw) => rawUpper.includes(kw.toUpperCase()));
        if (!hasKeyword) {
          errors.push(`Cell ${rule.targetCell} should use function ${rule.expectedFormulaKeywords.join(' or ')}.`);
        }
      }

      // Check expected value
      if (rule.expectedValue !== undefined) {
        const actualVal = cell.computed;
        if (typeof rule.expectedValue === 'number') {
          const actualNum = typeof actualVal === 'number' ? actualVal : parseFloat(String(actualVal || ''));
          const tolerance = rule.tolerance || 0.001;
          if (isNaN(actualNum) || Math.abs(actualNum - rule.expectedValue) > tolerance) {
            errors.push(
              `Cell ${rule.targetCell} result is ${actualVal}, but expected ${rule.expectedValue}.`
            );
          }
        } else if (String(actualVal).toLowerCase().trim() !== String(rule.expectedValue).toLowerCase().trim()) {
          errors.push(
            `Cell ${rule.targetCell} result is "${actualVal}", expected "${rule.expectedValue}".`
          );
        }
      }
    });

    if (errors.length === 0) {
      playSuccess();
      setIsValidationPassed(true);
      setValidationErrors([]);
      const netXp = Math.max(20, challenge.xpReward - xpDeduction);
      onChallengePassed(challenge.id, netXp);

      // Trigger FAANG gold celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FBBF24', '#FFFFFF', '#D97706'],
        });
      } catch (e) {}
    } else {
      playError();
      setIsValidationPassed(false);
      setValidationErrors(errors);
    }
  };

  // Handle Hint Reveal with penalty
  const handleUnlockHint = (level: number) => {
    playHintSound();
    setActiveHintLevel(level);
    const hint = challenge.hints[level - 1];
    if (hint) {
      setXpDeduction((prev) => prev + hint.penaltyXp);
    }
  };

  // Prepare chart dataset from numeric column in grid
  const getChartDataFromGrid = () => {
    const dataPoints: { label: string; value: number; formatted?: string }[] = [];
    for (let r = 2; r <= challenge.initialData.rows.length + 1; r++) {
      const labelCell = grid[`B${r}`] || grid[`A${r}`];
      const valueCell = grid[`E${r}`] || grid[`C${r}`] || grid[`D${r}`];
      if (labelCell && valueCell) {
        const num = typeof valueCell.computed === 'number' ? valueCell.computed : parseFloat(String(valueCell.computed || ''));
        if (!isNaN(num)) {
          dataPoints.push({
            label: String(labelCell.computed || `Row ${r}`),
            value: num,
            formatted: typeof valueCell.computed === 'number' ? `₹${num.toLocaleString()}` : String(valueCell.computed),
          });
        }
      }
    }
    return dataPoints;
  };

  return (
    <div className="flex flex-col h-full bg-[#07080b] text-gray-200">
      {/* ================= TOP TOOLBAR & CONTROLS ================= */}
      <div className="bg-[#0e1017] border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Challenge title & Domain pill */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
            {challenge.businessDomain} Lab
          </span>
          <h2 className="text-white font-bold text-sm md:text-base truncate max-w-xs md:max-w-md">
            {challenge.title}
          </h2>
          <span className="text-xs text-gray-400 hidden sm:inline">
            ({challenge.difficulty} | +{challenge.xpReward} XP)
          </span>
        </div>

        {/* Action buttons: Reset, Kapil AI Mentor, Tool Switcher, Validate */}
        <div className="flex items-center gap-2">
          {/* Dual Learning Switcher: Excel vs Google Sheets */}
          <div className="flex items-center bg-[#151722] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => {
                playClick();
                setViewToolMode('excel');
              }}
              className={`px-2.5 py-1 rounded font-medium transition ${
                viewToolMode === 'excel'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Excel Mode
            </button>
            <button
              onClick={() => {
                playClick();
                setViewToolMode('sheets');
              }}
              className={`px-2.5 py-1 rounded font-medium transition ${
                viewToolMode === 'sheets'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Google Sheets Mode
            </button>
          </div>

          {/* Kapil AI Mentor Trigger */}
          <button
            onClick={() => {
              playClick();
              setIsAiMentorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kapil AI Mentor</span>
          </button>

          {/* Chart Toggle */}
          <button
            onClick={() => {
              playClick();
              setShowChartDrawer(!showChartDrawer);
            }}
            className={`p-1.5 rounded-lg border transition ${
              showChartDrawer
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#181a26] border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Live Chart View"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Reset challenge */}
          <button
            onClick={() => {
              playClick();
              initializeGridFromChallenge();
            }}
            className="p-1.5 rounded-lg bg-[#181a26] border border-white/10 text-gray-400 hover:text-white transition"
            title="Reset Simulation Grid"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Validate Result Button */}
          <button
            onClick={handleValidateSubmission}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg gold-gradient-btn text-black font-bold text-xs uppercase tracking-wide shadow-md transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Validate Result</span>
          </button>
        </div>
      </div>

      {/* ================= SPREADSHEET TOOLBAR (Formatting & Math) ================= */}
      <div className="bg-[#12141d] border-b border-white/5 px-4 py-1.5 flex items-center justify-between gap-3 text-xs shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {/* Active Cell coordinate display */}
          <div className="w-14 h-7 bg-[#1c1f2e] border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center rounded">
            {selectedCell}
          </div>

          <div className="h-5 w-px bg-white/10 mx-1"></div>

          {/* Bold, Italic */}
          <button
            onClick={() => applyCellStyle({ bold: !grid[selectedCell]?.style?.bold })}
            className={`p-1.5 rounded hover:bg-white/10 ${
              grid[selectedCell]?.style?.bold ? 'text-amber-400 bg-white/10' : 'text-gray-400'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => applyCellStyle({ italic: !grid[selectedCell]?.style?.italic })}
            className={`p-1.5 rounded hover:bg-white/10 ${
              grid[selectedCell]?.style?.italic ? 'text-amber-400 bg-white/10' : 'text-gray-400'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Alignment */}
          <button
            onClick={() => applyCellStyle({ align: 'left' })}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => applyCellStyle({ align: 'center' })}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => applyCellStyle({ align: 'right' })}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-white/10 mx-1"></div>

          {/* Currency ₹ & % */}
          <button
            onClick={() => applyCellStyle({ format: 'currency_inr' })}
            className="px-2 py-1 rounded bg-[#1b1e2c] border border-white/5 text-amber-300 font-mono text-[11px] hover:bg-white/10"
            title="Format as INR (₹)"
          >
            ₹ INR
          </button>
          <button
            onClick={() => applyCellStyle({ format: 'percent' })}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Format as Percentage (%)"
          >
            <Percent className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-white/10 mx-1"></div>

          {/* Sorting Helper */}
          <button
            onClick={() => {
              const col = selectedCell.replace(/[0-9]/g, '');
              handleSort(col, true);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1b1e2c] text-gray-300 hover:text-white text-[11px]"
            title="Sort Column A-Z"
          >
            <ArrowUpDown className="w-3 h-3 text-amber-400" /> Sort Asc
          </button>
        </div>

        {/* Expected formula concept badge */}
        <div className="hidden md:flex items-center gap-2 text-gray-400 text-xs">
          <span>Target:</span>
          <code className="text-amber-300 font-mono bg-black/40 px-2 py-0.5 rounded border border-amber-500/20">
            {viewToolMode === 'excel' ? challenge.excelFormula : challenge.googleSheetsFormula}
          </code>
        </div>
      </div>

      {/* ================= FORMULA BAR ================= */}
      <div className="bg-[#0b0c12] border-b border-white/10 px-4 py-2 flex items-center gap-2 shrink-0">
        <span className="font-mono text-gray-500 font-bold text-sm italic px-1 select-none">fx</span>
        <input
          ref={formulaInputRef}
          type="text"
          value={formulaInput}
          onChange={(e) => setFormulaInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitFormulaValue(formulaInput);
            }
          }}
          placeholder="Enter formula e.g. =SUM(C2:C6), =C2*D2 or =VLOOKUP(...)"
          className="flex-1 bg-[#141622] text-amber-300 font-mono text-sm px-3 py-1.5 rounded border border-white/10 focus:outline-none focus:border-amber-400 transition"
        />
        <button
          onClick={() => commitFormulaValue(formulaInput)}
          className="px-3 py-1.5 bg-[#1f2233] hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 rounded font-mono text-xs border border-white/10 transition"
        >
          Enter
        </button>
      </div>

      {/* ================= MAIN SPLIT VIEW: SPREADSHEET & BUSINESS BRIEF ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* SPREADSHEET INTERACTIVE GRID */}
        <div className="flex-1 overflow-auto bg-[#08090d] relative p-2">
          <div className="inline-block min-w-full border border-gray-800 rounded-lg shadow-2xl bg-[#0c0d14] overflow-hidden">
            {/* Table Header Row (Column Letters: A, B, C...) */}
            <div className="flex border-b border-gray-800 bg-[#12141c] sticky top-0 z-20">
              {/* Corner dead cell */}
              <div className="w-12 h-8 bg-[#181b26] border-r border-gray-800 flex items-center justify-center text-[11px] font-mono text-gray-500 select-none">
                #
              </div>
              {Array.from({ length: numCols }).map((_, cIdx) => {
                const colLetter = indexToColLetter(cIdx);
                return (
                  <div
                    key={colLetter}
                    className="w-36 h-8 bg-[#151722] border-r border-gray-800 flex items-center justify-between px-2 text-xs font-mono font-bold text-gray-300 select-none group"
                  >
                    <span>{colLetter}</span>
                    <button
                      onClick={() => handleSort(colLetter, true)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-amber-400 transition"
                      title={`Sort Column ${colLetter}`}
                    >
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Table Rows (1, 2, 3...) */}
            {Array.from({ length: numRows }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <div key={rowNum} className="flex border-b border-gray-800/80 hover:bg-white/[0.02]">
                  {/* Row Number header */}
                  <div className="w-12 h-9 bg-[#12141c] border-r border-gray-800 flex items-center justify-center text-xs font-mono text-gray-500 select-none shrink-0 sticky left-0 z-10">
                    {rowNum}
                  </div>

                  {/* Cells */}
                  {Array.from({ length: numCols }).map((_, cIdx) => {
                    const colLetter = indexToColLetter(cIdx);
                    const cellId = `${colLetter}${rowNum}`;
                    const cellData = grid[cellId];
                    const isSelected = selectedCell === cellId;
                    const isTarget = challenge.validationRules.some((r) => r.targetCell === cellId);
                    const isHeader = rowNum === 1;

                    // Display Value formatting
                    let displayVal: any = cellData?.computed ?? '';
                    if (cellData?.style?.format === 'currency_inr' && typeof cellData.computed === 'number') {
                      displayVal = `₹${cellData.computed.toLocaleString()}`;
                    } else if (cellData?.style?.format === 'percent' && typeof cellData.computed === 'number') {
                      displayVal = `${(cellData.computed * 100).toFixed(1)}%`;
                    }

                    return (
                      <div
                        key={cellId}
                        onClick={() => handleCellClick(cellId)}
                        onDoubleClick={() => handleCellDoubleClick(cellId)}
                        className={`w-36 h-9 px-2.5 flex items-center border-r border-gray-800/80 text-xs font-mono truncate transition-all cursor-cell select-none relative ${
                          isSelected ? 'cell-selected' : ''
                        } ${isTarget ? 'cell-target' : ''} ${
                          isHeader ? 'bg-[#141622] font-semibold text-amber-400 justify-center' : 'text-gray-200'
                        } ${
                          cellData?.isError ? 'text-red-400 bg-red-950/20' : ''
                        }`}
                        style={{
                          textAlign: cellData?.style?.align || (typeof cellData?.computed === 'number' ? 'right' : 'left'),
                          fontWeight: cellData?.style?.bold ? 'bold' : 'normal',
                          fontStyle: cellData?.style?.italic ? 'italic' : 'normal',
                          backgroundColor: cellData?.style?.bgColor,
                        }}
                      >
                        {isTarget && !cellData?.raw && (
                          <span className="text-[10px] text-emerald-400/80 italic font-sans flex items-center gap-1">
                            🎯 [Target: {cellId}]
                          </span>
                        )}

                        {displayVal !== '' && displayVal !== null && displayVal !== undefined && (
                          <span className="w-full truncate">{String(displayVal)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR: BUSINESS BRIEF & INTELLIGENT HINT SYSTEM */}
        <div className="w-full lg:w-96 bg-[#0c0d14] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col p-4 overflow-y-auto gap-4 shrink-0">
          {/* Business Story Card */}
          <div className="bg-[#13151f] border border-amber-500/20 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Business Story
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                10% Concept
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed italic mb-3">
              "{challenge.businessStory}"
            </p>
            <div className="bg-[#0b0c12] p-2.5 rounded-lg border border-white/5">
              <span className="text-[11px] text-amber-400 font-semibold block mb-1">Target Business Goal:</span>
              <p className="text-xs text-gray-200 font-medium">{challenge.businessGoal}</p>
            </div>
          </div>

          {/* Step-by-step instructions */}
          <div className="bg-[#13151f] border border-white/5 rounded-xl p-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Hands-On Steps (90%)
            </h4>
            <ol className="space-y-2 text-xs text-gray-300 list-decimal list-inside leading-relaxed">
              {challenge.instructions.map((inst, idx) => (
                <li key={idx} className="pl-1">
                  {inst}
                </li>
              ))}
            </ol>
          </div>

          {/* Validation Feedback Banner */}
          {isValidationPassed ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 animate-fade-in shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <CheckCircle2 className="w-5 h-5" /> Challenge Validated!
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                {challenge.solutionExplanation}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold font-mono">
                  +{Math.max(20, challenge.xpReward - xpDeduction)} XP Earned
                </span>
                {onNextChallenge && (
                  <button
                    onClick={onNextChallenge}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded transition"
                  >
                    Next Challenge →
                  </button>
                )}
              </div>
            </div>
          ) : validationErrors.length > 0 ? (
            <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1.5">
                <AlertCircle className="w-4 h-4" /> Validation Needed
              </div>
              <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* 3-Tier Intelligent Hint System (PRD Page 18) */}
          <div className="bg-[#13151f] border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Intelligent Hint System
              </span>
              {xpDeduction > 0 && (
                <span className="text-[10px] text-red-400 font-mono">-{xpDeduction} XP</span>
              )}
            </div>

            <div className="space-y-2">
              {/* Level 1: Concept */}
              <div className="p-2.5 rounded-lg bg-[#0b0c12] border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    🟢 Hint 1 — Concept
                  </span>
                  {activeHintLevel < 1 ? (
                    <button
                      onClick={() => handleUnlockHint(1)}
                      className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition"
                    >
                      Reveal (-10 XP)
                    </button>
                  ) : null}
                </div>
                {activeHintLevel >= 1 && (
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {challenge.hints[0]?.text}
                  </p>
                )}
              </div>

              {/* Level 2: Direction */}
              <div className="p-2.5 rounded-lg bg-[#0b0c12] border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    🟡 Hint 2 — Direction
                  </span>
                  {activeHintLevel < 2 ? (
                    <button
                      onClick={() => handleUnlockHint(2)}
                      className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
                    >
                      Reveal (-20 XP)
                    </button>
                  ) : null}
                </div>
                {activeHintLevel >= 2 && (
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {challenge.hints[1]?.text}
                  </p>
                )}
              </div>

              {/* Level 3: Guided */}
              <div className="p-2.5 rounded-lg bg-[#0b0c12] border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                    🔴 Hint 3 — Guided
                  </span>
                  {activeHintLevel < 3 ? (
                    <button
                      onClick={() => handleUnlockHint(3)}
                      className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                    >
                      Reveal (-30 XP)
                    </button>
                  ) : null}
                </div>
                {activeHintLevel >= 3 && (
                  <div className="mt-1.5">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {challenge.hints[2]?.text}
                    </p>
                    <button
                      onClick={() => {
                        playClick();
                        setFormulaInput(challenge.excelFormula);
                        commitFormulaValue(challenge.excelFormula);
                      }}
                      className="mt-2 text-[11px] px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono border border-amber-500/30 transition"
                    >
                      Paste Solution Formula
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LIVE CHART DRAWER (if toggled) ================= */}
      {showChartDrawer && (
        <div className="border-t border-white/10 p-4 bg-[#0a0c13] shrink-0 animate-fade-in">
          <ChartViewer
            title={`Real-Time Visualization: ${challenge.title}`}
            subtitle="Live connected data rendered directly from your spreadsheet simulation values"
            data={getChartDataFromGrid()}
            type="column"
          />
        </div>
      )}

      {/* ================= MOBILE QUICK FORMULA KEYPAD ================= */}
      <FormulaKeypadMobile
        onInsertText={(token) => setFormulaInput((prev) => prev + token)}
        onSubmit={() => commitFormulaValue(formulaInput)}
        onBackspace={() => setFormulaInput((prev) => prev.slice(0, -1))}
        onClear={() => setFormulaInput('')}
      />

      {/* ================= KAPIL AI BUSINESS MENTOR ================= */}
      <KapilAiMentorModal
        challenge={challenge}
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        onApplyFormulaSuggestion={(suggested) => {
          setFormulaInput(suggested);
          commitFormulaValue(suggested);
        }}
      />
    </div>
  );
};
