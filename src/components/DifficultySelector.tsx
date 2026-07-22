import React from 'react';
import { DifficultyLevel } from '../types';
import { Smile, BookOpen, Flame, Crown, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
}

interface DifficultyOption {
  id: DifficultyLevel;
  title: string;
  badge: string;
  desc: string;
  vocab: string;
  icon: React.ReactNode;
  activeBorder: string;
  badgeBg: string;
  badgeTextColor: string;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
}) => {
  const options: DifficultyOption[] = [
    {
      id: 'EASY',
      title: '쉬움 (초급)',
      badge: '기초 어휘',
      desc: '초등 및 일상생활 기초 단어 위주로 진행됩니다.',
      vocab: '나무, 사과, 학교, 나비, 라면...',
      icon: <Smile className="w-5 h-5 text-emerald-500" />,
      activeBorder: 'border-emerald-500 bg-emerald-500/5',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeTextColor: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      id: 'MEDIUM',
      title: '보통 (중급)',
      badge: '표준 어휘',
      desc: '일반 표준 한국어 사전에 등록된 상식 어휘입니다.',
      vocab: '나침반, 자존감, 박학다식, 아지랑이...',
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      activeBorder: 'border-indigo-500 bg-indigo-500/5',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
      badgeTextColor: 'text-indigo-700 dark:text-indigo-400',
    },
    {
      id: 'HARD',
      title: '어려움 (고급)',
      badge: '고난도 어휘',
      desc: '고난도 사자성어, 문학적 어휘, 전문용어가 등장합니다.',
      vocab: '사필귀정, 낙목한천, 사상루각, 가교...',
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      activeBorder: 'border-amber-500 bg-amber-500/5',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeTextColor: 'text-amber-700 dark:text-amber-400',
    },
    {
      id: 'MASTER',
      title: '달인 (고수)',
      badge: '최고 난이도',
      desc: '한방 단어와 끝음절 공략 전략을 적극 활용하는 AI 대전입니다.',
      vocab: '아비규환, 학이시습지, 가화만사성...',
      icon: <Crown className="w-5 h-5 text-rose-500" />,
      activeBorder: 'border-rose-500 bg-rose-500/5',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
      badgeTextColor: 'text-rose-700 dark:text-rose-400',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          AI 대전 난이도 선택 (단어 수준)
        </h2>
        <span className="text-[11px] text-slate-400">
          게임을 진행 중에도 자유롭게 변경할 수 있습니다
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isSelected = currentDifficulty === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => {
                sound.playPop();
                onSelectDifficulty(opt.id);
              }}
              className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `${opt.activeBorder} shadow-md ring-2 ring-indigo-500/30`
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                    {opt.icon}
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {opt.title}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="mb-2">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${opt.badgeBg} ${opt.badgeTextColor}`}>
                  {opt.badge}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug mb-2">
                {opt.desc}
              </p>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                예: {opt.vocab}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
