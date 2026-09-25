import express from "express";
//import { readFile } from "node:fs";
//import fs from "node:fs/promises";
import messagesRouter from "../server/routes/messages.js";
import answersRouter from "../server/routes/answers.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);


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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});