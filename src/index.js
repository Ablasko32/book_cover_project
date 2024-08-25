import express from "express";
import bodyParser from "body-parser";
import {
  getAllBooks,
  getBookId,
  getBooksAsc,
  getBooksDesc,
  getBooksTop,
  getReviewBookId,
  searchBookTitle,
  deleteBookId,
  addBookReviewId,
  addNewBook,
} from "./db.js";
import axios from "axios";

const app = express();
const port = 3000;

// middlewere body parser, adn static folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const books = await getAllBooks();
  res.render("index.ejs", { books: books });
});

app.post("/add-book", async (req, res) => {
  const imgURl = `https://covers.openlibrary.org/b/isbn/${req.body.isbn}-L.jpg`;

  await addNewBook(
    req.body.title,
    req.body.isbn,
    req.body.date,
    req.body.grade,
    imgURl
  );
  res.redirect("/");
});

app.get("/notes/:id", async (req, res) => {
  const book = await getBookId(req.params.id);
  const review = await getReviewBookId(req.params.id);

  res.render("notes.ejs", { book: book, review: review });
});

app.post("/delete/:id", async (req, res) => {
  await deleteBookId(req.params.id);
  res.redirect("/");
});

app.post("/add-review/:id", async (req, res) => {
  await addBookReviewId(req.params.id, req.body.review);
  res.redirect("/");
});

app.post("/edit/:id", async (req, res) => {
  const book = await getBookId(req.params.id);
  const edit = true;
  res.render("notes.ejs", { book: book, edit: edit });
});

app.post("/search", async (req, res) => {
  const books = await searchBookTitle(req.body.search);
  res.render("index.ejs", { books: books });
});

app.post("/desc", async (req, res) => {
  const books = await getBooksDesc();
  res.render("index.ejs", { books: books });
});

app.post("/asc", async (req, res) => {
  const books = await getBooksAsc();
  res.render("index.ejs", { books: books });
});

app.post("/top", async (req, res) => {
  const books = await getBooksTop();
  res.render("index.ejs", { books: books });
});

app.listen(port, () => {
  console.log(`Server running on localhost port: ${port}`);
});
