const supertest = require('supertest');
const app = require('../src/app');
const bookService = require('../src/services/bookService');

const request = supertest(app);

// Mock the Book model
jest.mock('../src/services/bookService', () => ({
    addBook: jest.fn(),
    borrowBook: jest.fn(),
    returnBook: jest.fn()
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

        const mockResponse = { ...bookData, _id: 'mockedId', isAvailable: true }

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

describe('Book Controller - borrowBook', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mock call history before each test
    });

    it('should successfully borrow a book and return 200', async () => {
        const isbn = '1234567890345';
        const mockBook = {
            _id: 'mockedId',
            isbn,
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
            isAvailable: false,
        };

        bookService.borrowBook.mockResolvedValue(mockBook); // Mock service response

        const response = await request.put(`/api/books/borrow/${isbn}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(bookService.borrowBook).toHaveBeenCalledWith(isbn);
        expect(response.body).toEqual(mockBook);
    });

    it('should return 400 if the book is not available', async () => {
        const isbn = '1234567890345';

        bookService.borrowBook.mockRejectedValue(new Error('Book not available')); // Mock error

        const response = await request.put(`/api/books/borrow/${isbn}`);

        // Assertions
        expect(response.status).toBe(400);
        expect(bookService.borrowBook).toHaveBeenCalledWith(isbn);
        expect(response.body.message).toBe('Book not available');
    });
});

describe('Book Controller - returnBook', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mock call history before each test
    });

    it('should successfully return a book and return 200', async () => {
        const isbn = '1234567890345';
        const mockBook = {
            _id: 'mockedId',
            isbn,
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
            isAvailable: true,
        };

        bookService.returnBook.mockResolvedValue(mockBook); // Mock service response

        const response = await request.put(`/api/books/return/${isbn}`);

        // Assertions
        expect(response.status).toBe(200);
        expect(bookService.returnBook).toHaveBeenCalledWith(isbn);
        expect(response.body).toEqual(mockBook);
    });

    it('should return 400 if the book is already available', async () => {
        const isbn = '1234567890345';

        bookService.returnBook.mockRejectedValue(new Error('Book is already available')); // Mock error

        const response = await request.put(`/api/books/return/${isbn}`);

        // Assertions
        expect(response.status).toBe(400);
        expect(bookService.returnBook).toHaveBeenCalledWith(isbn);
        expect(response.body.message).toBe('Book is already available');
    });
});