import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const messages = [];

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ellen, men er også kendt som Ellenator i sjove sammenhænge. Hvilke facts vil du ellers vide om mig?"
  },
  {
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor inde i Aarhus by sammen med min kæreste Nick."
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at styrketræne, løbe, lave mad, bage lækker kage og brød og meget andet"
  }
];

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

app.get("/", (req, res) => {
    res.render("index", { messages });
});

app.post("/ask", (req, res) => {
    const question = req.body.question;
    
    messages.push({ type: "question", text: question });

    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });

    res.render("index", { messages });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});