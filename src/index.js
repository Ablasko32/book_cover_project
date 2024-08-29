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

const LIMIT = 3;

// middlewere body parser, adn static folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * LIMIT;
  const books = await getAllBooks(page, offset);
  res.render("index.ejs", { books: books, page: page });
});

app.post("/add-book", async (req, res) => {
  let imgURl = `https://covers.openlibrary.org/b/isbn/${req.body.isbn}-L.jpg?default=false`;
  try {
    const response = await axios.get(imgURl);
  } catch (err) {
    // default img if err
    imgURl = "/style/images/defaultimg.jpg";
  }

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
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * LIMIT;
  const books = await searchBookTitle(req.body.search, offset);
  res.render("index.ejs", { books: books, page: page });
});

app.post("/desc", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * LIMIT;
  const books = await getBooksDesc(offset);
  res.render("index.ejs", { books: books, page: page });
});

app.post("/asc", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * LIMIT;
  const books = await getBooksAsc(offset);
  res.render("index.ejs", { books: books, page: page });
});

app.post("/top", async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const books = await getBooksTop();
  res.render("index.ejs", { books: books, page: page });
});

app.listen(port, () => {
  console.log(`Server running on localhost port: ${port}`);
});
