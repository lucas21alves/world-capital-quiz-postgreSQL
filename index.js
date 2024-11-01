import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Fill in all the necessary information to connect to the desired Postgres database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "dataBASE",
  port: 5432,
});

// Connecting our PG Database
db.connect();

let quiz = [];

//Reading all the rows from our database
db.query("SELECT * from Capitals", (err, res) => {
  if (err) {
      console.error("Error executing query", err.stack);
  } else {
      quiz = res.rows;
  }
  db.end();
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

let totalCorrect = 0;

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
