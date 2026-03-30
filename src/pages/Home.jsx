import { useState } from "react";
import { useFlip } from "../hooks/useFlip";
import ErrorMessage from "../components/ErrorMessage";
import DebateThread from "../components/DebateThread";

const SEED_OPINIONS = [
  { emoji: "🤖", short: "AI will destroy jobs",  full: "AI will destroy more jobs than it creates" },
  { emoji: "🏠", short: "Remote work is better", full: "Remote work is better than office work" },
  { emoji: "🎓", short: "College is overrated",  full: "College education is overrated and too expensive" },
  { emoji: "📱", short: "Social media is toxic", full: "Social media is toxic for mental health" },
  { emoji: "💰", short: "Crypto is the future",  full: "Cryptocurrency is the future of money" },
  { emoji: "🎮", short: "Games are a waste",     full: "Video games are a waste of time" },
];

export default function Home() {
  const {
    opinion, setOpinion,
    messages, loading,
    error, errorType,
    debateStarted,
    replyInput, setReplyInput,
    mindChange, setMindChange,
    handleFlip, handleReply, handleReset,
  } = useFlip();

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

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center px-4 py-12 md:py-16">

      {/* Header */}
      {!debateStarted && (
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            Perspective <span className="text-violet-400">Flip</span>
          </h1>
          <p className="text-zinc-600 text-sm md:text-base">
            Enter any opinion. Debate the other side.
          </p>
        </div>
      )}

      {/* INPUT VIEW */}
      {!debateStarted && !loading && (
        <div className="w-full max-w-xl flex flex-col gap-3">

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

          <ErrorMessage type={errorType} message={error} onRetry={handleFlip} />

          <button
            onClick={handleFlip}
            disabled={!opinion.trim() || charCount > maxChars}
            className="w-full bg-violet-700 hover:bg-violet-600 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-medium py-4 rounded-2xl transition-all text-sm md:text-base"
          >
            Start the Debate 🥊
          </button>
        </div>
      )}

      {/* LOADING first flip */}
      {loading && !debateStarted && (
        <div className="w-full max-w-xl">
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-10 flex flex-col items-center gap-5">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
            <p className="text-zinc-500 text-sm">Preparing your opponent...</p>
            <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      )}

      {/* DEBATE VIEW */}
      {debateStarted && (
        <div className="w-full max-w-xl flex flex-col gap-3">

          {/* Conversation thread */}
          <DebateThread
            messages={messages}
            loading={loading}
            opinion={opinion}
          />

          {/* Error inside debate */}
          {error && <ErrorMessage type={errorType} message={error} onRetry={handleReply} />}

          {/* Mind change meter */}
          {messages.length >= 4 && (
            <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-500 text-center mb-3">
                How convinced are you now?
              </p>
              <input
                type="range" min={0} max={100} step={1}
                value={mindChange}
                onChange={(e) => setMindChange(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-zinc-700">Not at all</span>
                <span className="text-sm text-violet-400 font-medium">{meterLabel(mindChange)}</span>
                <span className="text-xs text-zinc-700">Completely</span>
              </div>
            </div>
          )}

          {/* Reply input */}
          {!loading && (
            <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-3 flex gap-2">
              <textarea
                rows={2}
                className="flex-1 bg-[#18181f] border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm resize-none outline-none focus:border-violet-600 transition-colors placeholder-zinc-600 leading-relaxed"
                placeholder="Push back, concede a point, or ask a question..."
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                onClick={handleReply}
                disabled={!replyInput.trim()}
                className="bg-violet-700 hover:bg-violet-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-4 rounded-xl transition-colors text-sm font-medium self-end pb-2 pt-2"
              >
                Send
              </button>
            </div>
          )}

          {/* Hint text */}
          <p className="text-xs text-zinc-700 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>

          {/* End debate */}
          <button
            onClick={handleReset}
            className="w-full border border-zinc-800 hover:border-zinc-600 text-zinc-600 hover:text-zinc-300 font-medium py-3 rounded-2xl transition-colors text-sm"
          >
            End Debate & Start Over
          </button>

        </div>
      )}
    </div>
  );
}