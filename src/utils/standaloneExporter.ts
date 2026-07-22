// Generates a fully standalone single-file HTML/CSS/JS application suitable for GitHub Pages hosting!

export function generateStandaloneHTML(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>끝말잇기 AI 챗봇 (GitHub Pages 호스팅 버전)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
      background-color: #f8fafc;
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between">

  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-4 py-3">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          AI
        </div>
        <div>
          <h1 class="font-bold text-lg text-white leading-none">끝말잇기 AI 챗봇</h1>
          <p class="text-xs text-slate-400 mt-1">GitHub Pages 호스팅 버전</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span id="difficulty-badge" class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          보통 (중급)
        </span>
        <button onclick="toggleSettings()" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
          <i data-lucide="settings" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Game Layout -->
  <main class="max-w-4xl w-full mx-auto p-4 flex-1 flex flex-col md:flex-row gap-4">
    
    <!-- Chat Section -->
    <section class="flex-1 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[500px]">
      
      <!-- Difficulty Tabs -->
      <div class="p-3 border-b border-slate-800 bg-slate-900/50 flex space-x-2 overflow-x-auto text-xs">
        <button onclick="setDifficulty('EASY')" id="btn-easy" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition">
          쉬움 (초급)
        </button>
        <button onclick="setDifficulty('MEDIUM')" id="btn-medium" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium transition shadow">
          보통 (중급)
        </button>
        <button onclick="setDifficulty('HARD')" id="btn-hard" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition">
          어려움 (고급)
        </button>
        <button onclick="setDifficulty('MASTER')" id="btn-master" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition">
          달인 (고수)
        </button>
      </div>

      <!-- Messages Log -->
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4">
        <!-- System Welcome -->
        <div class="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3 text-xs text-indigo-300 leading-relaxed">
          👋 안녕하세요! 끝말잇기 AI 대전 상댓입니다.<br>
          어떤 단어로 시작하시겠어요? 첫 단어를 자유롭게 입력해 보세요!
        </div>
      </div>

      <!-- Turn Input Controls -->
      <div class="p-3 border-t border-slate-800 bg-slate-900/80">
        <div id="target-prompt" class="mb-2 text-xs text-indigo-400 font-medium flex items-center justify-between">
          <span>제출할 단어 입력:</span>
          <span id="timer-display" class="text-amber-400 font-bold"></span>
        </div>
        <form onsubmit="handleWordSubmit(event)" class="flex space-x-2">
          <input type="text" id="word-input" placeholder="단어를 입력하세요..." autocomplete="off"
            class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500">
          <button type="submit" class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white transition flex items-center space-x-1 shadow-lg shadow-indigo-600/30">
            <span>제출</span>
          </button>
        </form>
      </div>
    </section>

    <!-- Sidebar Stats -->
    <aside class="w-full md:w-64 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 text-xs">
      <h3 class="font-bold text-slate-200 border-b border-slate-800 pb-2">게임 현황</h3>
      
      <div class="grid grid-cols-2 gap-2 text-center">
        <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div class="text-slate-400 text-[10px]">연승 수</div>
          <div id="stat-streak" class="text-lg font-bold text-amber-400">0회</div>
        </div>
        <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div class="text-slate-400 text-[10px]">사용 단어</div>
          <div id="stat-count" class="text-lg font-bold text-indigo-400">0개</div>
        </div>
      </div>

      <div>
        <div class="text-slate-400 mb-1.5 font-medium">사용한 단어 목록:</div>
        <div id="word-cloud" class="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-2 bg-slate-900/50 rounded-xl border border-slate-800/50">
          <span class="text-slate-500 italic">아직 없음</span>
        </div>
      </div>
    </aside>
  </main>

  <script>
    // Embedded Korean Fallback Dictionary
    const DICT = {
      '가': [{w:'가방',m:'물건을 넣어 들거나 어깨에 메는 구용구'}, {w:'가을',m:'여름과 겨울 사이의 계절'}, {w:'가수',m:'노래 부르는 것을 직업으로 하는 사람'}],
      '나': [{w:'나무',m:'줄기나 가지가 목질로 된 다년생 식물'}, {w:'나비',m:'나비목 곤충의 총칭'}, {w:'나팔',m:'금관 악기'}],
      '다': [{w:'다람쥐',m:'조그마한 산림 포유류'}, {w:'다리',m:'몸통 아래 구조물 또는 두 지점을 잇는 다리'}, {w:'단풍',m:'가을 나뭇잎 변색'}],
      '라': [{w:'라면',m:'유탕 처리한 간편 국수'}, {w:'라디오',m:'음성 수신 방송 매체'}, {w:'라이벌',m:'경쟁 상대'}],
      '마': [{w:'마음',m:'생각과 감정이 일어나는 곳'}, {w:'마늘',m:'강한 향과 매운맛 양념'}, {w:'마을',m:'작은 동네'}],
      '바': [{w:'바다',m:'지구 표면의 소금물 영역'}, {w:'바나나',m:'열대 달콤한 과일'}, {w:'바람',m:'공기의 이동'}],
      '사': [{w:'사과',m:'사과나무의 열매'}, {w:'사자',m:'백수의 왕 대형 고양이과'}, {w:'사랑',m:'깊이 아끼는 마음'}],
      '아': [{w:'아침',m:'해 뜬 후 낮 전의 시간'}, {w:'아이',m:'나이 어린 사람'}, {w:'아이스크림',m:'시원한 우유 얼음 과자'}],
      '자': [{w:'자동차',m:'바퀴 굴려 이동하는 교통수단'}, {w:'자전거',m:'페달을 굴리는 이륜차'}, {w:'자유',m:'구속이 없는 상태'}],
      '차': [{w:'차가운',m:'온도가 낮은 상태'}, {w:'창문',m:'채광 환기용 벽 구멍'}, {w:'차표',m:'승차권'}],
      '카': [{w:'카메라',m:'사진 촬영 기기'}, {w:'카레',m:'향신료 커리 요리'}, {w:'카드',m:'직사각형 판'}],
      '타': [{w:'타조',m:'세계에서 가장 큰 날지 못하는 새'}, {w:'타악기',m:'두드려 소리내는 악기'}],
      '파': [{w:'파도',m:'바다의 물결'}, {w:'파랑',m:'하늘색'}, {w:'파이프',m:'관'}],
      '하': [{w:'하늘',m:'지표면 위 무한 공간'}, {w:'학교',m:'가르치고 배우는 기관'}]
    };

    let currentDifficulty = 'MEDIUM';
    let previousWord = '';
    let historyWords = [];
    let streak = 0;

    function setDifficulty(diff) {
      currentDifficulty = diff;
      document.querySelectorAll('[id^="btn-"]').forEach(btn => {
        btn.className = 'px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition';
      });
      document.getElementById('btn-' + diff.toLowerCase()).className = 'px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium transition shadow';
      
      const badge = document.getElementById('difficulty-badge');
      const names = { EASY: '쉬움 (초급)', MEDIUM: '보통 (중급)', HARD: '어려움 (고급)', MASTER: '달인 (고수)' };
      badge.textContent = names[diff];
    }

    function appendMessage(sender, word, meaning, comment) {
      const container = document.getElementById('chat-messages');
      const div = document.createElement('div');
      
      if (sender === 'user') {
        div.className = 'flex justify-end';
        div.innerHTML = \`
          <div class="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%] shadow">
            <div class="font-bold text-base">\${word}</div>
            \${meaning ? \`<div class="text-[11px] text-indigo-200 mt-0.5">\${meaning}</div>\` : ''}
          </div>
        \`;
      } else {
        div.className = 'flex justify-start';
        div.innerHTML = \`
          <div class="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[80%] shadow">
            <div class="font-bold text-base text-emerald-400">\${word}</div>
            \${meaning ? \`<div class="text-[11px] text-slate-400 mt-0.5">\${meaning}</div>\` : ''}
            \${comment ? \`<div class="text-xs text-indigo-300 mt-1 font-medium bg-slate-950/60 p-2 rounded-lg border border-slate-800">\${comment}</div>\` : ''}
          </div>
        \`;
      }

      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function handleWordSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('word-input');
      const val = input.value.trim();
      if (!val) return;

      if (historyWords.includes(val)) {
        alert('이미 사용된 단어입니다!');
        return;
      }

      if (previousWord) {
        const lastChar = previousWord.slice(-1);
        if (val.charAt(0) !== lastChar) {
          alert("'" + lastChar + "'(으)로 시작해야 합니다!");
          return;
        }
      }

      input.value = '';
      appendMessage('user', val, '유저 입력 단어');
      historyWords.push(val);
      previousWord = val;

      // Local AI response selection
      const aiStartChar = val.slice(-1);
      let candidates = DICT[aiStartChar] || [];
      candidates = candidates.filter(c => !historyWords.includes(c.w));

      if (candidates.length === 0) {
        const fallback = getFallbackWord(aiStartChar);
        if (fallback) {
          candidates = [fallback];
        }
      }

      setTimeout(() => {
        if (candidates.length === 0) {
          appendMessage('ai', '항복!', '', '더 이상 이을 단어가 없네요! 당신의 승리입니다! 🎉');
          streak++;
          document.getElementById('stat-streak').textContent = streak + '회';
        } else {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          const standaloneComments = [
            "오호! 센스 있는 단어 선택입니다. 바로 받아쳐 보죠!",
            "탁월한 어휘 공격이군요! 제 다음 단어는 이겁니다.",
            "자연스러운 흐름이군요! 받아치는 재미가 쏠쏠합니다.",
            "허점을 노린 단어인가요? 하지만 저에겐 통하지 않습니다!",
            "올~ 꽤 깊은 고민 끝에 나온 단어 같군요! 제 다음 수입니다.",
            "팽팽한 신경전이 느껴지네요! 다음 단어로 기세를 이어갑니다."
          ];
          const comment = standaloneComments[Math.floor(Math.random() * standaloneComments.length)];
          appendMessage('ai', chosen.w, chosen.m, comment);
          historyWords.push(chosen.w);
          previousWord = chosen.w;
        }

        document.getElementById('stat-count').textContent = historyWords.length + '개';
        const cloud = document.getElementById('word-cloud');
        cloud.innerHTML = historyWords.map(w => \`<span class="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">\${w}</span>\`).join('');
      }, 500);
    }

    lucide.createIcons();
  </script>
</body>
</html>
`;
}
