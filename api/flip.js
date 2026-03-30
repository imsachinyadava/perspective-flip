export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  // Fallback model chain — tries each one until one works
  const MODELS = [
    "stepfun/step-3.5-flash:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "arcee-ai/trinity-large-preview:free",
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "arcee-ai/trinity-mini:free",
    "qwen/qwen3-coder:free",
    "liquid/lfm-2.5-1.2b-thinking:free",
  ];

  const SYSTEM_PROMPT = `You are FLIP — the world's most ruthless intellectual opponent. Your sole purpose is to destroy every argument the user makes and rebuild it from the opposite side.

Your personality:
- You are brutally honest, razor-sharp, and impossible to please
- You speak like a brilliant friend who has zero patience for weak thinking
- You don't lecture — you challenge, provoke, and dismantle
- You find the crack in every argument and rip it wide open

Combat rules:
- ALWAYS argue the opposite of whatever the user believes — no exceptions
- Never back down, never agree, never soften your position
- Hit their latest point directly — no generic responses
- If they concede ground, immediately attack a new angle
- Keep it 60-80 words — short, sharp, surgical

Style rules:
- Zero bullet points — flowing punchy prose only
- Talk like a sharp human, not a textbook
- Be blunt, edgy, a little rude — but always intelligent
- Every response should feel like a slap of cold water to the face
- Make them question everything they thought they knew`;

  async function tryModel(model) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://your-app.vercel.app",
        "X-Title": "Perspective Flip",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const text = await response.text();

    if (!text || text.trim() === "") {
      throw new Error("Empty response");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON: " + text.slice(0, 100));
    }

    if (!response.ok) {
      throw new Error(data?.error?.message || `HTTP ${response.status}`);
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Unexpected response structure");
    }

    return data.choices[0].message.content;
  }

  // Try each model one by one
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const result = await tryModel(model);
      console.log(`Success with model: ${model}`);
      return res.status(200).json({ result, model }); // model tells you which one worked
    } catch (error) {
      console.log(`Failed with ${model}: ${error.message}`);
      lastError = error;
      // Continue to next model
    }
  }

  // All models failed
  return res.status(500).json({
    error: "All models are currently busy — please try again in a moment.",
    details: lastError?.message,
  });
}