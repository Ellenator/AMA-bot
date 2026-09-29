import express from "express";
import { loadAnswers, saveAnswers } from "../data/answers.js";

const router = express.Router();

// GET /answers - henter alle svar
router.get("/", async (req, res) => {
  const answers = await loadAnswers();
  res.json(answers);
});

//GET /answers/:id - henter et svar med et specifikt id
router.get("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return next();
  }

  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.id === Number(req.params.id));

  if (!answerRule) {
    return res.status(404).json({ error: `Svaret med id '${req.params.id}' findes ikke` });
  }

  res.json(answerRule);
});

// GET /answers/category/:category - henter svar ud fra kategori
router.get("/category/:category", async (req, res) => {
  const answers = await loadAnswers();
  const answerRule = answers.filter((a) => a.category.toLocaleLowerCase() === req.params.category.toLocaleLowerCase());

  if (!answerRule) {
    res.status(404).json({ error: `Kategorien '${req.params.category}' findes ikke`});
  }

  res.json(answerRule);
});

// POST /answers - opretter et nyt svar med id, category, keywords og answer
router.post("/", async (req, res) => {
  const { category, keywords, answer } = req.body;

  if (
    !category || typeof category !== "string" || !category.trim() ||
    !answer || typeof answer !== "string" || !answer.trim() ||
    !Array.isArray(keywords) || keywords.length === 0
  ) {
    return res.status(400).json({
      error: "Udfyld alle felter: category (tekst), answer (tekst) og keywords (array)"
    });
  }

  const answers = await loadAnswers();

  const newId = answers.length > 0 ? Math.max(...answers.map((a) => a.id)) + 1 : 1;

  const newAnswerRule = {
    id: newId,
    category: category.trim(),
    keywords: keywords,
    answer: answer.trim()
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  res.status(201).json(newAnswerRule);
});

// PUT /answers/:id - opdaterer eksiterende svar ud fra unikt ID
router.put("/:id", async (req, res) => {
  const { category, keywords, answer } = req.body;

  if (
    !category || typeof category !== "string" || !category.trim() ||
    !answer || typeof answer !== "string" || !answer.trim() || 
    !Array.isArray(keywords) || keywords.length === 0
  ) {
    return res.status(400).json({
      error: "Både 'category', 'answer' (tekst) og 'keywords' (array) skal udfyldes ved opdatering"
    });
  }

  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.id === Number(req.params.id));

  if (!answerRule) {
    return res.status(404).json({ error: "Id'et du søger blev ikke fundet" });
  }

  answerRule.category = category.trim();
  answerRule.keywords = keywords;
  answerRule.answer = answer.trim();
  
  await saveAnswers(answers);

  res.status(200).json(answerRule);
});

// DELETE /answers/:id - sletter et svar ud fra unikt id
router.delete("/:id", async (req, res) => {
  try {
    const answers = await loadAnswers();
    const idToMatch = Number(req.params.id);
    const exists = answers.some((a) => a.id === idToMatch);
    
    if (!exists) {
      return res.status(404).json({ error: "Id'et du prøver at slette findes ikke" });
    }

    const updatedAnswers = answers.filter((a) => a.id !== idToMatch);
    await saveAnswers(updatedAnswers);

    res.status(200).json({ message: `svaret med id '${req.params.id}' blev slettet` });

  } catch (error) {
    console.error("Fejl ved sletning af id:", error);
    res.status(500).json({ error: "Der opstod en serverfejl under sletningen" });
  }
});

export default router;