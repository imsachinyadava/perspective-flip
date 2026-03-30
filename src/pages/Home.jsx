import { useState } from "react";
import { useFlip } from "../hooks/useFlip";
import ErrorMessage from "../components/ErrorMessage";

const SEED_OPINIONS = [
  { emoji: "🤖", short: "AI will destroy jobs",     full: "AI will destroy more jobs than it creates" },
  { emoji: "🏠", short: "Remote work is better",    full: "Remote work is better than office work" },
  { emoji: "🎓", short: "College is overrated",     full: "College education is overrated and too expensive" },
  { emoji: "📱", short: "Social media is toxic",    full: "Social media is toxic for mental health" },
  { emoji: "💰", short: "Crypto is the future",     full: "Cryptocurrency is the future of money" },
  { emoji: "🎮", short: "Games are a waste",        full: "Video games are a waste of time" },
];

const LOADING_MESSAGES = [
  "Steelmanning the opposite view...",
  "Constructing the best counter-argument...",
  "Finding the strongest opposing case...",
  "Thinking from the other side...",
];

export default function Home() {
  const {
    opinion, setOpinion,
    result, loading,
    error, errorType,
    mindChange, setMindChange,
    flipped, handleFlip, handleReset,
  } = useFlip();

  const [flippedCard, setFlippedCard] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [selectedSeed, setSelectedSeed] = useState(null);

  const charCount = opinion.length;
  const maxChars = 300;

  const meterLabel = (v) => {
    if (v < 20) return "Nope, still me 😤";
    if (v < 40) return "Slightly curious 🤨";
    if (v < 60) return "Hmm, maybe... 🤔";
    if (v < 80) return "Pretty convincing! 👀";
    return "Mind = Blown 🤯";
  };

  const onSelectSeed = (seed, idx) => {
    setSelectedSeed(idx);
    setOpinion(seed.full);
  };

  const onFlip = async () => {
    setFlippedCard(false);
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setMsgIndex(i);
    }, 1800);
    await handleFlip();
    clearInterval(interval);
    setTimeout(() => setFlippedCard(true), 300);
  };

  const onReset = () => {
    setFlippedCard(false);
    setSelectedSeed(null);
    setTimeout(() => handleReset(), 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center px-4 py-12 md:py-16">

      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          Perspective <span className="text-violet-400">Flip</span>
        </h1>
        <p className="text-zinc-600 text-sm md:text-base">
          Enter any opinion. See the strongest case against it.
        </p>
      </div>

      {/* INPUT VIEW */}
      {!flipped && !loading && (
        <div className="w-full max-w-xl flex flex-col gap-3">

          {/* Textarea */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-4 md:p-5">
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3 font-medium">
              Your opinion
            </p>
            <textarea
              rows={4}
              maxLength={maxChars}
              className="w-full bg-[#18181f] border border-zinc-800 rounded-xl p-3 md:p-4 text-white text-sm resize-none outline-none focus:border-violet-600 transition-colors placeholder-zinc-600 leading-relaxed"
              placeholder='"Social media is bad for society"'
              value={opinion}
              onChange={(e) => { setOpinion(e.target.value); setSelectedSeed(null); }}
            />
            {/* Char counter */}
            <p className={`text-xs text-right mt-2 ${
              charCount > 280 ? "text-red-500" :
              charCount > 240 ? "text-amber-600" :
              "text-zinc-700"
            }`}>
              {charCount} / {maxChars}
            </p>
          </div>

          {/* Seed opinions */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-4">
            <p className="text-xs text-zinc-600 mb-3">Try an example topic</p>
            <div className="grid grid-cols-2 gap-2">
              {SEED_OPINIONS.map((seed, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSeed(seed, idx)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedSeed === idx
                      ? "border-violet-600 bg-violet-950/40 text-violet-300"
                      : "border-zinc-800 bg-[#18181f] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  <span className="text-base block mb-1">{seed.emoji}</span>
                  {seed.short}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          <ErrorMessage type={errorType} message={error} onRetry={onFlip} />

          {/* Flip button */}
          <button
            onClick={onFlip}
            disabled={!opinion.trim() || charCount > maxChars}
            className="w-full bg-violet-700 hover:bg-violet-600 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-medium py-4 rounded-2xl transition-all text-sm md:text-base"
          >
            Flip My Perspective 🔄
          </button>

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="w-full max-w-xl">
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-10 flex flex-col items-center gap-5">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
            <p className="text-zinc-500 text-sm">{LOADING_MESSAGES[msgIndex]}</p>
            <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {flipped && result && (
        <div className="w-full max-w-xl flex flex-col gap-3">

          {/* Flip card */}
          <div className="[perspective:1000px] w-full">
            <div
              className={`relative w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                flippedCard ? "[transform:rotateY(180deg)]" : ""
              }`}
              style={{ minHeight: "160px" }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden] bg-[#111118] border border-zinc-800 rounded-2xl p-4 md:p-5">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3 font-medium">Your opinion</p>
                <p className="text-zinc-400 italic text-sm">"{opinion}"</p>
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#13101f] border border-purple-900 rounded-2xl p-4 md:p-5 overflow-auto">
                <p className="text-xs uppercase tracking-widest text-violet-500 mb-4 font-medium">Flipped perspective 🔄</p>
                <div className="flex flex-col gap-3">
                  {result.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-zinc-200 text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
                <div className="border-t border-purple-900/50 mt-5 pt-3 flex justify-between items-center">
                  <span className="text-xs text-violet-900">Powered by OpenRouter</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-xs text-violet-500 hover:text-violet-300 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={`flex items-center gap-3 transition-opacity duration-500 ${flippedCard ? "opacity-100" : "opacity-0"}`}>
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-700 font-semibold tracking-widest">PERSPECTIVE FLIPPED</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Mind meter */}
          <div className={`bg-[#111118] border border-zinc-800 rounded-2xl p-4 md:p-5 transition-all duration-500 ${flippedCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <p className="text-sm text-zinc-500 text-center mb-4">Did this change your mind?</p>
            <input
              type="range" min={0} max={100} step={1}
              value={mindChange}
              onChange={(e) => setMindChange(Number(e.target.value))}
              className="w-full accent-violet-500 cursor-pointer"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-zinc-700">Not at all</span>
              <span className="text-sm text-violet-400 font-medium">{meterLabel(mindChange)}</span>
              <span className="text-xs text-zinc-700">Completely</span>
            </div>
          </div>

          {/* Buttons */}
          <div className={`flex gap-3 transition-all duration-500 delay-100 ${flippedCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button
              onClick={() => navigator.clipboard.writeText(`My opinion: "${opinion}"\n\nFlipped:\n${result}`)}
              className="flex-1 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 font-medium py-3 rounded-2xl transition-colors text-sm"
            >
              Share 📤
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-violet-700 hover:bg-violet-600 text-white font-medium py-3 rounded-2xl transition-colors text-sm"
            >
              Try Another 🔄
            </button>
          </div>

        </div>
      )}
    </div>
  );
}