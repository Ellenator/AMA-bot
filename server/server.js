import express from "express";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

const topicStats = {
    navn: 0,
    bosted: 0,
    hobbier: 0,
    frygter: 0
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});