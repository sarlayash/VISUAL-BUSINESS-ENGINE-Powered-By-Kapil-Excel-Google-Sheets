import React from 'react';
import { Sparkles, CornerDownLeft, Delete } from 'lucide-react';
import { playClick } from '../utils/soundEffects';

interface FormulaKeypadMobileProps {
  onInsertText: (token: string) => void;
  onSubmit: () => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const FormulaKeypadMobile: React.FC<FormulaKeypadMobileProps> = ({
  onInsertText,
  onSubmit,
  onBackspace,
  onClear,
}) => {
  const quickFormulas = ['SUM', 'AVERAGE', 'IF', 'VLOOKUP', 'XLOOKUP', 'COUNT', 'MAX', 'MIN'];
  const quickOperators = ['=', '+', '-', '*', '/', ':', '(', ')', ',', '"', '$', '%'];

  const handlePress = (token: string) => {
    playClick();
    onInsertText(token);
  };

  return (
    <div className="bg-[#0b0c13] border-t border-amber-500/20 p-2.5 flex flex-col gap-2 shadow-2xl md:hidden">
      {/* Top quick functions carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] text-amber-400 font-semibold uppercase px-1.5 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3" /> Quick fx:
        </span>
        {quickFormulas.map((fn) => (
          <button
            key={fn}
            onClick={() => handlePress(`=${fn}(`)}
            className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#1a1d2b] hover:bg-amber-500/20 text-gray-200 hover:text-amber-300 rounded border border-white/10 shrink-0 transition"
          >
            ={fn}
          </button>
        ))}
      </div>

      {/* Symbol keypad & actions */}
      <div className="grid grid-cols-8 gap-1.5">
        {quickOperators.map((op) => (
          <button
            key={op}
            onClick={() => handlePress(op)}
            className="h-9 flex items-center justify-center font-mono font-bold text-sm bg-[#161824] hover:bg-amber-500/20 text-amber-200 border border-white/5 rounded active:scale-95 transition"
          >
            {op}
          </button>
        ))}
        {/* Backspace */}
        <button
          onClick={() => {
            playClick();
            onBackspace();
          }}
          className="h-9 flex items-center justify-center bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded active:scale-95 transition"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
        {/* Submit Enter */}
        <button
          onClick={() => {
            playClick();
            onSubmit();
          }}
          className="h-9 col-span-3 flex items-center justify-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded shadow-md active:scale-95 transition"
        >
          <CornerDownLeft className="w-4 h-4" /> Apply Formula
        </button>
      </div>
    </div>
  );
};
