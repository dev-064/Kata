require('dotenv').config();

const mongoose = require('mongoose');
const Book = require('../src/models/bookModel');
const bookService = require('../src/services/bookService');

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    // Clean up and close the connection
    await mongoose.connection.close();
});

describe('Book Service - addBook', () => {
    it('should successfully add a book', async () => {
        const bookData = {
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
        };

        const savedBook = await bookService.addBook(bookData);

        expect(savedBook).toHaveProperty('_id');
        expect(savedBook.isbn).toBe(bookData.isbn);
        expect(savedBook.title).toBe(bookData.title);
        expect(savedBook.author).toBe(bookData.author);
        expect(savedBook.publicationYear).toBe(bookData.publicationYear);
        expect(savedBook.isAvailable).toBe(true);
    });

    it('should throw an error if the book already exists', async () => {
        const bookData = {
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
        };

        await expect(bookService.addBook(bookData)).rejects.toThrow('Book already exists');
    });
});
