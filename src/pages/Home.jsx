import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Reusable animation variants
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.95 },
};

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

      <AnimatePresence mode="wait">

        {/* INPUT VIEW */}
        {!debateStarted && !loading && (
          <motion.div
            key="input"
            variants={stagger}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-xl flex flex-col gap-3"
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
                Perspective <span className="text-violet-400">Flip</span>
              </h1>
              <p className="text-zinc-600 text-sm md:text-base">
                Enter any opinion. Debate the other side.
              </p>
            </motion.div>

            {/* Textarea card */}
            <motion.div
              variants={fadeUp}
              className="bg-[#111118] border border-zinc-800 rounded-2xl p-4 md:p-5"
            >
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
            </motion.div>

            {/* Seed opinions */}
            <motion.div
              variants={fadeUp}
              className="bg-[#111118] border border-zinc-800 rounded-2xl p-4"
            >
              <p className="text-xs text-zinc-600 mb-3">Try an example topic</p>
              <div className="grid grid-cols-2 gap-2">
                {SEED_OPINIONS.map((seed, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => onSelectSeed(seed, idx)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      selectedSeed === idx
                        ? "border-violet-600 bg-violet-950/40 text-violet-300"
                        : "border-zinc-800 bg-[#18181f] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-base block mb-1">{seed.emoji}</span>
                    {seed.short}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ErrorMessage type={errorType} message={error} onRetry={handleFlip} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flip button */}
            <motion.button
              variants={fadeUp}
              onClick={handleFlip}
              disabled={!opinion.trim() || charCount > maxChars}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-violet-700 hover:bg-violet-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-medium py-4 rounded-2xl transition-colors text-sm md:text-base"
            >
              Start the Debate 🥊
            </motion.button>

          </motion.div>
        )}

        {/* LOADING */}
        {loading && !debateStarted && (
          <motion.div
            key="loading"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-xl"
          >
            <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-10 flex flex-col items-center gap-5">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-violet-500 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.18,
                    }}
                  />
                ))}
              </div>
              <p className="text-zinc-500 text-sm">Preparing your opponent...</p>
              <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-violet-600 rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* DEBATE VIEW */}
        {debateStarted && (
          <motion.div
            key="debate"
            variants={stagger}
            initial="initial"
            animate="animate"
            className="w-full max-w-xl flex flex-col gap-3"
          >
            <DebateThread
              messages={messages}
              loading={loading}
              opinion={opinion}
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  key="debate-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ErrorMessage type={errorType} message={error} onRetry={handleReply} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mind meter — appears after 4 messages */}
            <AnimatePresence>
              {messages.length >= 4 && (
                <motion.div
                  key="meter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-[#111118] border border-zinc-800 rounded-2xl p-4"
                >
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
                    <motion.span
                      key={meterLabel(mindChange)}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-violet-400 font-medium"
                    >
                      {meterLabel(mindChange)}
                    </motion.span>
                    <span className="text-xs text-zinc-700">Completely</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reply input */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111118] border border-zinc-800 rounded-2xl p-3 flex gap-2"
              >
                <textarea
                  rows={2}
                  className="flex-1 bg-[#18181f] border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm resize-none outline-none focus:border-violet-600 transition-colors placeholder-zinc-600 leading-relaxed"
                  placeholder="Push back, concede a point, or ask a question..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <motion.button
                  onClick={handleReply}
                  disabled={!replyInput.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-violet-700 hover:bg-violet-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-4 rounded-xl transition-colors text-sm font-medium self-end py-2"
                >
                  Send
                </motion.button>
              </motion.div>
            )}

            <p className="text-xs text-zinc-700 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>

            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-zinc-800 hover:border-zinc-600 text-zinc-600 hover:text-zinc-300 font-medium py-3 rounded-2xl transition-colors text-sm"
            >
              End Debate & Start Over
            </motion.button>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}