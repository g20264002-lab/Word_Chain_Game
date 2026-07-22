import React from 'react';
import { GameRuleOptions } from '../types';
import { X, Check, Clock, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: GameRuleOptions;
  onChangeRules: (newRules: GameRuleOptions) => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  rules,
  onChangeRules,
}) => {
  if (!isOpen) return null;

  const handleToggleInitialSound = () => {
    sound.playPop();
    onChangeRules({
      ...rules,
      allowInitialSoundRule: !rules.allowInitialSoundRule,
    });
  };

  const handleToggleOneShot = () => {
    sound.playPop();
    onChangeRules({
      ...rules,
      allowOneShotWords: !rules.allowOneShotWords,
    });
  };

  const handleTimerChange = (seconds: number) => {
    sound.playPop();
    onChangeRules({
      ...rules,
      timerSeconds: seconds,
    });
  };

  const handleWordLengthChange = (mode: GameRuleOptions['wordLengthMode']) => {
    sound.playPop();
    onChangeRules({
      ...rules,
      wordLengthMode: mode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>끝말잇기 세부 규칙 설정</span>
          </h2>
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

        {/* Rules Toggles */}
        <div className="space-y-4">
          
          {/* 1. 두음법칙 (Initial Sound Rule) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                두음법칙 적용
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                '리' → '이', '라' → '나' 등 한글 두음법칙 자동 인정
              </p>
            </div>
            <button
              onClick={handleToggleInitialSound}
              className="text-indigo-600 dark:text-indigo-400"
            >
              {rules.allowInitialSoundRule ? (
                <ToggleRight className="w-8 h-8 text-indigo-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* 2. 한방단어 허용 여부 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                한방단어 허용
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                '기쁨', '지라프' 등 뒤 단어가 없는 한방 단어 인정
              </p>
            </div>
            <button
              onClick={handleToggleOneShot}
              className="text-indigo-600 dark:text-indigo-400"
            >
              {rules.allowOneShotWords ? (
                <ToggleRight className="w-8 h-8 text-indigo-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* 3. 턴 타이머 설정 */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-sm text-slate-800 dark:text-slate-200">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>턴 별 제한 시간</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleTimerChange(sec)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    rules.timerSeconds === sec
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sec === 0 ? '무제한' : `${sec}초`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 글자 수 제약 */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-sm text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>단어 글자 수 규칙</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ANY', label: '제한 없음 (2자 이상)' },
                { id: 'TWO_ONLY', label: '2글자 단어 전용' },
                { id: 'THREE_ONLY', label: '3글자 단어 전용' },
                { id: 'TWO_TO_FOUR', label: '2자 ~ 4자 제한' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleWordLengthChange(m.id as GameRuleOptions['wordLengthMode'])}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border text-center ${
                    rules.wordLengthMode === m.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition"
        >
          설정 저장 및 게임으로 돌아가기
        </button>

      </div>
    </div>
  );
};
