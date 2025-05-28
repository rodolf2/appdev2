const mongoose = require('mongoose');
const Book = require('./models/book.model');
require('dotenv').config();

async function clearBooks() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete all books
        const result = await Book.deleteMany({});
        console.log(`Deleted ${result.deletedCount} books`);

        console.log('All books have been removed');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

clearBooks(); 