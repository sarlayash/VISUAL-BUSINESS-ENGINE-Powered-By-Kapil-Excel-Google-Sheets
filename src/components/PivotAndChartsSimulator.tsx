import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  PieChart,
  LineChart,
  Table,
  Filter,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Layers,
  ArrowRight,
  Database,
  TrendingUp,
  Sliders,
  Maximize2,
  Code,
} from 'lucide-react';
import { playClick, playSuccess } from '../utils/soundEffects';

interface PresetData {
  id: string;
  name: string;
  domain: string;
  headers: string[];
  records: { [key: string]: any }[];
}

const SIMULATOR_DATASETS: PresetData[] = [
  {
    id: 'retail',
    name: 'Nexus Retail Regional Sales',
    domain: 'Retail & E-Commerce',
    headers: ['Region', 'Category', 'Product', 'Quarter', 'Units Sold', 'Revenue (₹)', 'Profit (₹)'],
    records: [
      { Region: 'North', Category: 'Electronics', Product: 'Pro Mouse', Quarter: 'Q1', 'Units Sold': 120, 'Revenue (₹)': 240000, 'Profit (₹)': 72000 },
      { Region: 'North', Category: 'Electronics', Product: '4K Monitor', Quarter: 'Q1', 'Units Sold': 45, 'Revenue (₹)': 1080000, 'Profit (₹)': 324000 },
      { Region: 'North', Category: 'Furniture', Product: 'Standing Desk', Quarter: 'Q1', 'Units Sold': 30, 'Revenue (₹)': 750000, 'Profit (₹)': 225000 },
      { Region: 'West', Category: 'Electronics', Product: 'Pro Mouse', Quarter: 'Q1', 'Units Sold': 210, 'Revenue (₹)': 420000, 'Profit (₹)': 126000 },
      { Region: 'West', Category: 'Furniture', Product: 'Ergo Chair', Quarter: 'Q1', 'Units Sold': 85, 'Revenue (₹)': 1275000, 'Profit (₹)': 382500 },
      { Region: 'South', Category: 'Electronics', Product: 'USB-C Hub', Quarter: 'Q1', 'Units Sold': 320, 'Revenue (₹)': 480000, 'Profit (₹)': 144000 },
      { Region: 'South', Category: 'Audio', Product: 'ANC Headset', Quarter: 'Q1', 'Units Sold': 140, 'Revenue (₹)': 1120000, 'Profit (₹)': 336000 },
      { Region: 'North', Category: 'Audio', Product: 'ANC Headset', Quarter: 'Q2', 'Units Sold': 160, 'Revenue (₹)': 1280000, 'Profit (₹)': 384000 },
      { Region: 'West', Category: 'Audio', Product: 'ANC Headset', Quarter: 'Q2', 'Units Sold': 190, 'Revenue (₹)': 1520000, 'Profit (₹)': 456000 },
      { Region: 'South', Category: 'Furniture', Product: 'Standing Desk', Quarter: 'Q2', 'Units Sold': 40, 'Revenue (₹)': 1000000, 'Profit (₹)': 300000 },
    ],
  },
  {
    id: 'hr',
    name: 'Global Workforce & Compensation',
    domain: 'Human Resources',
    headers: ['Department', 'Location', 'Gender', 'Base Salary (₹)', 'Bonus (₹)', 'Performance Rating'],
    records: [
      { Department: 'Engineering', Location: 'Bangalore', Gender: 'Female', 'Base Salary (₹)': 1800000, 'Bonus (₹)': 360000, 'Performance Rating': 4.8 },
      { Department: 'Engineering', Location: 'Bangalore', Gender: 'Male', 'Base Salary (₹)': 1650000, 'Bonus (₹)': 330000, 'Performance Rating': 4.5 },
      { Department: 'Engineering', Location: 'Hyderabad', Gender: 'Male', 'Base Salary (₹)': 1500000, 'Bonus (₹)': 300000, 'Performance Rating': 4.2 },
      { Department: 'Sales', Location: 'Mumbai', Gender: 'Female', 'Base Salary (₹)': 1200000, 'Bonus (₹)': 480000, 'Performance Rating': 4.7 },
      { Department: 'Sales', Location: 'Delhi', Gender: 'Male', 'Base Salary (₹)': 1100000, 'Bonus (₹)': 440000, 'Performance Rating': 4.1 },
      { Department: 'Marketing', Location: 'Mumbai', Gender: 'Female', 'Base Salary (₹)': 1350000, 'Bonus (₹)': 270000, 'Performance Rating': 4.6 },
      { Department: 'Marketing', Location: 'Bangalore', Gender: 'Male', 'Base Salary (₹)': 1250000, 'Bonus (₹)': 250000, 'Performance Rating': 4.3 },
      { Department: 'Operations', Location: 'Delhi', Gender: 'Male', 'Base Salary (₹)': 900000, 'Bonus (₹)': 135000, 'Performance Rating': 3.9 },
    ],
  },
];

interface PivotAndChartsSimulatorProps {
  onTryInIde: (dataset: any, formula: string, taskTitle: string) => void;
}

export const PivotAndChartsSimulator: React.FC<PivotAndChartsSimulatorProps> = ({ onTryInIde }) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('retail');
  const [rowField, setRowField] = useState<string>('Region');
  const [colField, setColField] = useState<string>('Category');
  const [valField, setValField] = useState<string>('Revenue (₹)');
  const [aggFunction, setAggFunction] = useState<'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN'>('SUM');
  const [activeSlicerFilter, setActiveSlicerFilter] = useState<string>('All');
  const [chartType, setChartType] = useState<'column' | 'bar' | 'line' | 'donut'>('column');
  const [activeTabMode, setActiveTabMode] = useState<'pivot' | 'chart' | 'both'>('both');

  const activeDataset = SIMULATOR_DATASETS.find((d) => d.id === selectedDatasetId) || SIMULATOR_DATASETS[0];

  // Slicer options from rowField
  const slicerOptions = useMemo(() => {
    const set = new Set<string>();
    activeDataset.records.forEach((r) => {
      if (r[rowField] !== undefined) set.add(String(r[rowField]));
    });
    return ['All', ...Array.from(set)];
  }, [activeDataset, rowField]);

  // Compute Pivot Table Matrix
  const pivotMatrix = useMemo(() => {
    const filteredRecords = activeDataset.records.filter((r) => {
      if (activeSlicerFilter === 'All') return true;
      return String(r[rowField]) === activeSlicerFilter;
    });

    const rowKeys = Array.from(new Set(filteredRecords.map((r) => String(r[rowField] ?? 'Unknown')))).sort();
    const colKeys = Array.from(new Set(filteredRecords.map((r) => String(r[colField] ?? 'Unknown')))).sort();

    // Map: rowKey -> colKey -> numbers[]
    const cellBuckets: { [row: string]: { [col: string]: number[] } } = {};
    const rowTotals: { [row: string]: number[] } = {};
    const colTotals: { [col: string]: number[] } = {};
    const allValues: number[] = [];

    rowKeys.forEach((r) => {
      cellBuckets[r] = {};
      rowTotals[r] = [];
      colKeys.forEach((c) => {
        cellBuckets[r][c] = [];
      });
    });

    colKeys.forEach((c) => {
      colTotals[c] = [];
    });

    filteredRecords.forEach((rec) => {
      const rKey = String(rec[rowField] ?? 'Unknown');
      const cKey = String(rec[colField] ?? 'Unknown');
      const val = typeof rec[valField] === 'number' ? rec[valField] : parseFloat(String(rec[valField] || '0'));
      if (!isNaN(val)) {
        if (!cellBuckets[rKey]) cellBuckets[rKey] = {};
        if (!cellBuckets[rKey][cKey]) cellBuckets[rKey][cKey] = [];
        cellBuckets[rKey][cKey].push(val);
        rowTotals[rKey].push(val);
        colTotals[cKey].push(val);
        allValues.push(val);
      }
    });

    // Helper to aggregate array
    const aggregate = (nums: number[]): number => {
      if (nums.length === 0) return 0;
      switch (aggFunction) {
        case 'SUM':
          return nums.reduce((a, b) => a + b, 0);
        case 'AVERAGE':
          return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
        case 'COUNT':
          return nums.length;
        case 'MAX':
          return Math.max(...nums);
        case 'MIN':
          return Math.min(...nums);
        default:
          return nums.reduce((a, b) => a + b, 0);
      }
    };

    const computedCells: { [row: string]: { [col: string]: number } } = {};
    rowKeys.forEach((r) => {
      computedCells[r] = {};
      colKeys.forEach((c) => {
        computedCells[r][c] = aggregate(cellBuckets[r]?.[c] || []);
      });
    });

    const computedRowTotals: { [row: string]: number } = {};
    rowKeys.forEach((r) => {
      computedRowTotals[r] = aggregate(rowTotals[r] || []);
    });

    const computedColTotals: { [col: string]: number } = {};
    colKeys.forEach((c) => {
      computedColTotals[c] = aggregate(colTotals[c] || []);
    });

    const grandTotal = aggregate(allValues);

    return {
      rowKeys,
      colKeys,
      computedCells,
      computedRowTotals,
      computedColTotals,
      grandTotal,
    };
  }, [activeDataset, rowField, colField, valField, aggFunction, activeSlicerFilter]);

  // Aggregate Data Points for Linked Pivot Chart
  const chartDataPoints = useMemo(() => {
    return pivotMatrix.rowKeys.map((rKey) => {
      const val = pivotMatrix.computedRowTotals[rKey] || 0;
      return {
        label: rKey,
        value: val,
        formatted: val >= 1000 ? `₹${val.toLocaleString()}` : String(val),
      };
    });
  }, [pivotMatrix]);

  const maxChartVal = Math.max(...chartDataPoints.map((d) => d.value), 1);

  const formatNumber = (num: number) => {
    if (valField.includes('₹') || valField.includes('Salary') || valField.includes('Revenue') || valField.includes('Profit')) {
      return `₹${num.toLocaleString()}`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5" />
              MULTI-DIMENSIONAL PIVOT & CHART ENGINE
            </span>
            <span className="text-xs text-gray-400">Dynamic Cross-Tabulation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Pivot Tables & Pivot Charts Simulator</h1>
          <p className="text-sm text-gray-400 mt-1">
            Drag, slice, aggregate, and instantly visualize multi-dimensional datasets with live linked pivot charts.
          </p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-2 bg-[#121422] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTabMode('both')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTabMode === 'both' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Split View (Pivot + Chart)
          </button>
          <button
            onClick={() => setActiveTabMode('pivot')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTabMode === 'pivot' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pivot Table Only
          </button>
          <button
            onClick={() => setActiveTabMode('chart')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeTabMode === 'chart' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pivot Chart Only
          </button>
        </div>
      </div>

      {/* ================= DATASET & PIVOT FIELD SELECTION CONTROL PANEL ================= */}
      <div className="bg-[#0f111a] p-5 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pivot Table Field Builder & Slicers
            </h3>
          </div>

          {/* Dataset switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Dataset:</span>
            {SIMULATOR_DATASETS.map((ds) => (
              <button
                key={ds.id}
                onClick={() => {
                  playClick();
                  setSelectedDatasetId(ds.id);
                  setRowField(ds.headers[0]);
                  setColField(ds.headers[1]);
                  setValField(ds.headers[4] || ds.headers[3]);
                  setActiveSlicerFilter('All');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                  selectedDatasetId === ds.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-[#151724] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {ds.name.split(' ')[0]} ({ds.domain.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Pivot Configuration Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rows Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
              <span>Rows Axis (Hierarchy):</span>
              <span className="text-amber-400 font-bold">Y-Axis</span>
            </label>
            <select
              value={rowField}
              onChange={(e) => {
                playClick();
                setRowField(e.target.value);
                setActiveSlicerFilter('All');
              }}
              className="w-full bg-[#151724] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {activeDataset.headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Columns Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
              <span>Columns Axis:</span>
              <span className="text-blue-400 font-bold">X-Axis</span>
            </label>
            <select
              value={colField}
              onChange={(e) => {
                playClick();
                setColField(e.target.value);
              }}
              className="w-full bg-[#151724] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {activeDataset.headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Values Field Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
              <span>Values (Metric):</span>
              <span className="text-emerald-400 font-bold">Metric Σ</span>
            </label>
            <select
              value={valField}
              onChange={(e) => {
                playClick();
                setValField(e.target.value);
              }}
              className="w-full bg-[#151724] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {activeDataset.headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Aggregation Function Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
              <span>Aggregation Logic:</span>
              <span className="text-amber-400 font-bold">Formula fx</span>
            </label>
            <select
              value={aggFunction}
              onChange={(e) => {
                playClick();
                setAggFunction(e.target.value as any);
              }}
              className="w-full bg-[#151724] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
            >
              <option value="SUM">SUM (Total Aggregate)</option>
              <option value="AVERAGE">AVERAGE (Mean Benchmark)</option>
              <option value="COUNT">COUNT (Frequency)</option>
              <option value="MAX">MAX (Peak Record)</option>
              <option value="MIN">MIN (Trough Record)</option>
            </select>
          </div>
        </div>

        {/* Interactive Slicer Buttons Row */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Interactive Slicer ({rowField}):
          </span>
          {slicerOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                playClick();
                setActiveSlicerFilter(opt);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeSlicerFilter === opt
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-[#151724] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* ================= PIVOT TABLE & LINKED CHART DISPLAY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PIVOT TABLE CONTAINER */}
        {(activeTabMode === 'both' || activeTabMode === 'pivot') && (
          <div
            className={`${
              activeTabMode === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'
            } bg-[#0e1018] rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Multi-Dimensional Pivot Table
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {aggFunction} of {valField}
              </span>
            </div>

            {/* Pivot Table Grid */}
            <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#07080b]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#121422] text-amber-300 border-b border-white/10 font-mono">
                  <tr>
                    <th className="p-3 border-r border-white/10 font-bold bg-[#181a28]">
                      {rowField} \ {colField}
                    </th>
                    {pivotMatrix.colKeys.map((cKey) => (
                      <th key={cKey} className="p-3 border-r border-white/10 text-right">
                        {cKey}
                      </th>
                    ))}
                    <th className="p-3 text-right bg-amber-500/10 text-amber-300 font-black">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pivotMatrix.rowKeys.map((rKey, rIdx) => (
                    <tr key={rIdx} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-3 border-r border-white/10 font-bold text-white bg-[#0f111c] font-sans">
                        {rKey}
                      </td>
                      {pivotMatrix.colKeys.map((cKey) => {
                        const cellVal = pivotMatrix.computedCells[rKey]?.[cKey] || 0;
                        return (
                          <td
                            key={cKey}
                            className={`p-3 border-r border-white/10 font-mono text-right ${
                              cellVal > 0 ? 'text-gray-200' : 'text-gray-600'
                            }`}
                          >
                            {cellVal > 0 ? formatNumber(cellVal) : '—'}
                          </td>
                        );
                      })}
                      {/* Row Total */}
                      <td className="p-3 font-mono text-right font-bold text-amber-300 bg-amber-500/5">
                        {formatNumber(pivotMatrix.computedRowTotals[rKey] || 0)}
                      </td>
                    </tr>
                  ))}
                  {/* Bottom Grand Total Row */}
                  <tr className="bg-amber-500/15 border-t-2 border-amber-500/40 font-bold text-amber-200 font-mono">
                    <td className="p-3 border-r border-white/10 uppercase tracking-wider text-amber-400">
                      Column Grand Total
                    </td>
                    {pivotMatrix.colKeys.map((cKey) => (
                      <td key={cKey} className="p-3 border-r border-white/10 text-right">
                        {formatNumber(pivotMatrix.computedColTotals[cKey] || 0)}
                      </td>
                    ))}
                    <td className="p-3 text-right font-black text-amber-400 text-sm">
                      {formatNumber(pivotMatrix.grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom action to open in simulator */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-gray-400">Dynamic client-side aggregation matrix</span>
              <button
                onClick={() => {
                  playClick();
                  onTryInIde(
                    {
                      headers: [rowField, ...pivotMatrix.colKeys, 'Grand Total'],
                      rows: pivotMatrix.rowKeys.map((r) => [
                        r,
                        ...pivotMatrix.colKeys.map((c) => pivotMatrix.computedCells[r]?.[c] || 0),
                        pivotMatrix.computedRowTotals[r] || 0,
                      ]),
                    },
                    `=SUM(B2:${String.fromCharCode(65 + pivotMatrix.colKeys.length)}2)`,
                    'Pivot Table Summary Analysis'
                  );
                }}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Open Matrix in IDE Simulator</span>
              </button>
            </div>
          </div>
        )}

        {/* LINKED PIVOT CHART CONTAINER */}
        {(activeTabMode === 'both' || activeTabMode === 'chart') && (
          <div
            className={`${
              activeTabMode === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'
            } bg-[#0f111a] rounded-2xl p-5 border border-amber-500/30 space-y-5 shadow-2xl`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Linked Pivot Chart</h3>
              </div>

              {/* Chart Type Selector */}
              <div className="flex items-center gap-1 bg-[#151724] p-1 rounded-xl border border-white/5 text-xs">
                {(['column', 'bar', 'line', 'donut'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      playClick();
                      setChartType(t);
                    }}
                    className={`px-2.5 py-1 rounded font-bold capitalize transition ${
                      chartType === t
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Chart Rendering Canvas / SVG */}
            <div className="bg-[#07080b] p-5 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-semibold text-white">
                  Distribution: {rowField} vs {aggFunction} of {valField}
                </span>
                <span className="font-mono text-amber-400 text-[11px]">
                  Peak: {formatNumber(maxChartVal)}
                </span>
              </div>

              {/* Column Chart Representation */}
              {chartType === 'column' && (
                <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
                  {chartDataPoints.map((pt, i) => {
                    const heightPercent = Math.max(8, Math.round((pt.value / maxChartVal) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <span className="text-[10px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition truncate max-w-full">
                          {pt.formatted}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                        />
                        <span className="text-[10px] text-gray-400 truncate max-w-full text-center">
                          {pt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bar Chart Representation */}
              {chartType === 'bar' && (
                <div className="space-y-3 py-2">
                  {chartDataPoints.map((pt, i) => {
                    const widthPercent = Math.max(6, Math.round((pt.value / maxChartVal) * 100));
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-medium truncate max-w-xs">{pt.label}</span>
                          <span className="font-mono text-amber-300 font-bold">{pt.formatted}</span>
                        </div>
                        <div className="w-full h-3 bg-[#151724] rounded-full overflow-hidden p-0.5">
                          <div
                            style={{ width: `${widthPercent}%` }}
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-300 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Donut Chart Representation */}
              {chartType === 'donut' && (
                <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Donut graphic */}
                  <div className="relative w-36 h-36 rounded-full border-8 border-amber-500/30 flex items-center justify-center shadow-xl bg-[#090b10]">
                    <div className="text-center">
                      <span className="text-[10px] text-gray-500 block">Grand Total</span>
                      <strong className="text-xs font-black text-amber-300 font-mono">
                        {formatNumber(pivotMatrix.grandTotal)}
                      </strong>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5 text-xs">
                    {chartDataPoints.map((pt, i) => {
                      const share = pivotMatrix.grandTotal > 0 ? Math.round((pt.value / pivotMatrix.grandTotal) * 100) : 0;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-gray-300">{pt.label}:</span>
                          <strong className="text-amber-400 font-mono">{share}%</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Line Chart Representation */}
              {chartType === 'line' && (
                <div className="h-60 flex flex-col justify-between py-2">
                  <div className="flex-1 flex items-center justify-between gap-2 px-4 relative">
                    {/* Visual connecting line */}
                    <div className="absolute left-6 right-6 top-1/2 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 opacity-60" />
                    {chartDataPoints.map((pt, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 z-10">
                        <span className="text-[10px] font-mono text-amber-300 bg-black/60 px-1 rounded">
                          {pt.formatted}
                        </span>
                        <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-black shadow-lg" />
                        <span className="text-[10px] text-gray-400 mt-2">{pt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Strategic note */}
            <div className="bg-[#121422] p-3 rounded-xl border border-white/5 text-xs text-gray-400">
              <strong className="text-amber-400">Kapil's Data Storytelling Insight: </strong>
              Pivot Charts connected to Slicers allow C-Suite leaders to explore quarterly divisional variance with zero formula risk.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
