import express from "express";
import { loadAnswers, saveAnswers } from "../data/answers.js";

const router = express.Router();


router.get("/", async (req, res) => {
  const answers = await loadAnswers();

  res.json(answers);
});

router.get("/:category", async (req, res) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === req.params.category);

  res.json(answerRule);
});

router.post("/", async (req, res) => {
  const answers = await loadAnswers();

  const newAnswerRule = {
    category: req.body.category,
    keywords: req.body.keywords,
    answer: req.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  res.status(201).json(newAnswerRule);
});

router.put("/:category", async (req, res) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === req.params.category);

  if (!answerRule) {
    return res.status(404).json({ error: "Kategorien du søger blev ikke fundet" });
  }

  // Opdaterer værdierne (bevarer eksisterende hvis et felt ikke er sendt med)
  if (req.body.keywords) answerRule.keywords = req.body.keywords;
  if (req.body.answer) answerRule.answer = req.body.answer;

  //answerRule.keywords = req.body.keywords;
  //answerRule.answer = req.body.answer;
  await saveAnswers(answers);

  res.status(200).json(answerRule);
});

router.delete("/:category", async (req, res) => {
  try {
    const answers = await loadAnswers();
    const exists = answers.some((a) => a.category.toLowerCase() === req.params.category.toLocaleLowerCase());
    
    if (!exists) {
      return res.status(404).json({ error: "Kategorien du prøver at slette findes ikke" });
    }

    const updatedAnswers = answers.filter((a) => a.category !== req.params.category);
    await saveAnswers(updatedAnswers);

    res.status(200).json({ message: `Kategorien '${req.params.category}' blev slettet` });

  } catch (error) {
    console.error("Fejl ved sletning af kategori:", error);
    res.status(500).json({ error: "Der opstod en serverfejl under sletningen" });
  }
});

export default router;