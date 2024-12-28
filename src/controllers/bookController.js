const bookService = require('../services/bookService');

const addBook = async (req, res) => {
    try {
        const book = await bookService.addBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const borrowBook = async (req, res) => {
    try {
        const book = await bookService.borrowBook(req.params.isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const returnBook = async (req, res) => {
    try {
        const book = await bookService.returnBook(req.params.isbn);
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { addBook, borrowBook, returnBook };
