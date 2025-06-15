const Book = require("../models/book.model");

const getBooks = async (req, res) => {
    try {
        const books = await Book.find({}).sort({ id: 1 });
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
        const book = await Book.findOne({ id: parseInt(id) });
        if (!book) return res.status(404).json({ success: false, message: "Book not found!" });
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
        const nextId = await Book.getNextId();
        const book = await Book.create({
            id: nextId,
            title: req.body.title,
            author: req.body.author
        });
        
        res.status(201).json({ 
            success: true, 
            message: "Book is successfully added!",
            book: book 
        });
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
        const book = await Book.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: { title: req.body.title, author: req.body.author } },
            { new: true }
        );
        if (!book) return res.status(404).json({ success: false, message: "Book not found!" });
        res.json({ success: true, book: book });
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
        const book = await Book.findOneAndDelete({ id: parseInt(id) });
        if (!book) return res.status(404).json({ success: false, message: "Book not found!" });
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