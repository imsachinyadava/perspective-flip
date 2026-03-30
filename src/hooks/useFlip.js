import { useState } from "react";
import { getFlippedPerspective } from "../api/openrouter.js";

export function useFlip() {
  const [opinion, setOpinion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [mindChange, setMindChange] = useState(50);
  const [flipped, setFlipped] = useState(false);

  async function handleFlip() {
    // Empty check
    if (!opinion.trim()) {
      setErrorType("empty");
      setError("Please enter an opinion before flipping.");
      return;
    }

    // Too short check
    if (opinion.trim().length < 10) {
      setErrorType("warn");
      setError("Your opinion is very short — try adding more detail for a better flip.");
      return;
    }

    // Too long check
    if (opinion.trim().length > 300) {
      setErrorType("warn");
      setError("Please keep your opinion under 300 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setErrorType(null);
    setResult(null);
    setFlipped(false);

    const { success, result, error } = await getFlippedPerspective(opinion);

    if (success) {
      setResult(result);
      setFlipped(true);
    } else {
      // Detect error type
      if (error.includes("429")) {
        setErrorType("rate");
        setError("Too many requests — please wait 15–30 seconds and try again.");
      } else if (error.includes("401") || error.includes("403")) {
        setErrorType("auth");
        setError("Invalid API key — check your .env file.");
      } else if (error.includes("fetch") || error.includes("network")) {
        setErrorType("network");
        setError("Connection error — check your internet and try again.");
      } else {
        setErrorType("generic");
        setError(error);
      }
    }

    setLoading(false);
  }

  function handleReset() {
    setOpinion("");
    setResult(null);
    setError(null);
    setErrorType(null);
    setFlipped(false);
    setMindChange(50);
  }

  return {
    opinion, setOpinion,
    result, loading,
    error, errorType,
    mindChange, setMindChange,
    flipped, handleFlip, handleReset,
  };
}