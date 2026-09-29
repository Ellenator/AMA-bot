import express from "express";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//routes
app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

const topicStats = {
    personlighed: 0,
    praktisk: 0
};

// 404 catch all mddeleware - rammes hvis ingen router gribes
app.use((req, res) => {
  res.status(404).json({ error: "Routen blev ikke fundet" });
});

// fejl middelware - skal have 4 argumenter
app.use((err, req, res, next) => {
  console.error("Serverfejl:", err);
  res.status(500).json({ error: "Der opstod en uventet serverfejl" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});