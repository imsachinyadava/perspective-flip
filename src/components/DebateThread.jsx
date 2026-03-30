import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypeWriter from "./TypeWriter";

export default function DebateThread({ messages, loading, opinion }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="w-full max-w-xl flex flex-col gap-3">

      {/* Debate topic header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111118] border border-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1 font-medium">
            Debate topic
          </p>
          <p className="text-zinc-400 text-sm italic">"{opinion}"</p>
        </div>
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-3 py-1 rounded-full flex-shrink-0 ml-3"
        >
          Live
        </motion.span>
      </motion.div>

      {/* Messages */}
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-violet-700 text-white rounded-br-sm"
                : "bg-[#111118] border border-zinc-800 text-zinc-200 rounded-bl-sm"
            }`}>
              <p className={`text-xs font-medium mb-2 ${
                msg.role === "user" ? "text-violet-300" : "text-zinc-500"
              }`}>
                {msg.role === "user" ? "You" : "⚡ FLIP"}
              </p>

              {/* Typewriter for AI — plain text for user */}
              {msg.role === "assistant" ? (
                <TypeWriter
                  text={msg.content}
                  speed={10}
                  onDone={() =>
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                />
              ) : (
                msg.content.split("\n\n").filter(Boolean).map((para, j) => (
                  <p key={j} className="mb-2 last:mb-0">{para}</p>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading bubble */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading-bubble"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-start"
          >
            <div className="bg-[#111118] border border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-4">
              <p className="text-xs text-zinc-600 mb-2 font-medium">⚡ FLIP</p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-violet-500 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}