import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Challenge } from '../types';
import { playClick, playHintSound } from '../utils/soundEffects';

interface KapilAiMentorModalProps {
  challenge?: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyFormulaSuggestion?: (formula: string) => void;
}

interface Message {
  id: string;
  sender: 'kapil' | 'learner';
  text: string;
  time: string;
  formulaSample?: string;
}

export const KapilAiMentorModal: React.FC<KapilAiMentorModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onApplyFormulaSuggestion,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'kapil',
      text: `Hello! I'm Kapil, your Business Analytics Mentor at SarlaYash Mission. Remember our golden rule: 10% Concept + 90% Hands-On. Don't memorize functions—ask yourself what decision the business manager needs to make! How can I guide you on this simulation?`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    playClick();

    const learnerMsg: Message = {
      id: String(Date.now()),
      sender: 'learner',
      text: input,
      time: 'Just now',
    };

    const userText = input.toLowerCase();
    setInput('');

    // Generate smart Socratic response based on query and current challenge
    setTimeout(() => {
      playHintSound();
      let reply = '';
      let sample = undefined;

      if (userText.includes('which function') || userText.includes('how to solve') || userText.includes('help')) {
        if (challenge?.validationRules[0]?.expectedFormulaKeywords?.includes('VLOOKUP')) {
          reply = `Look at the business requirement: we need to pull pricing automatically without manual search. Think about VLOOKUP: 1) What unique key are you looking up? 2) Where is the catalog table? 3) Which column holds the price?`;
          sample = challenge.excelFormula;
        } else if (challenge?.validationRules[0]?.expectedFormulaKeywords?.includes('SUM')) {
          reply = `Start by identifying your aggregation boundaries. For totals, use =SUM(start_cell:end_cell). Notice how clean ranges keep the financial model maintainable.`;
          sample = challenge.excelFormula;
        } else if (challenge?.validationRules[0]?.expectedFormulaKeywords?.includes('IF')) {
          reply = `Deconstruct the business condition: 1) What is the threshold (e.g. > 200,000)? 2) What is the reward if TRUE? 3) What is the fallback if FALSE? Combine them with =IF(condition, if_true, if_false).`;
          sample = challenge.excelFormula;
        } else {
          reply = `Break down the problem into: 1. Input cells 2. Mathematical logic 3. Expected business deliverable. Check the formula bar and test with sample numbers first!`;
        }
      } else if (userText.includes('google sheets') || userText.includes('difference')) {
        reply = `In Google Sheets, functions like SUM and IF work identically! However, Sheets features powerful native array engines like =ARRAYFORMULA() and =FILTER(). In this platform, your formulas are evaluated tool-independently!`;
        sample = challenge?.googleSheetsFormula;
      } else if (userText.includes('hint') || userText.includes('stuck')) {
        reply = challenge?.hints[1]?.text || 'Try verifying your cell coordinates and ensure formula starts with an equal sign (=).';
      } else {
        reply = `Excellent analytical question. In business reporting, always verify if your output matches management expectations. Test the formula in the target cell and click "Validate Result"!`;
      }

      setMessages((prev) => [
        ...prev,
        learnerMsg,
        {
          id: String(Date.now() + 1),
          sender: 'kapil',
          text: reply,
          formulaSample: sample,
          time: 'Just now',
        },
      ]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0e1017] border border-amber-500/40 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[560px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#171924] to-[#12131b] border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg text-black font-bold text-lg">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-base">Kapil AI Business Mentor</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium">SarlaYash 10% Concept + 90% Hands-On Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge context banner */}
        {challenge && (
          <div className="bg-[#141622] px-4 py-2 border-b border-white/5 flex items-center gap-2 text-xs text-gray-300">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              Active Case: <strong className="text-amber-300">{challenge.title}</strong>
            </span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'learner' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.sender === 'learner'
                    ? 'bg-amber-500 text-black font-medium rounded-tr-none'
                    : 'bg-[#191c28] text-gray-200 border border-white/10 rounded-tl-none'
                }`}
              >
                {m.text}

                {m.formulaSample && (
                  <div className="mt-2.5 pt-2 border-t border-white/10">
                    <p className="text-[11px] text-amber-400 font-semibold mb-1">Recommended Structure:</p>
                    <div className="flex items-center justify-between gap-2 bg-black/60 p-2 rounded border border-amber-500/30 font-mono text-xs text-amber-200">
                      <code>{m.formulaSample}</code>
                      {onApplyFormulaSuggestion && (
                        <button
                          onClick={() => {
                            playClick();
                            onApplyFormulaSuggestion(m.formulaSample!);
                            onClose();
                          }}
                          className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold rounded transition"
                        >
                          Use in Cell
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-1.5 bg-[#0b0c12] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            'Which function should I use?',
            'What is the Google Sheets way?',
            'How do I test my formula?',
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(promptText);
              }}
              className="text-[11px] px-2.5 py-1 bg-[#161824] hover:bg-white/10 text-gray-300 rounded-full border border-white/5 whitespace-nowrap transition"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#11131c] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kapil about business logic, formulas, or syntax..."
            className="flex-1 bg-[#1a1d29] text-white placeholder-gray-500 text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400 transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold transition active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
