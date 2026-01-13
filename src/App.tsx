import { useState, useEffect, useCallback } from 'react'
import './index.css'

const VERSION = '1.1.0'

// 愛的語錄
const loveQuotes = [
  "Kimmy 是世界上最可愛的人 💕",
  "遇見妳是我最大的幸運 ✨",
  "每一天有妳都是最美好的日子 🌸",
  "妳的笑容是我最愛的風景 😊",
  "愛妳的心永遠不會改變 💖",
  "妳就是我的全世界 🌍",
  "謝謝妳一直陪在我身邊 🙏",
  "有妳在的地方就是家 🏠",
]

// 彩蛋訊息
const secretMessages = [
  { count: 5, msg: "找到第一個彩蛋！妳真的好棒！ 🎉" },
  { count: 10, msg: "這是專屬於妳的秘密訊息 💌" },
  { count: 20, msg: "我愛妳，Kimmy！永遠愛妳！ 💕" },
]

// 圖騰表情
const totems = ['💕', '💖', '💗', '💓', '💝', '🥰', '😍', '🌸', '✨', '⭐', '💐', '🌹']

// 背景滾動圖騰
function MovingTotems() {
  const rows = Array.from({ length: 12 }, (_, i) => i)
  const totemString = totems.join(' ').repeat(20)

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

// Logo 組件
function AnimatedLogo() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        💕
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-2xl logo-spin opacity-30">
        ✨
      </div>
    </div>
  )
}

// 圖騰組件
function Totem({ emoji, delay = 0, size = 'normal' }: { emoji: string; delay?: number; size?: 'normal' | 'large' }) {
  const [isHovered, setIsHovered] = useState(false)
  const sizeClasses = size === 'large'
    ? 'w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-4xl sm:text-5xl lg:text-6xl'
    : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-3xl sm:text-4xl lg:text-5xl'

  return (
    <div
      className={`
        totem-brutal ${sizeClasses}
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

function App() {
  const [birthDate, setBirthDate] = useState('')
  const [clickCount, setClickCount] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(loveQuotes[0])
  const [showResult, setShowResult] = useState(false)
  const [secretMessage, setSecretMessage] = useState('')
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  // 版本號輸出
  useEffect(() => {
    console.log(`%c💕 Kimmy Love Site v${VERSION} 💕`, 'color: #FF8FAB; font-size: 20px; font-weight: bold;')
    console.log('%c這是專屬於 Kimmy 的網站！', 'color: #FF6B6B; font-size: 14px;')
    console.log('%c彩蛋提示：試試多點幾下中間的愛心！', 'color: #C9B1FF; font-size: 12px;')
  }, [])

  // 隨機語錄
  const changeQuote = useCallback(() => {
    const newQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)]
    setCurrentQuote(newQuote)
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

    // 檢查彩蛋
    const secret = secretMessages.find(s => s.count === newCount)
    if (secret) {
      setSecretMessage(secret.msg)
      if (newCount === 20) {
        triggerHeartExplosion()
      }
    }

    changeQuote()
  }, [clickCount, changeQuote])

  // 愛心爆發
  const triggerHeartExplosion = () => {
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
    document.body.appendChild(container)

    for (let i = 0; i < 60; i++) {
      const heart = document.createElement('span')
      heart.textContent = totems[Math.floor(Math.random() * totems.length)]
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
      setShowResult(true)
      changeQuote()
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Background */}
      <div className="bg-pattern" />
      <MovingTotems />

      {/* Header */}
      <header className="bg-[#FFD93D] border-b-2 border-black">
        <nav className="px-4 py-2 lg:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <AnimatedLogo />
              <span className="text-xl lg:text-2xl font-black tracking-widest">
                Kimmy 好可愛
              </span>
            </a>
            <div className="hidden lg:flex items-center gap-4">
              <a href="#" className="px-4 py-2 font-bold hover:bg-black/10 rounded-lg transition">首頁</a>
              <a href="#about" className="px-4 py-2 font-bold hover:bg-black/10 rounded-lg transition">關於</a>
              <a href="#love" className="px-4 py-2 font-bold hover:bg-black/10 rounded-lg transition">愛的語錄</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">

          {/* Title */}
          <h1 className="text-[#FFD93D] text-stroke text-5xl sm:text-6xl lg:text-8xl font-black tracking-wider mb-2">
            Kimmy 好可愛
          </h1>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-6">
            用愛來告訴妳有多重要 💕
          </h2>

          {/* Subtitle with highlight */}
          <div className="inline-block bg-[#FFD93D] border-2 border-black rounded-lg px-6 py-2 mb-8">
            <span className="text-lg lg:text-xl font-black">看看專屬於妳的愛心圖盤</span>
          </div>

          {/* Date Input Section */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <label className="font-bold text-gray-800">輸入妳的生日</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="date-input w-44"
            />
          </div>

          {/* Totem Layout - Cross Pattern */}
          <div className="my-8 lg:my-12">
            {/* Top */}
            <div className="flex justify-center mb-4">
              <Totem emoji="🥰" delay={0} />
            </div>

            {/* Middle Row */}
            <div className="flex justify-center items-center gap-4 lg:gap-6 mb-4">
              <Totem emoji="💝" delay={200} />

              {/* Center Heart - Main Interactive */}
              <div className="relative">
                <button
                  onClick={handleHeartClick}
                  className={`
                    totem-brutal w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
                    text-4xl sm:text-5xl lg:text-6xl
                    bg-[#FFD93D] cursor-pointer
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    animate-pulse-heart
                  `}
                >
                  💕
                </button>
                {sparkles.map(sparkle => (
                  <span
                    key={sparkle.id}
                    className="sparkle text-2xl"
                    style={{ left: sparkle.x, top: sparkle.y }}
                  >
                    ✨
                  </span>
                ))}
              </div>

              <Totem emoji="💖" delay={200} />
            </div>

            {/* Bottom */}
            <div className="flex justify-center">
              <Totem emoji="😍" delay={400} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="btn-brutal bg-[#FFD93D] text-black px-8 py-3 text-lg"
          >
            送出看結果 💕
          </button>

          {/* Result Section */}
          {showResult && (
            <div className="section-card max-w-2xl mx-auto mt-8 animate-float">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="bg-[#FF8FAB] text-white px-3 py-1 rounded-full text-sm font-bold border-2 border-black">
                  第 1 題
                </span>
              </div>
              <div className="text-5xl mb-4">💕</div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
                {currentQuote}
              </h3>
              <button
                onClick={changeQuote}
                className="btn-brutal bg-[#FFD93D] mt-4"
              >
                換一句 ✨
              </button>
            </div>
          )}

          {/* Secret Message */}
          {secretMessage && (
            <div className="section-card max-w-2xl mx-auto mt-6 bg-gradient-to-br from-purple-100 to-pink-100">
              <p className="text-lg font-bold text-purple-800">🎉 彩蛋發現！</p>
              <p className="text-xl mt-2 text-purple-900">{secretMessage}</p>
              <p className="text-sm text-gray-500 mt-2">已點擊 {clickCount} 次</p>
            </div>
          )}
        </div>

        {/* Info Sections */}
        <div className="max-w-4xl mx-auto mt-12" id="about">
          <div className="section-card">
            <h3 className="text-2xl font-black text-[#FFD93D] text-stroke mb-4">
              這個網站是什麼？
            </h3>
            <p className="text-gray-700 leading-relaxed">
              這是一個專屬於 Kimmy 的網站，充滿了愛與驚喜。每一個設計、每一個動畫，都是為了讓妳知道妳有多重要。
              這裡有愛的語錄、有趣的互動，還有隱藏的彩蛋等著妳發現！
            </p>
          </div>

          <div className="section-card" id="love">
            <h3 className="text-2xl font-black text-[#FFD93D] text-stroke mb-4">
              「愛的語錄」可以告訴妳什麼？
            </h3>
            <p className="text-gray-700 leading-relaxed">
              每一句話都是真心的。不管是開心的時候、難過的時候，都希望這些話能給妳力量。
              點擊中間的愛心，會有不同的驚喜出現。試著多點幾下，會有更多彩蛋等著妳！
            </p>
          </div>

          <div className="section-card">
            <h3 className="text-xl font-bold mb-4">什麼是隱藏彩蛋？可以如何找到？</h3>
            <p className="text-gray-700 leading-relaxed">
              彩蛋是這個網站的秘密驚喜！試著點擊頁面上的愛心，當你點擊到特定次數時，
              就會出現專屬於妳的秘密訊息。一共有三個彩蛋，妳能全部找到嗎？
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="section-card bg-[#FFF8E7] text-center">
            <h3 className="text-xl font-black text-[#FFD93D] text-stroke mb-4">
              再輸入一次，看看更多愛的訊息
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <label className="font-bold text-gray-800">妳的生日</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="date-input w-44"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="btn-brutal bg-[#FFD93D] text-black"
            >
              送出看結果
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FFD93D] border-t-2 border-black py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AnimatedLogo />
              <span className="font-black">Kimmy 好可愛</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">首頁</a>
              <a href="#about" className="hover:underline">關於</a>
              <a href="#love" className="hover:underline">愛的語錄</a>
            </div>
            <div className="text-sm text-gray-700">
              v{VERSION} • Made with 💕 for Kimmy
            </div>
          </div>
        </div>
      </footer>

      {/* Explosion Animation */}
      <style>{`
        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default App
