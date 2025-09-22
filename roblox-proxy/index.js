import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/proxy", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "⚠️ サウンドIDが指定されていません" });

  try {
    const apiUrl = `https://assetdelivery.roblox.com/v1/asset?id=${id}`;
    const response = await fetch(apiUrl, { redirect: "manual" });

    if (response.status !== 302 && response.status !== 200) {
      return res.status(response.status).json({ error: `Roblox APIエラー: ${response.status}` });
    }

    const redirectUrl = response.headers.get("location");
    if (!redirectUrl) {
      return res.status(500).json({ error: "音声URLが取得できませんでした" });
    }

    res.set("Access-Control-Allow-Origin", "*");
    res.json({ url: redirectUrl });

  } catch (err) {
    res.status(500).json({ error: "プロキシエラー: " + err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Proxy running on port ${port}`));
