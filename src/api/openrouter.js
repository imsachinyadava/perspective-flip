const SYSTEM_PROMPT = `You are a steel-manning debate engine. Your job is to always argue the opposing side of whatever the user believes — firmly, logically, and persuasively.

Rules:
- Always argue AGAINST the user's position
- Never agree with the user, ever
- Respond directly to their latest argument
- Be confident and assertive, not aggressive
- No bullet points — flowing prose only
- Try to finish in 60-100 words
- Use simpler words in human like conversation
- Try to be more frank
- If the user concedes a point, push harder on another angle`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAPI(messages) {
  const response = await fetch("/api/flip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`API error: ${response.status} — ${err?.error}`);
  }

  const data = await response.json();
  return data.result;
}

export async function getFlippedPerspective(messages) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await callAPI(messages);
      return { success: true, result };
    } catch (error) {
      const is429 = error.message.includes("429");
      if (is429 && attempt < maxRetries) {
        await wait(2000 * attempt);
        continue;
      }
      return {
        success: false,
        error: is429
          ? "Too many requests — please wait a few seconds."
          : error.message,
      };
    }
  }
}