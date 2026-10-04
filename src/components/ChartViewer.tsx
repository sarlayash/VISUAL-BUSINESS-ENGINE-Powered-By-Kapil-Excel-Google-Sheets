import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Layers } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  formatted?: string;
}

interface ChartViewerProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  type?: 'column' | 'bar' | 'line' | 'pie';
}

export const ChartViewer: React.FC<ChartViewerProps> = ({
  title,
  subtitle,
  data,
  type = 'column',
}) => {
  const [activeType, setActiveType] = useState<'column' | 'bar' | 'line' | 'pie'>(type);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="bg-[#0f1118] border border-white/10 rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h4 className="text-white font-semibold text-base tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            {title}
          </h4>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Chart type switchers */}
        <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveType('column')}
            className={`p-1.5 rounded transition ${
              activeType === 'column'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Column Chart"
          >
            <BarChart3 className="w-4 h-4 rotate-90" />
          </button>
          <button
            onClick={() => setActiveType('bar')}
            className={`p-1.5 rounded transition ${
              activeType === 'bar'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveType('line')}
            className={`p-1.5 rounded transition ${
              activeType === 'line'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Trend Line"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveType('pie')}
            className={`p-1.5 rounded transition ${
              activeType === 'pie'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Donut Breakdown"
          >
            <PieChart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render selected chart */}
      <div className="h-56 w-full flex items-end justify-center pt-4">
        {/* COLUMN CHART */}
        {activeType === 'column' && (
          <div className="w-full h-full flex items-end justify-between gap-3 px-2 border-b border-gray-800 pb-2">
            {data.map((item, idx) => {
              const heightPct = Math.max(12, Math.round((item.value / maxValue) * 100));
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip */}
                  <div
                    className={`text-[10px] py-0.5 px-2 rounded bg-black/90 border border-amber-500/40 text-amber-300 font-mono mb-2 transition-all duration-200 shadow-lg ${
                      isHovered ? 'opacity-100 -translate-y-1 scale-105' : 'opacity-0'
                    }`}
                  >
                    {item.formatted || item.value.toLocaleString()}
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-[#222533] rounded-t-md overflow-hidden relative transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full transition-all duration-500 rounded-t-md ${
                        isHovered
                          ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300'
                          : 'bg-gradient-to-t from-amber-600 to-amber-500'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] text-gray-400 mt-2 truncate w-full text-center group-hover:text-amber-300 transition">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* HORIZONTAL BAR CHART */}
        {activeType === 'bar' && (
          <div className="w-full h-full flex flex-col justify-between py-1">
            {data.map((item, idx) => {
              const widthPct = Math.max(8, Math.round((item.value / maxValue) * 100));
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 group cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <span className="text-[11px] text-gray-400 w-24 truncate text-right group-hover:text-amber-300 transition">
                    {item.label}
                  </span>
                  <div className="flex-1 bg-[#1e202c] rounded-r-md h-5 overflow-hidden relative">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full transition-all duration-500 rounded-r-md ${
                        isHovered
                          ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                          : 'bg-gradient-to-r from-amber-700 to-amber-500'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-gray-300 w-20 text-left">
                    {item.formatted || item.value.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* LINE TREND CHART */}
        {activeType === 'line' && (
          <div className="w-full h-full flex flex-col justify-end relative">
            <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="400" y2="40" stroke="#222533" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#222533" strokeDasharray="3,3" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="#222533" strokeDasharray="3,3" />

              {/* Compute SVG Path */}
              {(() => {
                const step = 400 / Math.max(1, data.length - 1);
                const points = data.map((d, i) => {
                  const x = i * step;
                  const y = 140 - (d.value / maxValue) * 110;
                  return { x, y, ...d };
                });

                const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                const areaD = `${pathD} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#goldAreaGrad)" />
                    <path d={pathD} fill="none" stroke="#F59E0B" strokeWidth="3" />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredIdx === i ? 6 : 4}
                        fill="#FFFFFF"
                        stroke="#D97706"
                        strokeWidth="2.5"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Labels below line */}
            <div className="flex justify-between w-full pt-2 border-t border-gray-800">
              {data.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] truncate max-w-[60px] text-center ${
                    hoveredIdx === idx ? 'text-amber-400 font-bold' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DONUT / PIE BREAKDOWN */}
        {activeType === 'pie' && (
          <div className="w-full h-full flex items-center justify-around">
            {/* SVG Donut */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {(() => {
                  let accumulatedPercent = 0;
                  const colors = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

                  return data.map((item, idx) => {
                    const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                    const strokeDasharray = `${pct} ${100 - pct}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += pct;

                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={colors[idx % colors.length]}
                        strokeWidth="16"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        pathLength="100"
                        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                    );
                  });
                })()}
              </svg>
              {/* Inner Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
                <span className="text-xs font-bold text-white font-mono">
                  {totalValue > 1000000 ? `${(totalValue / 1000000).toFixed(1)}M` : totalValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Legend list */}
            <div className="flex flex-col gap-1.5 max-w-[180px]">
              {data.map((item, idx) => {
                const colors = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];
                const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-xs cursor-pointer p-1 rounded transition ${
                      hoveredIdx === idx ? 'bg-white/10 text-white' : 'text-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    />
                    <span className="truncate flex-1">{item.label}</span>
                    <span className="font-mono text-gray-400 text-[10px]">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
