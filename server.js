import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const messages = [];

app.get("/", (req, res) => {
    res.render("index", { messages });
});

app.post("/ask", (req, res) => {
    const question = req.body.question;

    messages.push({ type: "question", text: question });
    messages.push({ type: "answer", text: "Jeg leder efter et svar..." })

    res.render("index", { messages });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});