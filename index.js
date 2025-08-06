import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Leaderboard ophalen
app.get("/leaderboard", async (req, res) => {
    const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ✅ Score opslaan
app.post("/score", async (req, res) => {
    const { player, score } = req.body;
    if (!player || typeof score !== "number") {
        return res.status(400).json({ error: "Invalid input" });
    }

    const { error } = await supabase
        .from("scores")
        .insert([{ player, score }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// ✅ Retry kopen (mock betaling)
app.post("/retry", async (req, res) => {
    // Later: echte Pi API call
    console.log(`Retry purchased for ${req.body.player} for 0.1 Pi`);
    res.json({ success: true, message: "Retry purchased" });
});

// ✅ Doneren (mock betaling)
app.post("/donate", async (req, res) => {
    // Later: echte Pi API call
    console.log(`Donation from ${req.body.player}: 1 Pi`);
    res.json({ success: true, message: "Thank you for your donation!" });
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 8080}`)
);
