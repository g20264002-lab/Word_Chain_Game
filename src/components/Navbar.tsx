import React from 'react';
import { Volume2, VolumeX, Settings, Github, Sparkles, Trophy, Flame } from 'lucide-react';
import { DifficultyLevel, GameStats } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  difficulty: DifficultyLevel;
  stats: GameStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onOpenGitHubExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  difficulty,
  stats,
  soundEnabled,
  onToggleSound,
  onOpenRules,
  onOpenGitHubExport,
}) => {
  const getDifficultyBadge = () => {
    switch (difficulty) {
      case 'EASY':
        return { label: '쉬움 (초급)', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' };
      case 'MEDIUM':
        return { label: '보통 (중급)', cls: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' };
      case 'HARD':
        return { label: '어려움 (고급)', cls: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
      case 'MASTER':
        return { label: '달인 (고수)', cls: 'bg-rose-500/10 text-rose-600 border-rose-500/30' };
    }
  };

  const badge = getDifficultyBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-none">
                끝말잇기 AI
              </h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              지능형 한국어 대전 AI & 난이도별 어휘 학습
            </p>
          </div>
        </div>

        {/* Stats & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Streak Counter */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{stats.currentStreak}연승</span>
          </div>

          {/* Win Stats */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs">
            <Trophy className="w-3.5 h-3.5 text-indigo-500" />
            <span>전적: {stats.wins}승 {stats.losses}패</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleSound();
            }}
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Settings / Rules Modal Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenRules();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">규칙 설정</span>
          </button>

          {/* GitHub Pages Deploy Guide Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenGitHubExport();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shadow-indigo-600/20"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Pages</span>
          </button>

        </div>
      </div>
    </header>
  );
};
