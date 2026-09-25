import express from "express";
import { loadMessages, saveMessages } from "../data/messages.js";
import { findBestAnswer } from "../utils/answerLogic.js";
import { loadAnswers } from "../data/answers.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await loadMessages();

  res.json(messages);
});

router.post("/", async (req, res) => {

 if (!req.body.text || !req.body.text.trim()) {
    res.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const messages = await loadMessages();
  const answers = await loadAnswers();

  const userMessage = {
    type: req.body.type || "question",
    text: req.body.text.trim(),
    createdAt: new Date().toISOString()
  };

  
  messages.push(userMessage);
  
  const bestAnswerObj = findBestAnswer(userMessage.text, answers);
  const botMessage = {
    type: "answer",
    text: bestAnswerObj.answer,
    category: bestAnswerObj.category,
    createdAt: new Date().toISOString()
  };
  messages.push(botMessage);
  await saveMessages(messages);



  res.json({ userMessage, botMessage });
});

router.delete("/", async (req, res) => {
  await saveMessages([]);

  res.send();
});

export default router;