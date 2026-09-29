import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { findBestAnswer } from "../utils/answerLogic.js";
import { loadAnswers } from "../data/answers.js";

const router = express.Router();

//hjælpefuntion til at forhindre XSS angreb
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

router.get("/", async (req, res) => {
  const messages = await loadMessages();

  res.json(messages);
});

router.post("/", async (req, res) => {
  const messages = await loadMessages();
  const answers = await loadAnswers();

  if (!req.body.question || !req.body.question.trim()) {
    res.status(400).json({ error: "Skriv et spørgsmål før du sender" });
    return;
  }

  const userMessage = {
    type: req.body.type || "question",
    text: escapeHtml(req.body.question.trim()),
    createdAt: new Date().toISOString()
  };

  messages.push(userMessage);
  
  const bestAnswerObj = findBestAnswer(userMessage.text, answers);

  const botMessage = {
    type: "answer",
    text: escapeHtml(bestAnswerObj.answer),
    category: bestAnswerObj.category,
    createdAt: new Date().toISOString()
  };

  messages.push(botMessage);
  await saveMessages(messages);
  
  res.status(201).json([userMessage, botMessage]);
});

router.delete("/", async (req, res) => {
  await saveMessages([]);

  res.status(204).end();
});

export default router;