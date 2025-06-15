const Book = require("../models/book.model");
const sendEmail = require("../middleware/send-email.middleware");

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
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found!" });
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
    const { title, author, year } = req.body;
    
    // Get the next available ID
    const nextId = await Book.getNextId();
    
    const book = new Book({
      id: nextId,
      title,
      author,
      year,
      createdBy: req.user.id // Fixed: using id instead of userId
    });

    const savedBook = await book.save();

    // ✅ Send email notification (fail silently if it fails)
    try {
      await sendEmail(
        {
          title: savedBook.title,
          author: savedBook.author,
          year: savedBook.year,
        },
        req.user.email // Send to the authenticated user
      );
    } catch (emailErr) {
      console.error("❌ Email notification failed:", emailErr);
    }

    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(400).json({ error: err.message });
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
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found!" });
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
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found!" });
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
