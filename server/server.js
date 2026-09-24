import express from "express";
import { readFile } from "node:fs";
import fs from "node:fs/promises";

const app = express();
const port = 3000;

app.use(express.json());

async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf8");
  return JSON.parse(data);
}

async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
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

function findBestAnswer(question) {
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

//routes
app.get("/messages", async (req, res) => {
  const messages = await loadMessages();

  res.json(messages);
});

app.post("/messages", async (req, res) => {
  const messages = await loadMessages();
  const question = req.body.question.trim();

  if (!question) {
    res.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const message = { type: "question", text: question, createdAt: new Date().toISOString() };
  messages.push(message);

  const result = findBestAnswer(question);
  const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
  messages.push(answerMessage);

  await saveMessages(messages);

  res.json({ question: message, answer: answerMessage });
});

app.delete("/messages", async (req, res) => {
  await saveMessages([]);

  res.send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});