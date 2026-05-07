// Initialize sample data for demo purposes
// Run this once to populate the catalog with sample books

const sampleBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        publisher: "Scribner",
        publicationYear: 1925,
        genre: "Classic Fiction",
        description: "A story of decadence and excess, Gatsby explores themes of idealism, resistance to change, and social upheaval.",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        publisher: "J.B. Lippincott & Co.",
        publicationYear: 1960,
        genre: "Classic Fiction",
        description: "A gripping tale of racial inequality and childhood innocence in the American South.",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        publisher: "Secker & Warburg",
        publicationYear: 1949,
        genre: "Dystopian Fiction",
        description: "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
        coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop"
    }
];

// Initialize sample data
localStorage.setItem('libraryBooks', JSON.stringify(sampleBooks));
console.log('Sample data initialized! Reload the catalog page to see the books.');
