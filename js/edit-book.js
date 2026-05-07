// Check if user is authenticated
if (localStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = 'login.html';
}

// Get book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = parseInt(urlParams.get('id'));

if (!bookId) {
    window.location.href = 'catalog.html';
}

// Image upload handling
const coverImageInput = document.getElementById('coverImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const uploadLabel = document.getElementById('uploadLabel');
const removeImageBtn = document.getElementById('removeImageBtn');

let currentImageData = '';

coverImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result;
            previewImg.src = currentImageData;
            imagePreview.style.display = 'block';
            uploadLabel.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

removeImageBtn.addEventListener('click', function() {
    currentImageData = '';
    previewImg.src = '';
    coverImageInput.value = '';
    imagePreview.style.display = 'none';
    uploadLabel.style.display = 'flex';
});

// Load book data
function loadBook() {
    // TODO: Replace with actual API call to your Node.js/Express/MySQL backend
    // Example: fetch('/api/books/' + bookId).then(res => res.json()).then(populateForm)
    
    const books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        alert('Book not found');
        window.location.href = 'catalog.html';
        return;
    }
    
    // Populate form
    document.getElementById('bookId').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('publisher').value = book.publisher;
    document.getElementById('publicationYear').value = book.publicationYear;
    document.getElementById('genre').value = book.genre;
    document.getElementById('description').value = book.description;
    
    // Set image
    if (book.coverImage) {
        currentImageData = book.coverImage;
        previewImg.src = book.coverImage;
        imagePreview.style.display = 'block';
        uploadLabel.style.display = 'none';
    }
    
    // Show form, hide loading
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('editBookForm').style.display = 'block';
}

// Form submission
document.getElementById('editBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const updatedBook = {
        id: bookId,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        publisher: document.getElementById('publisher').value,
        publicationYear: parseInt(document.getElementById('publicationYear').value),
        genre: document.getElementById('genre').value,
        description: document.getElementById('description').value,
        coverImage: currentImageData || 'https://via.placeholder.com/400x600?text=No+Cover'
    };
    
    // TODO: Replace with actual API call to your Node.js/Express/MySQL backend
    // Example:
    // const formDataToSend = new FormData();
    // formDataToSend.append('title', updatedBook.title);
    // ... append all fields
    // if (coverImageInput.files[0]) {
    //     formDataToSend.append('coverImage', coverImageInput.files[0]);
    // }
    // fetch('/api/books/' + bookId, {
    //     method: 'PUT',
    //     body: formDataToSend
    // }).then(res => res.json()).then(data => {
    //     window.location.href = 'catalog.html';
    // });
    
    // Demo: Update in localStorage
    let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
    const index = books.findIndex(b => b.id === bookId);
    if (index !== -1) {
        books[index] = updatedBook;
        localStorage.setItem('libraryBooks', JSON.stringify(books));
    }
    
    // Redirect to catalog
    window.location.href = 'catalog.html';
});

// Load book on page load
document.addEventListener('DOMContentLoaded', loadBook);
