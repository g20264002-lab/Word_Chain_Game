import React, { useEffect, useRef } from 'react';
import { ChatMessage, DifficultyLevel } from '../types';
import { Bot, User, BookOpen, AlertCircle, Info, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface ChatBoardProps {
  messages: ChatMessage[];
  difficulty: DifficultyLevel;
  onSelectWordForMeaning: (word: string, meaning?: string) => void;
  isAiThinking: boolean;
}

export const ChatBoard: React.FC<ChatBoardProps> = ({
  messages,
  difficulty,
  onSelectWordForMeaning,
  isAiThinking,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const getAiAvatarBg = () => {
    switch (difficulty) {
      case 'EASY':
        return 'from-emerald-500 to-teal-600';
      case 'MEDIUM':
        return 'from-indigo-500 to-purple-600';
      case 'HARD':
        return 'from-amber-500 to-orange-600';
      case 'MASTER':
        return 'from-rose-500 to-red-600';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto min-h-[380px] max-h-[520px] flex flex-col space-y-4 shadow-inner">
      {messages.length === 0 ? (
        <div className="my-auto text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            끝말잇기 AI 대전을 시작합니다!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
            상단 난이도를 선택한 후 아래 입력창에 첫 한국어 단어를 입력해보세요. AI가 뜻풀이와 함께 응수합니다!
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                className="flex items-center justify-center space-x-2 my-2 text-center"
              >
                <div className="px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 shadow-xs">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{msg.word || msg.comment}</span>
                </div>
              </div>
            );
          }

          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-white shadow-sm ${
                  isUser
                    ? 'bg-slate-800 dark:bg-slate-700'
                    : `bg-gradient-to-tr ${getAiAvatarBg()}`
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-2xl p-3.5 shadow-xs transition-all ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                  } ${msg.isInvalid ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200' : ''}`}
                >
                  {/* Word Title & Length */}
                  {msg.word && (
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-lg tracking-tight">
                        {msg.word}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isUser
                            ? 'bg-indigo-700 text-indigo-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {msg.word.length}글자
                      </span>
                    </div>
                  )}

                  {/* Word Meaning/Definition Section */}
                  {msg.meaning && (
                    <div
                      onClick={() => {
                        if (msg.word) {
                          sound.playPop();
                          onSelectWordForMeaning(msg.word, msg.meaning);
                        }
                      }}
                      className={`text-xs mt-2.5 p-2.5 rounded-xl transition-all cursor-pointer flex items-start space-x-2 ${
                        isUser
                          ? 'bg-indigo-950/50 hover:bg-indigo-950/70 border border-indigo-400/40 text-indigo-50 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 shadow-xs'
                      }`}
                      title="클릭하여 상세 사전 보기"
                    >
                      <BookOpen className={`w-4 h-4 shrink-0 mt-0.5 ${isUser ? 'text-indigo-200' : 'text-indigo-500 dark:text-indigo-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold mb-0.5 flex items-center gap-1 ${isUser ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          <span>📖 사전 뜻풀이</span>
                          <span className="text-[9px] font-normal opacity-70">(클릭시 전체보기)</span>
                        </div>
                        <p className="line-clamp-2 leading-relaxed font-medium">{msg.meaning}</p>
                      </div>
                    </div>
                  )}

                  {/* Invalid Reason if error */}
                  {msg.isInvalid && msg.invalidReason && (
                    <div className="flex items-center space-x-1.5 mt-2 text-xs text-red-600 dark:text-red-400 font-semibold bg-red-100/80 dark:bg-red-950/60 p-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{msg.invalidReason}</span>
                    </div>
                  )}

                  {/* Witty AI Persona Comment */}
                  {!isUser && msg.comment && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 p-2.5 rounded-xl flex items-start space-x-1.5">
                      <span className="shrink-0 text-sm">💬</span>
                      <span className="leading-relaxed font-semibold">{msg.comment}</span>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })
      )}

      {/* AI Thinking Animation */}
      {isAiThinking && (
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm bg-gradient-to-tr ${getAiAvatarBg()}`}>
            <Bot className="w-5 h-5 animate-spin" />
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              AI 단어 고르는 중...
            </span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
