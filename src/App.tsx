import React, { useState, useEffect } from 'react';
import {
  DifficultyLevel,
  GameRuleOptions,
  ChatMessage,
  GameStats,
  HintItem,
} from './types';
import { Navbar } from './components/Navbar';
import { DifficultySelector } from './components/DifficultySelector';
import { ChatBoard } from './components/ChatBoard';
import { WordInput } from './components/WordInput';
import { RulesModal } from './components/RulesModal';
import { WordDictionaryModal } from './components/WordDictionaryModal';
import { GitHubPagesExportModal } from './components/GitHubPagesExportModal';
import { GameStatsPanel } from './components/GameStatsPanel';
import { sound } from './utils/sound';
import { processClientWordChain, getClientHints } from './utils/clientGameEngine';

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  
  const [rules, setRules] = useState<GameRuleOptions>({
    allowInitialSoundRule: true,
    allowOneShotWords: false,
    wordLengthMode: 'ANY',
    timerSeconds: 0, // 0 = unlimited by default
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [hints, setHints] = useState<HintItem[]>([]);
  const [isRequestingHint, setIsRequestingHint] = useState(false);

  const [selectedWordForMeaning, setSelectedWordForMeaning] = useState<{
    word: string;
    meaning?: string;
  } | null>(null);

  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isGitHubExportModalOpen, setIsGitHubExportModalOpen] = useState(false);

  const [stats, setStats] = useState<GameStats>({
    currentStreak: 0,
    maxStreak: 0,
    wins: 0,
    losses: 0,
    wordsUsedCount: 0,
    longestWord: '',
    wordHistory: [],
  });

  // Calculate the last valid word used in current round
  const lastWord = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.word && !m.isInvalid && m.sender !== 'system') {
        return m.word;
      }
    }
    return '';
  })();

  const historyWords = messages
    .filter((m) => m.word && !m.isInvalid && m.sender !== 'system')
    .map((m) => m.word as string);

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // Submit User Word
  const handleSubmitWord = async (userWord: string) => {
    setHints([]); // reset hints
    setIsAiThinking(true);

    const userMsgId = Date.now().toString();

    let data: any = null;

    try {
      const res = await fetch('/api/wordchain/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWord,
          previousWord: lastWord,
          historyWords,
          difficulty,
          rules,
        }),
      });

      if (res.ok) {
        data = await res.json();
      }
    } catch (err) {
      console.warn('Backend API unavailable, switching to client game engine fallback:', err);
    }

    // Fallback to client-side game engine if API request failed or returned invalid response
    if (!data) {
      data = processClientWordChain(userWord, lastWord, historyWords, difficulty, rules);
    }

    if (!data.valid) {
      sound.playError();
      const invalidMsg: ChatMessage = {
        id: userMsgId,
        sender: 'user',
        word: userWord,
        isInvalid: true,
        invalidReason: data.errorReason || '올바르지 않은 단어입니다.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, invalidMsg]);
      setIsAiThinking(false);
      return;
    }

    // Valid User Turn
    sound.playCorrect();

    const userValidMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      word: data.userWord,
      meaning: data.userWordMeaning,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userValidMsg]);

    // Update Word History Stats
    const newLongest =
      data.userWord.length > stats.longestWord.length
        ? data.userWord
        : stats.longestWord;

    setStats((prev) => ({
      ...prev,
      wordsUsedCount: prev.wordsUsedCount + 1,
      longestWord: newLongest,
      wordHistory: [
        ...prev.wordHistory,
        { word: data.userWord, sender: 'user', timestamp: Date.now(), meaning: data.userWordMeaning },
      ],
    }));

    // Check if AI surrendered
    if (data.giveUp || !data.aiWord) {
      setTimeout(() => {
        sound.playWin();
        setIsAiThinking(false);

        const winSystemMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          word: '항복!',
          comment: data.aiComment || '더 이상 이어받을 단어가 생각나지 않네요! 당신의 승리입니다! 🎉',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, winSystemMsg]);

        setStats((prev) => {
          const nextStreak = prev.currentStreak + 1;
          return {
            ...prev,
            wins: prev.wins + 1,
            currentStreak: nextStreak,
            maxStreak: Math.max(prev.maxStreak, nextStreak),
          };
        });
      }, 600);
      return;
    }

    // AI Turn Success
    setTimeout(() => {
      setIsAiThinking(false);
      sound.playPop();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        word: data.aiWord,
        meaning: data.aiWordMeaning,
        comment: data.aiComment,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      const aiLongest =
        data.aiWord.length > newLongest.length ? data.aiWord : newLongest;

      setStats((prev) => ({
        ...prev,
        wordsUsedCount: prev.wordsUsedCount + 1,
        longestWord: aiLongest,
        wordHistory: [
          ...prev.wordHistory,
          { word: data.aiWord, sender: 'ai', timestamp: Date.now(), meaning: data.aiWordMeaning },
        ],
      }));
    }, 700);
  };

  // Request Hint from AI
  const handleRequestHint = async () => {
    if (!lastWord) return;
    setIsRequestingHint(true);
    const lastChar = lastWord.charAt(lastWord.length - 1);
    try {
      const res = await fetch('/api/wordchain/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSyllable: lastChar,
          allowInitialSoundRule: rules.allowInitialSoundRule,
          historyWords,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hints && data.hints.length > 0) {
          setHints(data.hints);
          return;
        }
      }
    } catch (err) {
      console.warn('Hint API unavailable, using client hints fallback:', err);
    }

    // Fallback to client hints
    const fallbackHints = getClientHints(lastChar, rules.allowInitialSoundRule, historyWords);
    setHints(fallbackHints);
    setIsRequestingHint(false);
  };

  // Surrender
  const handleSurrender = () => {
    sound.playError();
    const systemNotice: ChatMessage = {
      id: Date.now().toString(),
      sender: 'system',
      word: '플레이어가 항복했습니다. AI의 승리!',
      comment: '게임이 종료되었습니다. 새 게임 버튼을 눌러 다시 도전해보세요.',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, systemNotice]);

    setStats((prev) => ({
      ...prev,
      losses: prev.losses + 1,
      currentStreak: 0,
    }));
  };

  // Restart New Game Round
  const handleRestartGame = () => {
    setMessages([]);
    setHints([]);
    setIsAiThinking(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        difficulty={difficulty}
        stats={stats}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenGitHubExport={() => setIsGitHubExportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col space-y-4">
        
        {/* Difficulty Level Selector */}
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelectDifficulty={(newDiff) => setDifficulty(newDiff)}
        />

        {/* Main Dual Grid: Left (Chat & Input), Right (Stats Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          
          {/* Left 2 Columns: Chat Stream & Word Input */}
          <div className="lg:col-span-2 flex flex-col">
            <ChatBoard
              messages={messages}
              difficulty={difficulty}
              onSelectWordForMeaning={(word, meaning) =>
                setSelectedWordForMeaning({ word, meaning })
              }
              isAiThinking={isAiThinking}
            />

            <WordInput
              lastWord={lastWord}
              rules={rules}
              onSubmitWord={handleSubmitWord}
              onRequestHint={handleRequestHint}
              onSurrender={handleSurrender}
              onRestartGame={handleRestartGame}
              isAiThinking={isAiThinking}
              hints={hints}
              isRequestingHint={isRequestingHint}
            />
          </div>

          {/* Right Column: Game Stats & History Cloud */}
          <div className="lg:col-span-1">
            <GameStatsPanel
              stats={stats}
              onSelectWord={(word, meaning) =>
                setSelectedWordForMeaning({ word, meaning })
              }
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
        끝말잇기 AI 챗봇 &copy; 2026. Gemini AI Powered • GitHub Pages 호스팅 지원
      </footer>

      {/* Modals */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        rules={rules}
        onChangeRules={(newRules) => setRules(newRules)}
      />

      <WordDictionaryModal
        word={selectedWordForMeaning?.word || null}
        meaning={selectedWordForMeaning?.meaning}
        onClose={() => setSelectedWordForMeaning(null)}
      />

      <GitHubPagesExportModal
        isOpen={isGitHubExportModalOpen}
        onClose={() => setIsGitHubExportModalOpen(false)}
      />

    </div>
  );
}
