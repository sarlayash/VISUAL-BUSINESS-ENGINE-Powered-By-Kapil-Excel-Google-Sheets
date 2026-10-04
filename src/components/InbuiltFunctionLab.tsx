import React, { useState } from 'react';
import {
  Code,
  FileSpreadsheet,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Database,
  Layers,
  ArrowRight,
  Info,
  Terminal,
  Zap,
} from 'lucide-react';
import { evaluateFormula } from '../utils/formulaEngine';
import { playClick, playSuccess } from '../utils/soundEffects';

interface PresetDataset {
  id: string;
  name: string;
  domain: string;
  description: string;
  headers: string[];
  rows: (string | number)[][];
}

const PRESET_DATASETS: PresetDataset[] = [
  {
    id: 'retail',
    name: 'Nexus Retail Sales & Gross Revenue',
    domain: 'Retail & E-Commerce',
    description: 'Q3 orders with units sold, pricing, discount, and category classifications.',
    headers: ['Order ID', 'Product Name', 'Category', 'Units', 'Unit Price (₹)', 'Discount %'],
    rows: [
      ['ORD-101', 'Logitech MX Master', 'Accessories', 25, 8000, 0.10],
      ['ORD-102', 'Dell UltraSharp 27"', 'Hardware', 12, 32000, 0.05],
      ['ORD-103', 'Keychron K2 RGB', 'Accessories', 40, 6500, 0.15],
      ['ORD-104', 'Ergonomic Standing Desk', 'Furniture', 8, 45000, 0.00],
      ['ORD-105', 'Bose 700 ANC Headset', 'Audio', 18, 28000, 0.12],
    ],
  },
  {
    id: 'payroll',
    name: 'FinCorp Corporate Payroll & Performance',
    domain: 'Human Resources',
    description: 'Departmental staff compensation, annual performance rating, and bonus brackets.',
    headers: ['Emp ID', 'Employee Name', 'Department', 'Base Salary (₹)', 'Rating (1-5)', 'Years Tenure'],
    rows: [
      ['EMP-01', 'Aditi Sharma', 'Engineering', 1400000, 4.8, 5],
      ['EMP-02', 'Rohan Verma', 'Sales', 950000, 3.9, 2],
      ['EMP-03', 'Kavita Nair', 'Marketing', 1100000, 4.5, 4],
      ['EMP-04', 'Siddharth Joshi', 'Engineering', 1850000, 4.9, 6],
      ['EMP-05', 'Meera Rao', 'Operations', 850000, 3.4, 1],
    ],
  },
  {
    id: 'inventory',
    name: 'AeroGlobal Supply Chain & Reorder Levels',
    domain: 'Supply Chain & Logistics',
    description: 'Warehouse inventory valuation, stock on hand, unit cost, and safety stock points.',
    headers: ['SKU Code', 'Item Description', 'Category', 'In Stock', 'Unit Cost (₹)', 'Safety Reorder'],
    rows: [
      ['SKU-A10', 'Titanium Fastener 10mm', 'Fasteners', 4500, 120, 2000],
      ['SKU-B20', 'Ceramic Brake Rotor', 'Components', 280, 8500, 300],
      ['SKU-C30', 'Carbon Fiber Spar', 'Aerospace', 45, 125000, 50],
      ['SKU-D40', 'Hydraulic Actuator Seal', 'Hydraulics', 1200, 1450, 800],
      ['SKU-E50', 'Avionics Bus Connector', 'Electronics', 640, 3200, 500],
    ],
  },
  {
    id: 'banking',
    name: 'AxisCapital Corporate Loan Portfolio',
    domain: 'Banking & Financial Modeling',
    description: 'Commercial term loans, principal values, annual interest rates, and loan tenure in years.',
    headers: ['Loan ID', 'Borrower Entity', 'Principal (₹)', 'Annual Rate', 'Tenure (Yrs)', 'Collateral Type'],
    rows: [
      ['LN-801', 'Zenith Logistics Ltd', 5000000, 0.085, 5, 'Fleet Assets'],
      ['LN-802', 'Pulse Biotech Labs', 12000000, 0.092, 7, 'Patent IP'],
      ['LN-803', 'Apex Solar Parks', 25000000, 0.078, 10, 'Power PPA'],
      ['LN-804', 'CloudNine Data Centers', 18000000, 0.088, 8, 'Real Estate'],
      ['LN-805', 'Vertex Textile Mills', 6500000, 0.095, 4, 'Machinery'],
    ],
  },
];

interface InbuiltFunctionDef {
  name: string;
  category: 'Math' | 'Logic' | 'Lookup' | 'Text' | 'Finance';
  formulaTemplate: string;
  targetCell: string;
  syntax: string;
  description: string;
  proTip: string;
}

const INBUILT_FUNCTIONS: InbuiltFunctionDef[] = [
  // Math & Statistics
  {
    name: 'SUM',
    category: 'Math',
    formulaTemplate: '=SUM(E2:E6)',
    targetCell: 'E7',
    syntax: '=SUM(number1, [number2], ...)',
    description: 'Calculates the mathematical sum of all numeric values in range E2:E6.',
    proTip: 'SUM ignores text strings and blank cells automatically without producing #VALUE!.',
  },
  {
    name: 'AVERAGE',
    category: 'Math',
    formulaTemplate: '=AVERAGE(E2:E6)',
    targetCell: 'E7',
    syntax: '=AVERAGE(number1, [number2], ...)',
    description: 'Computes the arithmetic mean across all numeric entries in E2:E6.',
    proTip: 'Use MEDIAN instead of AVERAGE when your dataset contains extreme outliers.',
  },
  {
    name: 'COUNT',
    category: 'Math',
    formulaTemplate: '=COUNT(D2:D6)',
    targetCell: 'D7',
    syntax: '=COUNT(value1, [value2], ...)',
    description: 'Counts the number of cells that contain numbers in D2:D6.',
    proTip: 'To count cells with text or names, use COUNTA instead of COUNT.',
  },
  {
    name: 'MAX',
    category: 'Math',
    formulaTemplate: '=MAX(E2:E6)',
    targetCell: 'E7',
    syntax: '=MAX(number1, [number2], ...)',
    description: 'Returns the largest numeric value in range E2:E6.',
    proTip: 'Pair with XLOOKUP to find which customer or product generated the maximum revenue.',
  },
  {
    name: 'MIN',
    category: 'Math',
    formulaTemplate: '=MIN(E2:E6)',
    targetCell: 'E7',
    syntax: '=MIN(number1, [number2], ...)',
    description: 'Returns the smallest numeric value in range E2:E6.',
    proTip: 'Great for identifying lowest unit cost or minimum vendor quote.',
  },
  {
    name: 'ROUND',
    category: 'Math',
    formulaTemplate: '=ROUND(E2*0.18, 2)',
    targetCell: 'G2',
    syntax: '=ROUND(number, num_digits)',
    description: 'Rounds a number to a specified number of decimal places.',
    proTip: 'In financial ledgers, always round tax calculations to 2 decimal places to prevent penny rounding drift.',
  },

  // Conditional Logic
  {
    name: 'IF',
    category: 'Logic',
    formulaTemplate: '=IF(D2>20, "High Volume", "Standard")',
    targetCell: 'G2',
    syntax: '=IF(logical_test, value_if_true, value_if_false)',
    description: 'Checks if units in D2 > 20 and returns "High Volume" if true, else "Standard".',
    proTip: 'Keep nested IF statements to a maximum of 3 levels, or upgrade to IFS / XLOOKUP.',
  },
  {
    name: 'COUNTIF',
    category: 'Logic',
    formulaTemplate: '=COUNTIF(C2:C6, "Accessories")',
    targetCell: 'G2',
    syntax: '=COUNTIF(range, criteria)',
    description: 'Counts how many rows in Category column C2:C6 equal "Accessories".',
    proTip: 'Use wildcard asterisks like =COUNTIF(C2:C6, "*Access*") for partial text matches.',
  },
  {
    name: 'SUMIF',
    category: 'Logic',
    formulaTemplate: '=SUMIF(C2:C6, "Accessories", E2:E6)',
    targetCell: 'G2',
    syntax: '=SUMIF(range, criteria, [sum_range])',
    description: 'Sums amounts in E2:E6 where the Category in C2:C6 equals "Accessories".',
    proTip: 'In SUMIF, criteria_range comes first; in SUMIFS, sum_range comes first.',
  },
  {
    name: 'SUMIFS',
    category: 'Logic',
    formulaTemplate: '=SUMIFS(E2:E6, C2:C6, "Accessories", D2:D6, ">20")',
    targetCell: 'G2',
    syntax: '=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)',
    description: 'Sums revenue in E2:E6 for items in Category "Accessories" that sold more than 20 units.',
    proTip: 'Comparison operators like ">20" must always be wrapped in quotes.',
  },
  {
    name: 'IFERROR',
    category: 'Logic',
    formulaTemplate: '=IFERROR(E2/D2, 0)',
    targetCell: 'G2',
    syntax: '=IFERROR(value, value_if_error)',
    description: 'Returns the calculation E2/D2, or 0 if an error like #DIV/0! or #VALUE! occurs.',
    proTip: 'Always wrap lookup and division formulas in IFERROR for polished C-Suite presentations.',
  },

  // Lookup & Reference
  {
    name: 'VLOOKUP',
    category: 'Lookup',
    formulaTemplate: '=VLOOKUP("ORD-103", A2:E6, 5, FALSE)',
    targetCell: 'G2',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Finds Order "ORD-103" in Column A and retrieves Unit Price from Column 5.',
    proTip: 'Always provide FALSE (or 0) as the 4th argument to guarantee exact matching.',
  },
  {
    name: 'XLOOKUP',
    category: 'Lookup',
    formulaTemplate: '=XLOOKUP("ORD-102", A2:A6, E2:E6, "Not Found")',
    targetCell: 'G2',
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], ...)',
    description: 'Modern exact-match lookup searching Order "ORD-102" in A2:A6 and returning Price from E2:E6.',
    proTip: 'XLOOKUP can effortlessly look up values to the left and has built-in if_not_found fallback.',
  },
  {
    name: 'INDEX+MATCH',
    category: 'Lookup',
    formulaTemplate: '=INDEX(B2:B6, MATCH("ORD-104", A2:A6, 0))',
    targetCell: 'G2',
    syntax: '=INDEX(array, MATCH(lookup_value, lookup_array, 0))',
    description: 'Resilient 2-way lookup that finds row position with MATCH and extracts Product Name with INDEX.',
    proTip: 'INDEX+MATCH is immune to column insertion/deletion bugs that break classic VLOOKUP.',
  },
  {
    name: 'UNIQUE',
    category: 'Lookup',
    formulaTemplate: '=UNIQUE(C2:C6)',
    targetCell: 'G2',
    syntax: '=UNIQUE(array)',
    description: 'Spills a dynamic array list containing only unique distinct categories from C2:C6.',
    proTip: 'Ensure adjacent cells below the formula are blank to prevent #SPILL! errors.',
  },

  // Text Operations
  {
    name: 'CONCATENATE',
    category: 'Text',
    formulaTemplate: '=CONCATENATE(A2, " - ", B2)',
    targetCell: 'G2',
    syntax: '=CONCATENATE(text1, [text2], ...) or text1 & text2',
    description: 'Combines Order ID in A2 and Product Name in B2 with a hyphen separator.',
    proTip: 'The ampersand operator (&) is shorthand for CONCATENATE: =A2 & " - " & B2.',
  },
  {
    name: 'TEXTJOIN',
    category: 'Text',
    formulaTemplate: '=TEXTJOIN(", ", TRUE, C2:C6)',
    targetCell: 'G2',
    syntax: '=TEXTJOIN(delimiter, ignore_empty, text1, ...)',
    description: 'Joins all category strings in C2:C6 separated by a comma and space, ignoring blanks.',
    proTip: 'Perfect for summarizing multi-select tagging or combining tags into a single cell.',
  },
  {
    name: 'UPPER',
    category: 'Text',
    formulaTemplate: '=UPPER(B2)',
    targetCell: 'G2',
    syntax: '=UPPER(text)',
    description: 'Converts product name in B2 to all uppercase capital letters.',
    proTip: 'Use PROPER() when you want standard title case formatting for customer names.',
  },

  // Financial & Stats
  {
    name: 'PMT',
    category: 'Finance',
    formulaTemplate: '=PMT(0.085/12, 60, -5000000)',
    targetCell: 'G2',
    syntax: '=PMT(rate, nper, pv, [fv], [type])',
    description: 'Calculates the monthly loan installment (EMI) on ₹5,000,000 at 8.5% annual rate over 5 years (60 months).',
    proTip: 'Always divide annual interest rate by 12 and enter principal (PV) as negative.',
  },
  {
    name: 'MEDIAN',
    category: 'Finance',
    formulaTemplate: '=MEDIAN(E2:E6)',
    targetCell: 'E7',
    syntax: '=MEDIAN(number1, [number2], ...)',
    description: 'Returns the statistical 50th percentile midpoint across prices in E2:E6.',
    proTip: 'The median represents the genuine middle-tier price, unaffected by massive single outliers.',
  },
];

interface InbuiltFunctionLabProps {
  onTryInIde: (dataset: any, formula: string, taskTitle: string) => void;
}

export const InbuiltFunctionLab: React.FC<InbuiltFunctionLabProps> = ({ onTryInIde }) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('retail');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Math' | 'Logic' | 'Lookup' | 'Text' | 'Finance'>('All');
  const [selectedFunction, setSelectedFunction] = useState<InbuiltFunctionDef>(INBUILT_FUNCTIONS[0]);
  const [activeFormula, setActiveFormula] = useState<string>(INBUILT_FUNCTIONS[0].formulaTemplate);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const activeDataset = PRESET_DATASETS.find((d) => d.id === selectedDatasetId) || PRESET_DATASETS[0];

  // Helper to build grid from dataset
  const buildGrid = (dataset: PresetDataset) => {
    const grid: any = {};
    dataset.headers.forEach((h, colIdx) => {
      const colLetter = String.fromCharCode(65 + colIdx);
      grid[`${colLetter}1`] = { raw: h, computed: h };
    });
    dataset.rows.forEach((row, rowIdx) => {
      row.forEach((cellVal, colIdx) => {
        const colLetter = String.fromCharCode(65 + colIdx);
        grid[`${colLetter}${rowIdx + 2}`] = { raw: String(cellVal), computed: cellVal };
      });
    });
    return grid;
  };

  // Execute formula immediately
  const executeActiveFormula = (formula: string, funcDef: InbuiltFunctionDef, dataset: PresetDataset) => {
    const grid = buildGrid(dataset);
    const evalRes = evaluateFormula(formula, grid, funcDef.targetCell);
    setExecutionResult({
      formula,
      value: evalRes.value,
      error: evalRes.error,
      targetCell: funcDef.targetCell,
      type: typeof evalRes.value,
    });
  };

  // Handle click on function button
  const handleSelectFunction = (func: InbuiltFunctionDef) => {
    playClick();
    setSelectedFunction(func);
    setActiveFormula(func.formulaTemplate);
    executeActiveFormula(func.formulaTemplate, func, activeDataset);
    playSuccess();
  };

  // Handle Load Data preset
  const handleLoadDataset = (datasetId: string) => {
    playClick();
    setSelectedDatasetId(datasetId);
    const nextDs = PRESET_DATASETS.find((d) => d.id === datasetId) || PRESET_DATASETS[0];
    executeActiveFormula(selectedFunction.formulaTemplate, selectedFunction, nextDs);
    playSuccess();
  };

  // Filtered function list
  const filteredFunctions = activeCategory === 'All'
    ? INBUILT_FUNCTIONS
    : INBUILT_FUNCTIONS.filter((f) => f.category === activeCategory);

  // Trigger initial execution on mount
  React.useEffect(() => {
    executeActiveFormula(selectedFunction.formulaTemplate, selectedFunction, activeDataset);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              INBUILT FUNCTIONS PLAYGROUND & EXECUTOR
            </span>
            <span className="text-xs text-gray-400">30+ Supported Formulas</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Inbuilt Function Lab</h1>
          <p className="text-sm text-gray-400 mt-1">
            Load sample business datasets, click any inbuilt function to execute live, and transition to the full IDE simulator with 1 click.
          </p>
        </div>

        {/* Try in IDE Action */}
        <button
          onClick={() => {
            playClick();
            onTryInIde(activeDataset, activeFormula, `${selectedFunction.name} Demonstration`);
          }}
          className="px-5 py-2.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
        >
          <Terminal className="w-4 h-4 fill-black" />
          <span>Try in IDE Simulator</span>
        </button>
      </div>

      {/* ================= STEP 1: LOAD / FILL DATA BUTTONS ================= */}
      <div className="bg-[#0f111a] p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Step 1: Choose Dataset & Click "Fill Data"
            </span>
          </div>
          <span className="text-xs text-amber-400 font-mono">
            Active: {activeDataset.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_DATASETS.map((ds) => {
            const isSelected = ds.id === selectedDatasetId;
            return (
              <button
                key={ds.id}
                onClick={() => handleLoadDataset(ds.id)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                    : 'bg-[#151724] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                      {ds.domain}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{ds.name}</h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{ds.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-amber-400 font-semibold">
                  <span>⚡ Fill / Load Data</span>
                  <span>{ds.rows.length} rows</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 2: INBUILT FUNCTION BUTTONS ================= */}
      <div className="bg-[#0f111a] p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Step 2: Click Inbuilt Function to Execute Instantly
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-[#151724] p-1 rounded-xl border border-white/5 text-xs overflow-x-auto no-scrollbar">
            {(['All', 'Math', 'Logic', 'Lookup', 'Text', 'Finance'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Function Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {filteredFunctions.map((fn) => {
            const isSelected = selectedFunction.name === fn.name;
            return (
              <button
                key={fn.name}
                onClick={() => handleSelectFunction(fn)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold border-amber-400 shadow-lg scale-[1.02]'
                    : 'bg-[#151724] border-white/5 text-gray-300 hover:border-amber-400/50 hover:bg-[#1a1d2e]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`font-mono text-xs ${
                      isSelected ? 'text-black' : 'text-amber-400 font-bold'
                    }`}
                  >
                    fx
                  </span>
                  <span className="text-xs font-bold truncate">{fn.name}</span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isSelected
                      ? 'bg-black/20 text-black'
                      : 'bg-[#0c0d14] text-gray-400'
                  }`}
                >
                  {fn.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 3: LIVE EXECUTION INSPECTOR & SPREADSHEET PREVIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spreadsheet Table with Active Execution Cell */}
        <div className="lg:col-span-7 bg-[#0e1018] rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Live Grid Preview</h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Evaluating in: <strong className="text-amber-400">{selectedFunction.targetCell}</strong>
            </span>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#07080b]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#121422] text-amber-300 border-b border-white/10 font-mono">
                <tr>
                  <th className="p-2 border-r border-white/10 w-10 text-center text-gray-500">#</th>
                  {activeDataset.headers.map((h, i) => (
                    <th key={i} className="p-2 border-r border-white/10">
                      {String.fromCharCode(65 + i)}: {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeDataset.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-2 border-r border-white/10 font-mono text-center text-gray-500">
                      {rIdx + 2}
                    </td>
                    {row.map((cellVal, cIdx) => (
                      <td key={cIdx} className="p-2 border-r border-white/10 font-mono text-gray-300">
                        {String(cellVal)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Result Row if target is in bottom summary */}
                {selectedFunction.targetCell.endsWith('7') && (
                  <tr className="bg-amber-500/10 border-t-2 border-amber-500/40">
                    <td className="p-2 border-r border-white/10 font-mono text-center text-amber-400 font-bold">
                      7
                    </td>
                    <td colSpan={activeDataset.headers.length - 1} className="p-2 text-right text-gray-400 font-bold">
                      Computed Output [{selectedFunction.targetCell}]:
                    </td>
                    <td className="p-2 font-mono text-amber-300 font-black text-sm">
                      {executionResult ? String(executionResult.value) : '...'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Quick info caption */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <span>Click any function above to auto-insert and calculate in real-time.</span>
            <span className="text-emerald-400 font-mono">100% Client-Side Engine</span>
          </div>
        </div>

        {/* Right Column: Function Inspector & Try in IDE Action */}
        <div className="lg:col-span-5 bg-[#0f111a] rounded-2xl p-6 border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h3 className="text-lg font-black text-white">Execution Inspector</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 font-mono">
              {selectedFunction.name}
            </span>
          </div>

          {/* Live Executed Formula Bar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase">
              Executed Formula in Cell {selectedFunction.targetCell}:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#141624] border border-amber-500/40 rounded-xl px-3.5 py-2 font-mono text-xs text-amber-300 truncate">
                {activeFormula}
              </div>
              <button
                onClick={() => executeActiveFormula(activeFormula, selectedFunction, activeDataset)}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
                title="Re-execute formula"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Computed Output Card */}
          <div className="bg-[#151724] p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Evaluated Return Value:</span>
              <span className="font-mono text-[10px] text-gray-500">
                Type: {executionResult?.type || 'string'}
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {executionResult ? String(executionResult.value) : 'Calculating...'}
            </div>
          </div>

          {/* Syntax & Description */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-gray-400 font-mono text-[11px] mb-1">Standard Syntax:</div>
              <div className="bg-[#090a10] p-2.5 rounded-lg border border-white/5 font-mono text-amber-300">
                {selectedFunction.syntax}
              </div>
            </div>

            <div>
              <div className="text-gray-400 font-mono text-[11px] mb-1">Description:</div>
              <p className="text-gray-300 leading-relaxed">{selectedFunction.description}</p>
            </div>

            <div className="bg-[#121422] p-3 rounded-xl border border-amber-500/20">
              <strong className="text-amber-400">Kapil's Pro-Tip: </strong>
              <span className="text-gray-300">{selectedFunction.proTip}</span>
            </div>
          </div>

          {/* STEP 4: BIG "TRY IN IDE" BUTTON */}
          <div className="pt-2">
            <button
              onClick={() => {
                playClick();
                onTryInIde(activeDataset, activeFormula, `${selectedFunction.name} Simulator`);
              }}
              className="w-full py-3.5 rounded-xl gold-gradient-btn text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] active:scale-95 transition"
            >
              <Terminal className="w-4 h-4 fill-black" />
              <span>Try in IDE (Interactive Simulator)</span>
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              Loads this dataset, formula, and selected cell into the full interactive IDE editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
