import express from "express";
import fs from "node:fs/promises";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const messages = [];

const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ellen, men er også kendt som Ellenator i sjove sammenhænge. Hvilke facts vil du ellers vide om mig?"
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor inde i Aarhus by sammen med min kæreste Nick."
  },
  {
    category: "hobbier",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at styrketræne, løbe, lave mad, bage lækker kage og brød og meget andet"
  },
  {
    category: "frygter",
    keywords: ["frygt", "fobi", "bange"],
    answer: "Jeg er mega bange for hajer, men besluttede som barn at jeg måtte kunne lære mig ud af frygten, for den er jo irrationel. Så jeg begyndte at læse og se enormt mange dokumentarer om hajer, hvilket blot har resulteret i at jeg nu er enormt facineret af og ved meget om dem,  men er stadig irrationelt bange for dem. Så man kan sige det ikke hjalp så meget!"
  }
];

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

app.get("/", (req, res) => {
    res.render("index", { messages, error: "", topicStats });
});

app.post("/ask", (req, res) => {
  const question = req.body.question.trim();
  let error = "";

  if (!question) {
    error = "*OBS! Skriv et spørgsmål, før du sender";
  } else {
    messages.push({ type: "question", text: question });

    const answer = findBestAnswer(question);
    messages.push({ type: "answer", text: answer.answer });
    
    if (answer.category) {
        topicStats[answer.category] = topicStats[answer.category] + 1;
    }  
  }

res.render("index", { messages, error, topicStats });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});