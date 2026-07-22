import React, { useState } from 'react';
import { X, Github, Download, Check, ExternalLink, Code, Layers } from 'lucide-react';
import { generateStandaloneHTML } from '../utils/standaloneExporter';
import { sound } from '../utils/sound';

interface GitHubPagesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesExportModal: React.FC<GitHubPagesExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadStandaloneHTML = () => {
    sound.playPop();
    const htmlContent = generateStandaloneHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const gitCommands = `git init
git add .
git commit -m "Deploy Word Chain AI to GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/word-chain-ai.git
git push -u origin main`;

  const handleCopyGitCommands = () => {
    sound.playPop();
    navigator.clipboard.writeText(gitCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                GitHub Pages 배포 & 익스포트 안내
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                무료 GitHub Pages에 내 끝말잇기 AI 챗봇을 호스팅하세요
              </p>
            </div>
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

        {/* Option 1: Download Standalone HTML */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sm text-indigo-900 dark:text-indigo-200">
              방법 1: 단일 `index.html` 파일로 내보내기 (추천)
            </span>
          </div>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
            빌드나 복잡한 설정 없이, 클릭 한 번으로 모든 기능(난이도 조절, 사전, 타이머)이 포함된 독립 실행형 <strong>index.html</strong> 파일을 다운로드할 수 있습니다.
          </p>
          <button
            onClick={handleDownloadStandaloneHTML}
            className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>독립 실행형 index.html 다운로드</span>
          </button>
        </div>

        {/* Option 2: Full Repository Deploy Step-by-Step */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-800 dark:text-slate-200">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>방법 2: GitHub 저장소 배포 단계별 안내</span>
          </div>

          <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <li>
              <strong>GitHub</strong> 접속 후 새 레포지토리(<code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">word-chain-ai</code>) 생성
            </li>
            <li>
              다운로드받은 <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">index.html</code> 파일 또는 빌드 산출물을 해당 레포지토리에 올리기
            </li>
            <li>
              레포지토리의 <strong>Settings → Pages</strong> 메뉴 이동
            </li>
            <li>
              <strong>Build and deployment</strong>의 Source를 <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Deploy from a branch</code>로 설정 후 <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">main / (root)</code> 선택 후 Save!
            </li>
            <li>
              1~2분 후 <code className="text-indigo-600 dark:text-indigo-400 font-bold">https://username.github.io/word-chain-ai</code> 주소로 웹 앱 무료 공개 완료!
            </li>
          </ol>

          {/* Code Snippet */}
          <div className="relative bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto">
            <pre>{gitCommands}</pre>
            <button
              onClick={handleCopyGitCommands}
              className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
              <span>{copied ? '복사됨!' : '명령어 복사'}</span>
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
        >
          닫기
        </button>

      </div>
    </div>
  );
};
