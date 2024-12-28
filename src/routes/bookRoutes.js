const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

router.post('/books', bookController.addBook);

module.exports = router;
