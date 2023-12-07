const express = require("express");
const app = express();
const cors = require("cors")
app.use(express.json()); // for parsing application/json
app.use(cors())

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "library.chjardghcmom.us-east-2.rds.amazonaws.com",
  database: "books",
  password: "testpass1",
  port: 5432,
});

// Test DB connection


app.post("/books", async (req, res) => {
    const { title, author_id, publication_year } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author_id, publication_year) VALUES ($1, $2, $3) RETURNING *",
      [title, author_id, publication_year]
    );
    res.json(result.rows[0]);
  });

app.get("/books", async (req, res) => {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  });

app.put("/books/:id", async (req, res) => {
    const { id } = req.params;
    const { title, author_id, publication_year } = req.body;
    const result = await pool.query(
      "UPDATE books SET title = $1, author_id = $2, publication_year = $3 WHERE id = $4 RETURNING *",
      [title, author_id, publication_year, id]
    );
    res.json(result.rows[0]);
  });

  app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    res.json({ message: "Book deleted" });
  });

  app.listen(3000, () => {
    // console.log("Server is running on port 3000");
   });