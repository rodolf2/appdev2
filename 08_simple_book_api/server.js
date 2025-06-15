const express = require('express');
const app = express();

// Middleware to parse JSON in request body
app.use(express.json());

// In-memory book collection
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' }
];

// 1. GET / - Welcome message
app.get('/', (req, res) => {
    res.send('Simple Book API using Node.js and Express');
});

// 2. GET /api/books - Get all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

// 3. GET /api/books/:id - Get a single book by ID
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
});

// 4. POST /api/books - Add a new book
app.post('/api/books', (req, res) => {
    if (!req.body.title || !req.body.author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: req.body.title,
        author: req.body.author
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// 5. PATCH /api/books/:id - Update a book
app.patch('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (req.body.title) book.title = req.body.title;
    if (req.body.author) book.author = req.body.author;

    res.json(book);
});

// 6. DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
