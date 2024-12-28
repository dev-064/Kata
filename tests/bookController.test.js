const supertest = require('supertest');
const app = require('../src/app');
const bookService = require('../src/services/bookService');

const request = supertest(app);

// Mock the Book model
jest.mock('../src/services/bookService', () => ({
    addBook: jest.fn()
}));

jest.mock('mongoose', () => ({
    connect: jest.fn(() => Promise.resolve('Mocked MongoDB Connection')),
}));


describe('Book Controller - addBook', () => {
    beforeEach(async () => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should successfully add a book and return 201', async () => {
        const bookData = {
            isbn: '1234567890345',
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
        };

        const mockResponse = { ...bookData, _id: 'mockedId' ,isAvailable : true}

        bookService.addBook.mockResolvedValue(mockResponse);

        const response = await request.post('/api/books').send(bookData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.isbn).toBe(bookData.isbn);
        expect(response.body.title).toBe(bookData.title);
        expect(response.body.author).toBe(bookData.author);
        expect(response.body.publicationYear).toBe(bookData.publicationYear);
        expect(response.body.isAvailable).toBe(true);
    });

    it('should return 400 if the book already exists', async () => {
        const bookData = {
            isbn: '1234567890345',
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
        };

        bookService.addBook.mockRejectedValue(new Error('Book already exists'));

        const response = await request.post('/api/books').send(bookData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Book already exists');
    });
});
