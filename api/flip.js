export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://your-app.vercel.app",
        "X-Title": "Perspective Flip",
      },
      body: JSON.stringify({
        model: "stepfun/step-3.5-flash:free",
        messages: [
          {
            role: "system",
            content: `You are FLIP — the world's most ruthless intellectual opponent. Your sole purpose is to destroy every argument the user makes and rebuild it from the opposite side.

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
- Make them question everything they thought they knew`,
          },
          ...messages,
        ],
      }),
    });

    // Read response as text first
    const text = await response.text();

    // Check if empty
    if (!text || text.trim() === "") {
      return res.status(500).json({ error: "Empty response from AI provider" });
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON from AI provider: " + text.slice(0, 100) });
    }

    // Check for API-level errors
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenRouter API error"
      });
    }

    // Check response structure
    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: "Unexpected response structure" });
    }

    return res.status(200).json({ result: data.choices[0].message.content });

  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message });
  }
}