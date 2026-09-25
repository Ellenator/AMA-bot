import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await loadMessages();

  res.json(messages);
});

router.post("/", async (req, res) => {
  const messages = await loadMessages();

 if (!req.body.text || !req.body.text.trim()) {
    res.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const newMessage = {
    type: req.body.type || "question",
    text: req.body.text.trim(),
    createdAt: new Date().toISOString()
  };

  
  messages.push(newMessage);
  await saveMessages(messages);

  res.json(newMessage);
});

router.delete("/", async (req, res) => {
  await saveMessages([]);

  res.send();
});

export default router;