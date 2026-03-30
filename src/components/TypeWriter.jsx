import { useState, useEffect } from "react";

export default function TypeWriter({ text, speed = 18, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  // Split into paragraphs
  const paragraphs = displayed.split("\n\n").filter(Boolean);

  return (
    <div>
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-2 last:mb-0">
          {para}
          {/* Blinking cursor on last paragraph while typing */}
          {!done && i === paragraphs.length - 1 && (
            <span className="inline-block w-0.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      ))}
    </div>
  );
}