import express from "express";
import { readFile } from "node:fs";
import fs from "node:fs/promises";
import messagesRouter from "../server/routes/messages.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/messages", messagesRouter);

//AMA bot svar
async function loadAnswers() {
  const data = await fs.readFile("./data/answers.json", "utf8");
  return JSON.parse(data);
}

async function saveAnswers(answers) {
  const json = JSON.stringify(answers, null, 2);
  await fs.writeFile("./data/answers.json", json);
}

function countMatches(keywords, normalizedQuestion) {
    const matches = keywords.filter((keyword) => 
        normalizedQuestion.includes(keyword)
    );

    return matches.length
}

function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg desværre ikke svaret på endnu.";
}

function findBestAnswer(question, answers) {
  const normalizedQuestion = question.toLowerCase();

  let bestScore = 0;
  let bestAnswer = "Det kender jeg desværre ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const tempScore = countMatches(answerGroup.keywords, normalizedQuestion);
    if (tempScore > bestScore) {
        bestScore = tempScore;
        bestAnswer = answerGroup.answer;
        bestCategory = answerGroup.category; 
    }
  }
  return {
    answer: bestAnswer,
    category: bestCategory
  };
}

const topicStats = {
    navn: 0,
    bosted: 0,
    hobbier: 0,
    frygter: 0
};

//routes answers
app.get("/answers", async (req, res) => {
  const answers = await loadAnswers();

  res.json(answers);
});

app.get("/answers/:category", async (req, res) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === req.params.category);

  res.json(answerRule);
});

app.post("/answers", async (req, res) => {
  const answers = await loadAnswers();
  const newAnswerRule = {
    category: req.body.category,
    keywords: req.body.keywords,
    answer: req.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  res.json(newAnswerRule);
});

app.put("/answers/:category", async (req, res) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === req.params.category);

  answerRule.keywords = req.body.keywords;
  answerRule.answer = req.body.answer;
  await saveAnswers(answers);

  res.json(answerRule);
});

app.delete("/answers/:category", async (req, res) => {
  const answers = await loadAnswers();
  const updatedAnswers = answers.filter((a) => a.category !== req.params.category);

  await saveAnswers(updatedAnswers);

  res.send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});