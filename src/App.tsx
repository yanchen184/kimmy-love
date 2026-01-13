import { useState, useEffect, useCallback } from 'react'
import './index.css'

const VERSION = '2.0.0'

// 愛情 13 問 - 對應原網站的馬雅 13 問
const loveQuestions = [
  { id: 1, question: "我們相遇的那一刻是什麼感覺？", answer: "遇見妳的那一刻，整個世界都亮了起來 ✨", emoji: "💫" },
  { id: 2, question: "什麼時候開始確定喜歡上妳？", answer: "當我發現每天都想見到妳的時候 💕", emoji: "💘" },
  { id: 3, question: "我們第一次約會的回憶是？", answer: "福隆的陽光、海風、還有妳的笑容 🏖️", emoji: "🌊" },
  { id: 4, question: "妳最讓我心動的瞬間是？", answer: "每次妳看著我笑的時候 😊", emoji: "💓" },
  { id: 5, question: "我們一起做過最浪漫的事是？", answer: "礁溪的兩天一夜，只有我們兩個 🌙", emoji: "🏨" },
  { id: 6, question: "我最想和妳一起完成的夢想是？", answer: "一起環遊世界，創造更多回憶 🌍", emoji: "✈️" },
  { id: 7, question: "什麼是我們之間最珍貴的東西？", answer: "彼此的信任和無條件的愛 💝", emoji: "💎" },
  { id: 8, question: "我最感謝妳的一件事是？", answer: "謝謝妳一直陪在我身邊，不離不棄 🙏", emoji: "🤝" },
  { id: 9, question: "我們吵架後最快和好的秘訣是？", answer: "因為捨不得讓妳難過太久 🥺", emoji: "🫂" },
  { id: 10, question: "未來我想給妳什麼樣的生活？", answer: "一個充滿愛、笑聲和安全感的家 🏠", emoji: "🏡" },
  { id: 11, question: "如果用一首歌形容我們的愛情？", answer: "是那種聽了會想起妳的情歌 🎵", emoji: "🎶" },
  { id: 12, question: "我對妳說過最真心的話是？", answer: "我愛妳，想和妳一直走下去 💕", emoji: "💌" },
  { id: 13, question: "我如何讓妳知道我有多愛妳？", answer: "用每一天的行動，用這個網站，用一輩子 💕", emoji: "💍" },
]

// 約會紀錄 - 對應 Google Drive 的資料夾
const dateMemories = [
  { date: "2025/08/15", title: "福隆 - 第一次戶外約會", folder: "福隆" },
  { date: "2025/08/20", title: "西門町看電影", folder: "西門町" },
  { date: "2025/08/24", title: "基隆 - 第二次戶外約會", folder: "基隆" },
  { date: "2025/10/03", title: "慶祝 Kimmy 生日 🎂", folder: "生日" },
  { date: "2025/11/01-02", title: "礁溪兩天一夜", folder: "礁溪" },
  { date: "2025/11/15", title: "開車去金瓜石", folder: "金瓜石" },
  { date: "2025/11/21", title: "看電影 - 女孩", folder: "電影" },
  { date: "2025/11/26", title: "桌球 - 一起運動", folder: "桌球" },
  { date: "2025/12/05", title: "吃一蘭 & 送米去看脫口秀", folder: "一蘭" },
  { date: "2025/12/06", title: "碧潭 - 偶像劇的地方", folder: "碧潭" },
  { date: "2025/12/14", title: "圓覺瀑布 - 來去爬山", folder: "爬山" },
]

// 表情符號
const emojis = ['💕', '💖', '💗', '💓', '💝', '🥰', '😍', '🌸', '✨', '⭐', '💐', '🌹']

// 背景滾動圖騰
function MovingTotems() {
  const rows = Array.from({ length: 12 }, (_, i) => i)
  const totemString = emojis.join(' ').repeat(20)

  return (
    <div className="moving-totems">
      {rows.map((i) => (
        <div
          key={i}
          className={`totem-row ${i % 2 === 0 ? 'scroll-right' : 'scroll-left'}`}
          style={{ '--duration': `${35 + (i % 4) * 5}s` } as React.CSSProperties}
        >
          {totemString} {totemString}
        </div>
      ))}
    </div>
  )
}

// Logo 組件 - 三層動畫
function AnimatedLogo() {
  return (
    <div className="relative w-12 h-12">
      {/* 底層 */}
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        💕
      </div>
      {/* 中層 - 旋轉 */}
      <div className="absolute inset-0 flex items-center justify-center text-2xl logo-spin opacity-30">
        ✨
      </div>
      {/* 頂層 */}
      <div className="absolute inset-0 flex items-center justify-center text-xl opacity-50 animate-pulse">
        💫
      </div>
    </div>
  )
}

// 圖騰組件
function Totem({ emoji, delay = 0 }: { emoji: string; delay?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        totem-brutal w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
        text-3xl sm:text-4xl lg:text-5xl
        transition-all duration-300 cursor-pointer
        ${isHovered ? 'animate-wiggle scale-110' : 'animate-float'}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {emoji}
    </div>
  )
}

// 結果卡片組件
function ResultCard({ question, index, total }: { question: typeof loveQuestions[0]; index: number; total: number }) {
  // 檢查是否有對應的照片
  const photoPath = `${import.meta.env.BASE_URL}photos/${String(question.id).padStart(2, '0')}.jpg`
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <div className="section-card max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="bg-[#FF8FAB] text-white px-3 py-1 rounded-full text-sm font-bold border-2 border-black">
          第 {index} 問 / {total}
        </span>
      </div>

      {/* 照片區域 */}
      <div className="mb-4">
        {hasPhoto ? (
          <img
            src={photoPath}
            alt={`回憶 ${question.id}`}
            className="w-full h-48 sm:h-64 object-cover rounded-xl border-2 border-black"
            onError={() => setHasPhoto(false)}
          />
        ) : (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-xl border-2 border-black flex items-center justify-center">
            <span className="text-6xl">{question.emoji}</span>
          </div>
        )}
      </div>

      {/* 問題 */}
      <h3 className="text-lg lg:text-xl font-bold text-gray-700 mb-3">
        {question.question}
      </h3>

      {/* 答案 */}
      <div className="bg-[#FFF8E7] border-2 border-black rounded-xl p-4">
        <p className="text-xl lg:text-2xl font-bold text-gray-800">
          {question.answer}
        </p>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'story' | 'dates' | 'quotes' | 'about'>('home')
  const [birthDate, setBirthDate] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [secretMessage, setSecretMessage] = useState('')
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  // 版本號輸出
  useEffect(() => {
    console.log(`%c💕 Kimmy Love Site v${VERSION} 💕`, 'color: #FF8FAB; font-size: 20px; font-weight: bold;')
    console.log('%c這是專屬於 Kimmy 的網站！', 'color: #FF6B6B; font-size: 14px;')
    console.log('%c彩蛋提示：試試多點幾下中間的愛心！', 'color: #C9B1FF; font-size: 12px;')
  }, [])

  // 點擊愛心
  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    // 閃光效果
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const newSparkle = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setSparkles(prev => [...prev, newSparkle])
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 600)

    // 彩蛋
    if (newCount === 5) setSecretMessage("找到第一個彩蛋！💕")
    else if (newCount === 10) setSecretMessage("這是專屬於妳的秘密訊息 💌")
    else if (newCount === 20) {
      setSecretMessage("我愛妳，Kimmy！永遠愛妳！ 💕")
      triggerHeartExplosion()
    }
  }, [clickCount])

  // 愛心爆發
  const triggerHeartExplosion = () => {
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
    document.body.appendChild(container)

    for (let i = 0; i < 60; i++) {
      const heart = document.createElement('span')
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      heart.style.cssText = `
        position:absolute;
        left:50%;top:50%;
        font-size:${20 + Math.random() * 40}px;
        animation: explode 2s ease-out forwards;
        --x: ${(Math.random() - 0.5) * 1000}px;
        --y: ${(Math.random() - 0.5) * 1000}px;
      `
      container.appendChild(heart)
    }

    setTimeout(() => container.remove(), 2500)
  }

  // 送出結果
  const handleSubmit = () => {
    if (birthDate) {
      setShowResults(true)
      setCurrentQuestionIndex(0)
    }
  }

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < loveQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // 上一題
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // 導航項目
  const navItems = [
    { id: 'home', label: 'Kimmy好可愛', icon: '💕' },
    { id: 'story', label: '看看我們的故事', icon: '📖' },
    { id: 'dates', label: '紀念日', icon: '📅' },
    { id: 'quotes', label: '愛的語錄', icon: '💌' },
    { id: 'about', label: '關於我們', icon: '💑' },
  ] as const

  return (
    <div className="min-h-screen w-full">
      {/* Background */}
      <div className="bg-pattern" />
      <MovingTotems />

      {/* Header */}
      <header className="bg-[#FFD93D] border-b-2 border-black sticky top-0 z-50">
        <nav className="px-4 py-2 lg:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <button onClick={() => { setCurrentPage('home'); setShowResults(false); }} className="flex items-center gap-2">
              <AnimatedLogo />
              <span className="text-xl lg:text-2xl font-black tracking-widest">
                Kimmy 好可愛
              </span>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setShowResults(false); }}
                  className={`px-4 py-2 font-bold rounded-lg transition ${
                    currentPage === item.id ? 'bg-black/20' : 'hover:bg-black/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {/* Mobile menu */}
            <div className="lg:hidden">
              <select
                value={currentPage}
                onChange={(e) => { setCurrentPage(e.target.value as typeof currentPage); setShowResults(false); }}
                className="border-2 border-black rounded-lg px-2 py-1 bg-white"
              >
                {navItems.map(item => (
                  <option key={item.id} value={item.id}>{item.icon} {item.label}</option>
                ))}
              </select>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8 lg:py-12">

        {/* 首頁 */}
        {currentPage === 'home' && (
          <div className="mx-auto max-w-4xl text-center">
            {/* Title */}
            <h1 className="text-[#FFD93D] text-stroke text-5xl sm:text-6xl lg:text-8xl font-black tracking-wider mb-2">
              Kimmy 好可愛
            </h1>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-6">
              用愛情13問來告訴妳有多重要 💕
            </h2>

            {/* Subtitle */}
            <div className="inline-block bg-[#FFD93D] border-2 border-black rounded-lg px-6 py-2 mb-8">
              <span className="text-lg lg:text-xl font-black">看看專屬於妳的愛情圖盤</span>
            </div>

            {/* Date Input */}
            {!showResults && (
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <label className="font-bold text-gray-800">輸入妳的生日</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="date-input w-44"
                />
              </div>
            )}

            {/* Totem Layout */}
            {!showResults && (
              <div className="my-8 lg:my-12">
                <div className="flex justify-center mb-4">
                  <Totem emoji="🥰" delay={0} />
                </div>
                <div className="flex justify-center items-center gap-4 lg:gap-6 mb-4">
                  <Totem emoji="💝" delay={200} />
                  <div className="relative">
                    <button
                      onClick={handleHeartClick}
                      className="totem-brutal w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-4xl sm:text-5xl lg:text-6xl bg-[#FFD93D] cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse-heart"
                    >
                      💕
                    </button>
                    {sparkles.map(sparkle => (
                      <span key={sparkle.id} className="sparkle text-2xl" style={{ left: sparkle.x, top: sparkle.y }}>✨</span>
                    ))}
                  </div>
                  <Totem emoji="💖" delay={200} />
                </div>
                <div className="flex justify-center">
                  <Totem emoji="😍" delay={400} />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {!showResults && (
              <button onClick={handleSubmit} className="btn-brutal bg-[#FFD93D] text-black px-8 py-3 text-lg">
                送出看結果 💕
              </button>
            )}

            {/* Results - 13 Questions */}
            {showResults && (
              <div className="mt-8">
                <ResultCard
                  question={loveQuestions[currentQuestionIndex]}
                  index={currentQuestionIndex + 1}
                  total={loveQuestions.length}
                />

                {/* Navigation */}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="btn-brutal bg-white disabled:opacity-50"
                  >
                    ← 上一題
                  </button>
                  <span className="flex items-center font-bold">
                    {currentQuestionIndex + 1} / {loveQuestions.length}
                  </span>
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === loveQuestions.length - 1}
                    className="btn-brutal bg-[#FFD93D] disabled:opacity-50"
                  >
                    下一題 →
                  </button>
                </div>

                {/* Reset */}
                <button
                  onClick={() => setShowResults(false)}
                  className="btn-brutal bg-white mt-6"
                >
                  重新開始 🔄
                </button>
              </div>
            )}

            {/* Secret Message */}
            {secretMessage && (
              <div className="section-card max-w-md mx-auto mt-6 bg-gradient-to-br from-purple-100 to-pink-100">
                <p className="text-lg font-bold text-purple-800">🎉 彩蛋發現！</p>
                <p className="text-xl mt-2 text-purple-900">{secretMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* 看看我們的故事 */}
        {currentPage === 'story' && (
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[#FFD93D] text-stroke text-4xl lg:text-6xl font-black text-center mb-8">
              看看我們的故事
            </h1>
            <p className="text-center text-gray-600 mb-8">
              透過愛情13問，回顧我們一起走過的日子 💕
            </p>

            <div className="grid gap-6">
              {loveQuestions.map((q, i) => (
                <div key={q.id} className="section-card hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{q.emoji}</span>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">第 {i + 1} 問</p>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{q.question}</h3>
                      <p className="text-gray-600">{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 紀念日 */}
        {currentPage === 'dates' && (
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[#FFD93D] text-stroke text-4xl lg:text-6xl font-black text-center mb-8">
              紀念日 📅
            </h1>
            <p className="text-center text-gray-600 mb-8">
              我們一起創造的美好回憶
            </p>

            <div className="grid gap-4">
              {dateMemories.map((memory, i) => (
                <div key={i} className="section-card hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FFD93D] border-2 border-black rounded-lg px-3 py-2 text-center min-w-[100px]">
                      <p className="font-bold text-sm">{memory.date}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{memory.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 愛的語錄 */}
        {currentPage === 'quotes' && (
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[#FFD93D] text-stroke text-4xl lg:text-6xl font-black text-center mb-8">
              愛的語錄 💌
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              {loveQuestions.map((q) => (
                <div key={q.id} className="section-card text-center hover:scale-105 transition-transform">
                  <span className="text-4xl mb-4 block">{q.emoji}</span>
                  <p className="text-lg font-bold text-gray-800">{q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 關於我們 */}
        {currentPage === 'about' && (
          <div className="mx-auto max-w-4xl">
            <h1 className="text-[#FFD93D] text-stroke text-4xl lg:text-6xl font-black text-center mb-8">
              關於我們 💑
            </h1>

            <div className="section-card mb-6">
              <h3 className="text-2xl font-black text-[#FFD93D] text-stroke mb-4">這個網站是什麼？</h3>
              <p className="text-gray-700 leading-relaxed">
                這是一個專屬於 Kimmy 的網站，靈感來自「人生好難」馬雅曆網站。
                但這裡不談馬雅曆，只談我對妳的愛 💕
              </p>
            </div>

            <div className="section-card mb-6">
              <h3 className="text-2xl font-black text-[#FFD93D] text-stroke mb-4">「愛情13問」可以告訴妳什麼？</h3>
              <p className="text-gray-700 leading-relaxed">
                透過 13 個關於我們愛情的問題，讓妳知道我有多愛妳。
                每一個問題都配上我們的約會照片，回顧我們一起走過的日子。
              </p>
            </div>

            <div className="section-card">
              <h3 className="text-xl font-bold mb-4">如何使用這個網站？</h3>
              <p className="text-gray-700 leading-relaxed">
                在首頁輸入妳的生日，然後點擊「送出看結果」，就可以看到專屬於妳的愛情13問！
                記得多點幾下中間的愛心，會有隱藏彩蛋喔 🥚
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#FFD93D] border-t-2 border-black py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AnimatedLogo />
              <span className="font-black">Kimmy 好可愛</span>
            </div>

            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm mb-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className="hover:underline"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600">
                © 2026 Kimmy 好可愛 . All Rights Reserved.
              </p>
            </div>

            <div className="text-sm text-gray-700">
              v{VERSION} • Made with 💕
            </div>
          </div>
        </div>
      </footer>

      {/* Explosion Animation */}
      <style>{`
        @keyframes explode {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default App
