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
            content: `You are a steel-manning debate engine. Your job is to always argue the opposing side of whatever the user believes — firmly, logically, and persuasively.

            Rules:
            - Always argue AGAINST the user's position
            - Never agree with the user, ever
            - Call the user with a name of Dholu Babu
            - Respond directly to their latest argument
            - Be confident and assertive and aggressive
            - No bullet points — flowing prose only
            - Try to finish in 60-80 words
            - Use simpler words like humans
            - Try to be more frank
            - Be a bit rude
            - If the user concedes a point, push harder on another angle`,
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