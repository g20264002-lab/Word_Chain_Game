import React from 'react';
import { GameStats } from '../types';
import { Trophy, Flame, History, Award, Hash, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';

interface GameStatsPanelProps {
  stats: GameStats;
  onSelectWord: (word: string, meaning?: string) => void;
}

export const GameStatsPanel: React.FC<GameStatsPanelProps> = ({
  stats,
  onSelectWord,
}) => {
  return (
    <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
      
      {/* Panel Header */}
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
          게임 실시간 대전 기록
        </h3>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-2 gap-2 text-center">
        
        {/* Streak */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-0.5">
            <Flame className="w-3.5 h-3.5" />
            <span>최고 연승</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {stats.maxStreak}회
          </div>
        </div>

        {/* Total Words Used */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
            <Hash className="w-3.5 h-3.5" />
            <span>누적 단어 수</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {stats.wordsUsedCount}개
          </div>
        </div>

      </div>

      {/* Longest Word Badge */}
      {stats.longestWord && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              이번 판 최장 단어:
            </span>
          </div>
          <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
            '{stats.longestWord}' ({stats.longestWord.length}자)
          </span>
        </div>
      )}

      {/* Used Words Cloud */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
          <div className="flex items-center space-x-1">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>이번 게임 사용된 단어 ({stats.wordHistory.length})</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">클릭시 사전보기</span>
        </div>

        {stats.wordHistory.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 rounded-xl">
            사용된 단어가 아직 없습니다.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            {stats.wordHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playPop();
                  onSelectWord(item.word, item.meaning);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center space-x-1 ${
                  item.sender === 'user'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.word}</span>
                <BookOpen className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
};
