const Book = require('../models/bookModel');

const addBook = async (bookData) => {

    const { isbn, title, author, publicationYear } = bookData;

    if (!isbn || typeof isbn !== 'string' || isbn.length !== 13) {
        throw new Error('Validation error: ISBN is required, must be a string, and it should be of 13 digits');
    }

    if (!title || typeof title !== 'string') {
        throw new Error('Validation error: Title is required and must be a string.');
    }

    if (!author || typeof author !== 'string') {
        throw new Error('Validation error: Author is required and must be a string.');
    }

    if (!publicationYear || typeof publicationYear !== 'number' || publicationYear > new Date().getFullYear()) {
        throw new Error('Validation error: Publication year is required, must be a number, and cannot be in the future.');
    }

    const existingBook = await Book.findOne({ isbn: isbn });

    if (existingBook) {
        throw new Error('Book already exists');
    }

    return await Book.create(bookData);
};


module.exports = { addBook };
