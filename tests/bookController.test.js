const mongoose = require('mongoose');
const Book = require('../src/models/bookModel');
const bookService = require('../src/services/bookService');

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGO_URI);
});

afterAll(async () => {
    // Clean up and close the connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});