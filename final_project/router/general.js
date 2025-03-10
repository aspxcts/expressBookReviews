const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username === "" || password === "") {
      return res.status(400).json({message: "You must provide both a username and a password"});
    }
    if(users.includes(username)) {
      return res.status(409).json({message: "Username already in use"});
    }
    users.push({username: username, password: password});
    return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
    });
    promise.then((result) => {
    return res.status(200).json({ books: result });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[req.params.isbn]), 600);
  });

  const book = await promise;

  if (book) {
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
  // Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.author === authorName
      );
      resolve(filteredBooks);
    }, 600);
  });

  const filteredBooks = await promise;

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

  
  // Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.title === title
      );
      return resolve(filteredBooks);
    }, 600);
  });

  const filteredBooks = await promise;

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
  //  Get book review
  public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.isbn===isbn);
      if (book) {
      const reviews = book.reviews;
      res.send(reviews);
    } else {
      res.send("Book not found");}
  });
  
  module.exports.general = public_users;
