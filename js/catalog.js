// Check authentication and render header buttons
function checkAuth() {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const headerButtons = document.getElementById('headerButtons');
    
    if (isAuth) {
        headerButtons.innerHTML = `
            <a href="add-book.html" class="btn btn-white">
                <svg class="icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Book
            </a>
            <button onclick="handleLogout()" class="btn btn-dark-crimson">
                <svg class="icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
            </button>
        `;
        document.getElementById('firstBookBtn').style.display = 'inline-flex';
    } else {
        headerButtons.innerHTML = `
            <a href="login.html" class="btn btn-white">Admin Login</a>
        `;
    }
    
    return isAuth;
}

function handleLogout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

// Load and display books
function loadBooks() {
    // TODO: Replace with actual API call to your Node.js/Express/MySQL backend
    // Example: fetch('/api/books').then(res => res.json()).then(displayBooks)
    
    const books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
    const bookGrid = document.getElementById('bookGrid');
    const emptyState = document.getElementById('emptyState');
    const isAuth = checkAuth();
    
    if (books.length === 0) {
        emptyState.style.display = 'block';
        bookGrid.innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    bookGrid.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.coverImage || 'https://via.placeholder.com/400x600?text=No+Cover'}" alt="${book.title}">
            <div class="book-card-content">
                <h3>${book.title}</h3>
                <p class="book-card-author">by ${book.author}</p>
                <div class="book-card-details">
                    <p><span>ISBN:</span> ${book.isbn}</p>
                    <p><span>Publisher:</span> ${book.publisher}</p>
                    <p><span>Year:</span> ${book.publicationYear}</p>
                    <p><span>Genre:</span> ${book.genre}</p>
                </div>
                <p class="book-card-description">${book.description}</p>
                ${isAuth ? `
                    <div class="book-card-actions">
                        <a href="edit-book.html?id=${book.id}" class="btn btn-leaf btn-flex">
                            <svg class="icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </a>
                        <button onclick="deleteBook(${book.id})" class="btn btn-primary btn-flex">
                            <svg class="icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    // TODO: Replace with actual API call to your backend
    // Example: fetch('/api/books/' + id, { method: 'DELETE' })
    
    let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
    books = books.filter(book => book.id !== id);
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    loadBooks();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBooks);
