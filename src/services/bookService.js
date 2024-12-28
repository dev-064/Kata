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
    validations.borrowBookValidations(isbn);

    const book = await Book.findOne({ isbn, isAvailable: true });
    if (!book) {
        throw new Error('Book not available');
    }

    book.isAvailable = false;
    await book.save();

    return book;
};



module.exports = { addBook,borrowBook };
