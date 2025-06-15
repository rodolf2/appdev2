const Book = require("../models/book.model");

const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.json({ books: books, success: true });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) return res.json({ success: false, message: "Book not found!" });
        res.json({ book: book, success: true });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createBook = async (req, res) => {
    try {
        const product = await Book.create(req.body);
        res.json({ success: true, message: "Book is successfully added!" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndUpdate(id, req.body);
        if (!book) return res.json({ success: false, message: "Book not found!" });
        const updatedBook = await Book.findById(id);
        res.json({ success: true, book: updatedBook });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);
        if (!book) return res.json({ success: false, message: "Book not found!" });
        res.json({ success: true, message: "Book is successfully deleted!" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
};