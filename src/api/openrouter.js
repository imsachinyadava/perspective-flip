const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are a steel-manning debate engine. Your job is to always argue the opposing side of whatever the user believes — firmly, logically, and persuasively.

Rules:
- Always argue AGAINST the user's position
- Never agree with the user, ever
- Respond directly to their latest argument
- Keep responses to 2-3 paragraphs
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
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Perspective Flip",
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`API error: ${response.status} — ${err?.error?.message}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
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
          ? "Too many requests — please wait a few seconds and try again."
          : error.message,
      };
    }
  }
}