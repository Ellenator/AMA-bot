import express from "express";
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);

const topicStats = {
    personlighed: 0,
    praktisk: 0
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});