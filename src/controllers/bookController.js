const bookService = require('../services/bookService');

const addBook = async (req, res) => {
    try {
        const book = await bookService.addBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addBook };
