const express = require('express');

const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;

let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {

    const username = req.body.username;

    const password = req.body.password;

    if (!username || !password) {

        return res.status(400).json({
            message: "Username and password are required"
        });

    }

    if (users.some(user => user.username === username)) {

        return res.status(409).json({
            message: "Username already exists"
        });

    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });

});


// Task 1
// Get the book list available in the shop

public_users.get('/', function (req, res) {

    res.send(JSON.stringify(books, null, 2));

});


// Task 2
// Get book details based on ISBN

public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn], null, 2));

});


// Task 3
// Get book details based on author

public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const booksByAuthor = {};

    const keys = Object.keys(books);

    keys.forEach((key) => {

        if (books[key].author === author) {

            booksByAuthor[key] = books[key];

        }

    });

    res.send(JSON.stringify(booksByAuthor, null, 2));

});


// Task 4
// Get all books based on title

public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const booksByTitle = {};

    const keys = Object.keys(books);

    keys.forEach((key) => {

        if (books[key].title === title) {

            booksByTitle[key] = books[key];

        }

    });

    res.send(JSON.stringify(booksByTitle, null, 2));

});


// Task 5
// Get book review

public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn].reviews, null, 2));

});


// Task 10
// Get all books using Axios and async/await

public_users.get('/async/books', async function (req, res) {

    try {

        const response = await axios.get('http://localhost:5000/');

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching books"
        });

    }

});


// Task 11
// Get book details by ISBN using Axios and Promise

public_users.get('/async/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {

            res.json(response.data);

        })
        .catch(error => {

            res.status(500).json({
                message: "Error fetching book"
            });

        });

});


// Task 12
// Get books by author using Axios and async/await

public_users.get('/async/author/:author', async function (req, res) {

    const author = req.params.author;

    try {

        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching books by author"
        });

    }

});


// Task 13
// Get books by title using Axios and async/await

public_users.get('/async/title/:title', async function (req, res) {

    const title = req.params.title;

    try {

        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching books by title"
        });

    }

});


module.exports.general = public_users;