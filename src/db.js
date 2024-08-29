import pg from "pg";
import { configDotenv } from "dotenv";

configDotenv();

const LIMIT = 3;

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
async function getAllBooks(offset) {
  try {
    const result = await db.query("SELECT * FROM books LIMIT $1 OFFSET $2", [
      LIMIT,
      offset,
    ]);
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
async function searchBookTitle(title, offset) {
  try {
    const result = await db.query(
      "SELECT * FROM books WHERE title ILIKE ($1) LIMIT $2 OFFSET $3",
      ["%" + title + "%", LIMIT, offset]
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

// // sort books desc
// async function getBooksDesc(offset) {
//   try {
//     const result = await db.query(
//       "SELECT * FROM books ORDER BY grade DESC LIMIT $1 OFFSET $2",
//       [LIMIT, offset]
//     );
//     return result.rows;
//   } catch (err) {
//     console.log(err);
//   }
// }

// // sort books asc
// async function getBooksAsc(offset) {
//   try {
//     const result = await db.query(
//       "SELECT * FROM books ORDER BY grade ASC LIMIT $1 OFFSET $2",
//       [LIMIT, offset]
//     );
//     return result.rows;
//   } catch (err) {
//     console.log(err);
//   }
// }

// // sort books asc
// async function getBooksTop() {
//   try {
//     const result = await db.query(
//       "SELECT * FROM books ORDER BY grade DESC LIMIT 5"
//     );
//     return result.rows;
//   } catch (err) {
//     console.log(err);
//   }
// }

export {
  getAllBooks,
  getBookId,
  addNewBook,
  // getBooksTop,
  // getBooksAsc,
  // getBooksDesc,
  searchBookTitle,
  getReviewBookId,
  addBookReviewId,
  deleteBookId,
};
