const Book = require('../src/models/bookModel');
const bookService = require('../src/services/bookService');

// Mock the Book model
jest.mock('../src/models/bookModel', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));


describe('Book Service - addBook', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    
    it('should successfully add a book', async () => {
        const bookData = {
            isbn: '1234567890345',
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
        };

        // Mock the behavior of findOne and create
        Book.findOne.mockResolvedValue(null); // Simulate no book with the given ISBN exists
        Book.create.mockResolvedValue({ ...bookData, _id: 'mockedId', isAvailable: true });

        const savedBook = await bookService.addBook(bookData);

        // Assertions
        expect(Book.findOne).toHaveBeenCalledWith({ isbn: bookData.isbn });
        expect(Book.create).toHaveBeenCalledWith(bookData);
        expect(savedBook).toHaveProperty('_id', 'mockedId');
        expect(savedBook.isbn).toBe(bookData.isbn);
        expect(savedBook.isAvailable).toBe(true);
    });

    it('should throw an error if the book already exists', async () => {
        const bookData = {
            isbn: '1234567890345',
            title: 'Node.js Basics',
            author: 'John Doe',
            publicationYear: 2023,
        };

        // Mock the behavior of findOne to simulate an existing book
        Book.findOne.mockResolvedValue(bookData);

        await expect(bookService.addBook(bookData)).rejects.toThrow('Book already exists');

        // Assertions
        expect(Book.findOne).toHaveBeenCalledWith({ isbn: bookData.isbn });
        expect(Book.create).not.toHaveBeenCalled();
    });

    it('should throw an error if required fields are missing or invalid', async () => {
        const booksData = [
            {
                //isbn is missing
                title: 'Node.js Basics',
                author: 'John Doe',
                publicationYear: 2023,
            },
            {
                //title is missing
                isbn: '1234567890345',
                author: 'John Doe',
                publicationYear: 2023,
            },
            {
                //author is missing
                isbn: '1234567890345',
                title: 'Node.js Basics',
                publicationYear: 2023,
            },
            {
                //publicationYear is missing
                isbn: '1234567890345',
                title: 'Node.js Basics',
                author: 'John Doe',
            },
            {
                //isbn is not of 13 digits
                isbn: '123456789034',
                title: 'Node.js Basics',
                author : "John Doe",
                publicationYear: 2023,
            },
            {
                //publication year is in the future
                isbn: '1234567890345',
                title: 'Node.js Basics',
                author: 'John Doe',
                publicationYear: 2023
            },
        ];

        for (let i = 0;i<booksData.length;i++) {
            expect(Book.findOne).not.toHaveBeenCalled();
            expect(Book.create).not.toHaveBeenCalled();
            await expect(bookService.addBook(booksData[i])).rejects.toThrow(/Validation/); // Expect a validation error
        }
    });
});
