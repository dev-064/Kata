const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.post('/books', bookController.addBook);
router.put('/books/borrow/:isbn',bookController.borrowBook);

module.exports = router;
