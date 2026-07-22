import React from 'react';
import { BookOpen, X, Sparkles, ExternalLink } from 'lucide-react';
import { sound } from '../utils/sound';

interface WordDictionaryModalProps {
  word: string | null;
  meaning?: string;
  onClose: () => void;
}

export const WordDictionaryModal: React.FC<WordDictionaryModalProps> = ({
  word,
  meaning,
  onClose,
}) => {
  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              한국어 사전 정보
            </span>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display */}
        <div className="text-center py-2">
          <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mb-1">
            {word}
          </h2>
          <span className="text-xs text-slate-400">
            {word.length}글자 표준어
          </span>
        </div>

        {/* Definition Box */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
          <div className="font-bold mb-1 text-indigo-500">뜻풀이:</div>
          <p>{meaning || '표준 한국어 대중 어휘입니다.'}</p>
        </div>

        {/* External Link to Naver / Daum Dictionary */}
        <a
          href={`https://ko.dict.naver.com/#/search?query=${encodeURIComponent(word)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-1.5 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
        >
          <span>네이버 국어사전에서 상세보기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

      </div>
    </div>
  );
};
