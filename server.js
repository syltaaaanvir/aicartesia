import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/tts", async (req, res) => {
  try {
    const apiKey = process.env.CARTESIA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "CARTESIA_API_KEY server-এ সেট করা হয়নি।" });
    const transcript = String(req.body?.transcript || "").trim();
    const voiceId = String(req.body?.voiceId || process.env.CARTESIA_VOICE_ID || "").trim();
    const emotion = String(req.body?.emotion || "neutral");
    const speed = Number(req.body?.speed ?? 1);
    const volume = Number(req.body?.volume ?? 1);
    if (!transcript) return res.status(400).json({ error: "Text লিখুন।" });
    if (transcript.length > 5000) return res.status(400).json({ error: "সর্বোচ্চ ৫,০০০ অক্ষর।" });
    if (!voiceId) return res.status(400).json({ error: "Cartesia Voice ID দিন।" });
    if (speed < 0.6 || speed > 1.5) return res.status(400).json({ error: "Speed 0.6–1.5 হতে হবে।" });
    if (volume < 0.5 || volume > 2) return res.status(400).json({ error: "Volume 0.5–2 হতে হবে।" });

    const upstream = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Cartesia-Version": "2026-03-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model_id: "sonic-3.6",
        transcript,
        voice: { mode: "id", id: voiceId },
        output_format: { container: "wav", encoding: "pcm_s16le", sample_rate: 44100 },
        generation_config: { emotion, speed, volume }
      })
    });
    if (!upstream.ok) {
      const detail = await upstream.text();
      return res.status(upstream.status).json({ error: "Cartesia API error", detail: detail.slice(0, 1000) });
    }
    const bytes = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", 'inline; filename="cartesia-voice.wav"');
    res.setHeader("Cache-Control", "no-store");
    res.send(bytes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error. আবার চেষ্টা করুন।" });
  }
});
app.listen(process.env.PORT || 3000, () => console.log("Cartesia Voice Studio ready"));
