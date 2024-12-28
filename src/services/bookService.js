const Book = require('../models/bookModel');
const validations = require("../utils/validations")

const addBook = async (bookData) => {

    validations.addBookValidations(bookData);

    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
        throw new Error('Book already exists');
    }

    return await Book.create(bookData);
};


const borrowBook = async (isbn) => {
    validations.borrowAndReturnBookValidations(isbn);

    const book = await Book.findOne({ isbn, isAvailable: true });
    if (!book) {
        throw new Error('Book not available');
    }

    book.isAvailable = false;
    await book.save();

    return book;
};

const returnBook = async (isbn) => {
    validations.borrowAndReturnBookValidations(isbn);

    const book = await Book.findOne({ isbn, isAvailable: false });
    if (!book) {
        throw new Error('Book is already available');
    }

    book.isAvailable = true;
    await book.save();

    return book
}

const getAvailableBooks = async () => {

    const book = await Book.find({ isAvailable: true });
    if (book.length === 0) {
        throw new Error('There are no available books');
    }

    return book
}



module.exports = { addBook, borrowBook, returnBook, getAvailableBooks };
