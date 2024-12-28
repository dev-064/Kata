const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Book', bookSchema);
