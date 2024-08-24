import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

const db = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});
db.connect();

// query functions
// add new
async function addNewBook(title, isbn, reading_date, grade, img_url) {
  try {
    const reuslt = await db.query(
      "INSERT INTO books(title,isbn,reading_date,grade,img_url) VALUES ($1,$2,$3,$4,$5)",
      [title, isbn, reading_date, grade, img_url]
    );
    return reuslt.rows;
  } catch (err) {
    console.log(err);
  }
}

// query all books
async function getAllBooks() {
  try {
    const result = await db.query("SELECT * FROM books");
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

// querry specific book
async function getBookId(id) {
  try {
    const result = await db.query("SELECT * FROM books WHERE books.id=$1", [
      id,
    ]);

    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
}
// delet book by id
async function deleteBookId(id) {
  try {
    await db.query("DELETE FROM books WHERE id=$1;", [id]);
  } catch (err) {
    console.log(err);
  }
}

// add book review
async function addBookReviewId(id, review) {
  try {
    const result = await db.query(
      "INSERT INTO reviews(review,book_id) VALUES ($1,$2)",
      [review, id]
    );
  } catch (err) {
    console.log(err);
  }
}
// get book review by id
async function getReviewBookId(id) {
  try {
    const result = await db.query("SELECT * FROM reviews WHERE book_id=$1", [
      id,
    ]);

    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
}

// search book by title
async function searchBookTitle(title) {
  try {
    const result = await db.query(
      "SELECT * FROM books WHERE title ILIKE ($1)",
      ["%" + title + "%"]
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

// sort books desc
async function getBooksDesc() {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY grade DESC");
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

// sort books asc
async function getBooksAsc() {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY grade ASC");
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

// sort books asc
async function getBooksTop() {
  try {
    const result = await db.query(
      "SELECT * FROM books ORDER BY grade DESC LIMIT 5"
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

const app = express();
const port = 3000;

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
