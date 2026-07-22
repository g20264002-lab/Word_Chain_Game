import React, { useState, useEffect } from 'react';
import { GameRuleOptions, HintItem } from '../types';
import { Send, HelpCircle, Flag, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { getValidNextSyllables } from '../utils/koreanUtils';
import { sound } from '../utils/sound';

interface WordInputProps {
  lastWord: string;
  rules: GameRuleOptions;
  onSubmitWord: (word: string) => void;
  onRequestHint: () => void;
  onSurrender: () => void;
  onRestartGame: () => void;
  isAiThinking: boolean;
  hints: HintItem[];
  isRequestingHint: boolean;
}

export const WordInput: React.FC<WordInputProps> = ({
  lastWord,
  rules,
  onSubmitWord,
  onRequestHint,
  onSurrender,
  onRestartGame,
  isAiThinking,
  hints,
  isRequestingHint,
}) => {
  const [inputWord, setInputWord] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(rules.timerSeconds);
  const [showHintPopover, setShowHintPopover] = useState(false);

  const lastChar = lastWord ? lastWord.charAt(lastWord.length - 1) : '';
  const validStarts = getValidNextSyllables(lastChar, rules.allowInitialSoundRule);

  // Timer Effect
  useEffect(() => {
    if (rules.timerSeconds <= 0 || isAiThinking) {
      setTimeLeft(rules.timerSeconds);
      return;
    }

    setTimeLeft(rules.timerSeconds);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sound.playError();
          onSurrender();
          return 0;
        }
        if (prev <= 4) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastWord, rules.timerSeconds, isAiThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim() || isAiThinking) return;
    sound.playPop();
    onSubmitWord(inputWord.trim());
    setInputWord('');
    setShowHintPopover(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mt-4">
      
      {/* Target Syllable & Rule Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            시작해야 하는 글자:
          </span>
          {lastWord ? (
            <div className="flex items-center space-x-1.5">
              {validStarts.map((syl, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-sm animate-pulse"
                >
                  '{syl}'
                </span>
              ))}
              {validStarts.length > 1 && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  (두음법칙 적용)
                </span>
              )}
            </div>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
              원하는 단어로 시작
            </span>
          )}
        </div>

        {/* Turn Timer */}
        {rules.timerSeconds > 0 && (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>남은 시간: {timeLeft}초</span>
          </div>
        )}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center space-x-2">
        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          placeholder={
            lastWord
              ? `'${validStarts.join("' 또는 '")}'(으)로 시작하는 한국어 단어를 입력하세요`
              : '시작할 단어를 입력하세요...'
          }
          disabled={isAiThinking}
          autoFocus
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!inputWord.trim() || isAiThinking}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm text-white transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <span>제출</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Action Utility Buttons (Hint, Surrender, Restart) */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setShowHintPopover(!showHintPopover);
              if (hints.length === 0 && !isRequestingHint) {
                onRequestHint();
              }
            }}
            disabled={!lastWord || isAiThinking}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>힌트 보기</span>
          </button>

          {/* Hint Popover Box */}
          {showHintPopover && (
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl z-30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>단어 힌트 목록</span>
                </span>
                <button
                  onClick={() => setShowHintPopover(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  닫기
                </button>
              </div>

              {isRequestingHint ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  AI가 힌트를 생성하는 중...
                </div>
              ) : hints.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {hints.map((h, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setInputWord(h.word);
                        setShowHintPopover(false);
                      }}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer transition border border-slate-100 dark:border-slate-800"
                    >
                      <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {h.word}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {h.clue}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 text-center py-2">
                  추천 가능한 힌트 단어가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Surrender Button */}
          <button
            type="button"
            onClick={() => {
              sound.playError();
              onSurrender();
            }}
            disabled={!lastWord || isAiThinking}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 font-semibold transition disabled:opacity-50"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>포기하기</span>
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onRestartGame();
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새 게임</span>
          </button>
        </div>
      </div>
    </div>
  );
};
