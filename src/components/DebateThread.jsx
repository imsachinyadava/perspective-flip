import { useEffect, useRef } from "react";

export default function DebateThread({ messages, loading, opinion }) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="w-full max-w-xl flex flex-col gap-3">

      {/* Debate topic header */}
      <div className="bg-[#111118] border border-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1 font-medium">
            Debate topic
          </p>
          <p className="text-zinc-400 text-sm italic">"{opinion}"</p>
        </div>
        <span className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-3 py-1 rounded-full flex-shrink-0 ml-3">
          Live
        </span>
      </div>

      {/* Message thread */}
      <div className="flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-700 text-white rounded-br-sm"
                  : "bg-[#111118] border border-zinc-800 text-zinc-200 rounded-bl-sm"
              }`}
            >
              {/* Role label */}
              <p className={`text-xs font-medium mb-2 ${
                msg.role === "user" ? "text-violet-300" : "text-zinc-500"
              }`}>
                {msg.role === "user" ? "You" : "AI Opponent"}
              </p>

              {/* Message content — split into paragraphs */}
              {msg.content.split("\n\n").filter(Boolean).map((para, j) => (
                <p key={j} className="mb-2 last:mb-0">{para}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111118] border border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-4">
              <p className="text-xs text-zinc-600 mb-2 font-medium">AI Opponent</p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}