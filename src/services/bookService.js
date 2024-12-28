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




module.exports = { addBook };
