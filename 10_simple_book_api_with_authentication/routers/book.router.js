const express = require("express");
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/book.controller");
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.use(auth);

router.get("/", getBooks);

router.get("/:id", getBook);

router.post("/", createBook);

router.patch("/:id", updateBook);

router.delete("/:id", deleteBook);

module.exports = router;