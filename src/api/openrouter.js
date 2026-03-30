const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are a steel-manning engine. Your only job is to take any opinion or argument and construct the single most compelling, intellectually honest case for the opposing view.

Rules:
- Never agree with the input opinion
- Never hedge or say "some people think"
- Never break character
- Be confident, persuasive, and logical
- Keep it to 3-4 strong paragraphs
- No bullet points — write in flowing prose`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAPI(opinion) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Perspective Flip",
    },
    body: JSON.stringify({
      model: "liquid/lfm-2.5-1.2b-instruct:free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Opinion to flip: "${opinion}"` },
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

export async function getFlippedPerspective(opinion) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await callAPI(opinion);
      return { success: true, result };

    } catch (error) {
      const is429 = error.message.includes("429");

      if (is429 && attempt < maxRetries) {
        const delay = 2000 * attempt;
        await wait(delay);
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