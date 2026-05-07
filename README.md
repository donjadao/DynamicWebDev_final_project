# DynamicWebDev_final_project
Group Members: Khup Khai Dopmul, Luis Leal, Valerie McClung, Don Dao


## Color Palette (OU colors lol)

- **Cream** (#F0EBC4) - PANTONE® 468
- **Crimson Red** (#841617) - PANTONE® 201
- **Dark Crimson** (#4e0002) - PANTONE® 4102
- **Sky** (#bcdceb) - PANTONE® 290
- **Leaf** (#8ca57d) - PANTONE® 4206
- **Stone** (#beb4a5) - PANTONE® 4267

- ## File Structure

```
html-version/
├── index.html          # Home page
├── login.html          # Admin login page
├── catalog.html        # Book catalog display
├── add-book.html       # Add new book form
├── edit-book.html      # Edit existing book form
├── css/
│   └── styles.css      # All styling with Pantone colors
├── js/
│   ├── login.js        # Login authentication logic
│   ├── catalog.js      # Display and delete books
│   ├── add-book.js     # Add book form handler
│   └── edit-book.js    # Edit book form handler
└── README.md           # This file

### 1. Demo Mode (No Backend)

To test the frontend without a backend:

1. Open `index.html` in your web browser
2. Use demo credentials:
   - Username: `admin`
   - Password: `admin123`
3. Data is stored in browser localStorage

### 2. Integration with Node.js/Express/MySQL Backend

Replace the TODO comments in the JavaScript files with actual API calls:

#### Backend API Endpoints Needed:

```javascript
POST   /api/login                 // User authentication
POST   /api/books                 // Create new book
GET    /api/books                 // Get all books
GET    /api/books/:id             // Get single book
PUT    /api/books/:id             // Update book
DELETE /api/books/:id             // Delete book
POST   /api/upload                // Upload book cover image
```

#### Example Integration we can do: 

**login.js** - Replace demo authentication:
```javascript
// Replace this:
if (username === 'admin' && password === 'admin123') { ... }

// With this:
fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        localStorage.setItem('authToken', data.token);
        window.location.href = 'catalog.html';
    } else {
        errorMessage.textContent = data.message;
        errorMessage.style.display = 'block';
    }
});
```

**catalog.js** - Replace localStorage with API:
```javascript
// Replace this:
const books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');

// With this:
fetch('/api/books')
    .then(res => res.json())
    .then(books => displayBooks(books));
```

**add-book.js** - Replace localStorage with FormData API:
```javascript
const formData = new FormData();
formData.append('title', document.getElementById('title').value);
formData.append('author', document.getElementById('author').value);
formData.append('isbn', document.getElementById('isbn').value);
formData.append('publisher', document.getElementById('publisher').value);
formData.append('publicationYear', document.getElementById('publicationYear').value);
formData.append('genre', document.getElementById('genre').value);
formData.append('description', document.getElementById('description').value);

if (coverImageInput.files[0]) {
    formData.append('coverImage', coverImageInput.files[0]);
}

fetch('/api/books', {
    method: 'POST',
    body: formData
})
.then(res => res.json())
.then(() => window.location.href = 'catalog.html');
```

## Security Features we should include

### XSS Prevention
- All user inputs are properly escaped when rendered
- Content Security Policy ready
- No `innerHTML` with unescaped user data

### SQL Injection Prevention (Backend)
When implementing our MySQL backend, use parameterized queries:

```javascript
// Good - Parameterized query
db.query('SELECT * FROM books WHERE id = ?', [bookId]);

// Bad - String concatenation
db.query('SELECT * FROM books WHERE id = ' + bookId);
```

### Input Validation
- All forms have HTML5 validation (required, min/max, type)
- Add server-side validation in your Express routes
- Sanitize inputs before database storage

## MySQL Database example Schema, not sure what else we will need to include, but this seems to be everything. 

```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Image Upload Handling

For production, but I don't think this will be neccessary, we can use use the same picture for all the books as an example. But if we do we can:

1. **Store images on server** instead of base64 in database
2. **Use multer** for Express file uploads
3. **Resize images** to optimize storage
4. **Validate file types** (PNG, JPG only)
5. **Limit file size** (5MB max recommended)

Example Express route:
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/books', upload.single('coverImage'), (req, res) => {
    const imagePath = req.file ? req.file.path : null;
    // Save book data + imagePath to MySQL
});
```

## Development Notes

### Demo Credentials
- Username: `admin`
- Password: `admin123`

### localStorage Keys
- `isAuthenticated` - Auth status
- `authToken` - Session token
- `libraryBooks` - Book data (demo mode)

## Next Steps

1. Set up Node.js/Express server
2. Create MySQL database and tables
3. Replace localStorage code with fetch() API calls
4. Implement proper authentication (JWT tokens)
5. Add server-side input validation
6. Set up file upload handling
7. Deploy to production server??????? prolly not

## Production Checklist

- [ ] Replace demo authentication with real backend
- [ ] Implement JWT token authentication
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Add CSRF protection
- [ ] Enable HTTPS
- [ ] Add server-side input validation
- [ ] Set up proper error handling
