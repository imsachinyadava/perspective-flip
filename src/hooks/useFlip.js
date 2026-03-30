import { useState } from "react";
import { getFlippedPerspective } from "../api/openrouter.js";

export function useFlip() {
  const [opinion, setOpinion] = useState("");
  const [messages, setMessages] = useState([]); // full conversation history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [debateStarted, setDebateStarted] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [mindChange, setMindChange] = useState(50);

  async function handleFlip() {
    if (!opinion.trim()) {
      setErrorType("empty");
      setError("Please enter an opinion before flipping.");
      return;
    }
    if (opinion.trim().length < 10) {
      setErrorType("warn");
      setError("Your opinion is very short — try adding more detail.");
      return;
    }

    setLoading(true);
    setError(null);
    setErrorType(null);

    const initialMessages = [
      { role: "user", content: `My opinion: "${opinion}"` }
    ];

    const { success, result, error } = await getFlippedPerspective(initialMessages);

    if (success) {
      setMessages([
        { role: "user", content: opinion },
        { role: "assistant", content: result },
      ]);
      setDebateStarted(true);
    } else {
      setErrorType(error.includes("429") ? "rate" : "generic");
      setError(error);
    }

    setLoading(false);
  }

  async function handleReply() {
    if (!replyInput.trim()) return;

    const userReply = replyInput.trim();
    setReplyInput("");
    setLoading(true);
    setError(null);

    const updatedMessages = [
      ...messages,
      { role: "user", content: userReply },
    ];

    // Format for API
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const { success, result, error } = await getFlippedPerspective(apiMessages);

    if (success) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: result },
      ]);
    } else {
      setErrorType(error.includes("429") ? "rate" : "generic");
      setError(error);
      // Put reply back if failed
      setReplyInput(userReply);
    }

    setLoading(false);
  }

  function handleReset() {
    setOpinion("");
    setMessages([]);
    setReplyInput("");
    setError(null);
    setErrorType(null);
    setDebateStarted(false);
    setMindChange(50);
  }

  return {
    opinion, setOpinion,
    messages,
    loading,
    error, errorType,
    debateStarted,
    replyInput, setReplyInput,
    mindChange, setMindChange,
    handleFlip,
    handleReply,
    handleReset,
  };
}