import { useState, useEffect, useCallback } from 'react'
import './index.css'

const VERSION = '1.0.0'

// 彩蛋：愛的語錄
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

// 彩蛋：隱藏訊息（點擊特定次數觸發）
const secretMessages = [
  "找到彩蛋啦！妳真的好棒！ 🎉",
  "這是專屬於妳的秘密訊息 💌",
  "我愛妳，Kimmy！ 💕",
]

// 表情符號圖騰
const emojis = ['💕', '💖', '💗', '💓', '💝', '🥰', '😍', '🌸', '✨', '⭐']

function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; emoji: string }>>([])

  useEffect(() => {
    const initialHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }))
    setHearts(initialHearts)
  }, [])

  return (
    <div className="floating-hearts">
      {hearts.map(heart => (
        <span
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  )
}

function EmojiTotem({ emoji, delay = 0 }: { emoji: string; delay?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
        flex items-center justify-center
        text-4xl sm:text-5xl lg:text-6xl
        bg-white border-2 border-black rounded-xl shadow-brutal
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
  const [clickCount, setClickCount] = useState(0)
  const [currentQuote, setCurrentQuote] = useState(loveQuotes[0])
  const [showSecret, setShowSecret] = useState(false)
  const [secretMessage, setSecretMessage] = useState('')
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [loveLevel, setLoveLevel] = useState(0)
  const [showLoveMeter, setShowLoveMeter] = useState(false)

  // 版本號輸出
  useEffect(() => {
    console.log(`%c💕 Kimmy Love Site v${VERSION} 💕`, 'color: #FF8FAB; font-size: 20px; font-weight: bold;')
    console.log('%c這是專屬於 Kimmy 的網站！', 'color: #FF6B6B; font-size: 14px;')
    console.log('%c彩蛋提示：試試多點幾下愛心，會有驚喜！', 'color: #C9B1FF; font-size: 12px;')
  }, [])

  // 隨機更換語錄
  const changeQuote = useCallback(() => {
    const newQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)]
    setCurrentQuote(newQuote)
  }, [])

  // 點擊彩蛋邏輯
  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    setLoveLevel(prev => Math.min(prev + 10, 100))

    // 添加閃光效果
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const newSparkle = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setSparkles(prev => [...prev, newSparkle])
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 600)

    // 彩蛋觸發
    if (newCount === 5) {
      setShowSecret(true)
      setSecretMessage(secretMessages[0])
    } else if (newCount === 10) {
      setSecretMessage(secretMessages[1])
    } else if (newCount === 20) {
      setSecretMessage(secretMessages[2])
      // 最終彩蛋：愛心爆發
      triggerHeartExplosion()
    }

    changeQuote()
  }, [clickCount, changeQuote])

  // 愛心爆發效果
  const triggerHeartExplosion = () => {
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
    document.body.appendChild(container)

    for (let i = 0; i < 50; i++) {
      const heart = document.createElement('span')
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      heart.style.cssText = `
        position:absolute;
        left:50%;top:50%;
        font-size:${20 + Math.random() * 30}px;
        animation: explode 1.5s ease-out forwards;
        --x: ${(Math.random() - 0.5) * 800}px;
        --y: ${(Math.random() - 0.5) * 800}px;
      `
      container.appendChild(heart)
    }

    setTimeout(() => container.remove(), 2000)
  }

  return (
    <div className="min-h-screen w-full cursor-love">
      <FloatingHearts />

      {/* Header */}
      <header className="bg-love border-b-2 border-black">
        <nav className="px-4 py-3 lg:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse-heart">💕</span>
              <span className="text-xl lg:text-2xl font-black tracking-wider">
                Kimmy 專屬
              </span>
            </div>
            <button
              className="btn-brutal bg-white"
              onClick={() => setShowLoveMeter(!showLoveMeter)}
            >
              愛心量表 💗
            </button>
          </div>
        </nav>
      </header>

      {/* Love Meter Modal */}
      {showLoveMeter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-brutal max-w-sm mx-4 text-center">
            <h3 className="text-2xl font-bold mb-4">愛心量表 💕</h3>
            <div className="w-full bg-gray-200 rounded-full h-8 border-2 border-black overflow-hidden">
              <div
                className="bg-love h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${loveLevel}%` }}
              >
                <span className="text-white font-bold">{loveLevel}%</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600">點擊愛心來增加愛心值！</p>
            <p className="text-sm text-gray-400 mt-2">已點擊 {clickCount} 次</p>
            <button
              className="btn-brutal bg-love text-white mt-4"
              onClick={() => setShowLoveMeter(false)}
            >
              關閉
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Title */}
          <h1 className="text-love text-stroke text-5xl sm:text-6xl lg:text-8xl font-black tracking-wider mb-4 animate-float">
            Kimmy 好可愛
          </h1>
          <h2 className="text-xl lg:text-3xl font-bold text-gray-700 mb-8">
            這是專屬於妳的小天地 💕
          </h2>

          {/* Emoji Totems - 類似參考網站的十字排列 */}
          <div className="my-12 lg:my-16 space-y-6">
            {/* Top */}
            <div className="flex justify-center">
              <EmojiTotem emoji="🥰" delay={0} />
            </div>

            {/* Middle Row */}
            <div className="flex justify-center gap-6">
              <EmojiTotem emoji="💝" delay={200} />
              <div className="sparkle-container">
                <button
                  onClick={handleHeartClick}
                  className={`
                    w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32
                    flex items-center justify-center
                    text-5xl sm:text-6xl lg:text-7xl
                    bg-love border-2 border-black rounded-xl shadow-brutal-lg
                    transition-all duration-200
                    hover:scale-105 hover:shadow-brutal
                    active:scale-95 active:shadow-none
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
              <EmojiTotem emoji="💖" delay={200} />
            </div>

            {/* Bottom */}
            <div className="flex justify-center">
              <EmojiTotem emoji="😍" delay={400} />
            </div>
          </div>

          {/* Love Quote Card */}
          <div className="card-brutal max-w-lg mx-auto mb-8 bg-gradient-to-br from-white to-pink-50">
            <p className="text-xl lg:text-2xl font-bold text-gray-800">
              {currentQuote}
            </p>
            <button
              className="btn-brutal bg-primary mt-4"
              onClick={changeQuote}
            >
              換一句 ✨
            </button>
          </div>

          {/* Secret Message - Easter Egg */}
          {showSecret && (
            <div className="card-brutal max-w-lg mx-auto bg-gradient-to-br from-accent to-purple-100 animate-bounce-slow">
              <p className="text-lg font-bold text-purple-800">
                🎉 彩蛋發現！
              </p>
              <p className="text-xl mt-2 text-purple-900">
                {secretMessage}
              </p>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card-brutal bg-gradient-to-br from-white to-yellow-50 hover:scale-105 transition-transform">
              <span className="text-4xl mb-3 block">🌟</span>
              <h3 className="text-xl font-bold mb-2">每天愛妳</h3>
              <p className="text-gray-600">不管晴天雨天，每一天都愛妳</p>
            </div>
            <div className="card-brutal bg-gradient-to-br from-white to-pink-50 hover:scale-105 transition-transform">
              <span className="text-4xl mb-3 block">💝</span>
              <h3 className="text-xl font-bold mb-2">永遠陪伴</h3>
              <p className="text-gray-600">牽著妳的手，一起走過每個明天</p>
            </div>
            <div className="card-brutal bg-gradient-to-br from-white to-green-50 hover:scale-105 transition-transform">
              <span className="text-4xl mb-3 block">🏠</span>
              <h3 className="text-xl font-bold mb-2">一起回家</h3>
              <p className="text-gray-600">有妳的地方，就是最溫暖的家</p>
            </div>
          </div>

          {/* Hidden Easter Egg - Konami Code hint */}
          <p className="mt-12 text-gray-400 text-sm">
            提示：試試多點幾下中間的愛心 💕
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-love/30 border-t-2 border-black py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 font-bold">
            Made with 💕 for Kimmy
          </p>
          <p className="text-gray-500 text-sm mt-2">
            v{VERSION} - 專屬於妳的網站
          </p>
        </div>
      </footer>

      {/* Explosion Animation Style */}
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
