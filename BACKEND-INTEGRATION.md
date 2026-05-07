# Backend Integration Guide

This guide shows exactly where to integrate your Node.js/Express/MySQL backend.

## Files to Modify

### 1. js/login.js

**Line 8-12:** Replace demo authentication with API call

```javascript
// REPLACE THIS:
if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    window.location.href = 'catalog.html';
}

// WITH THIS:
fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', data.token);
        window.location.href = 'catalog.html';
    } else {
        throw new Error(data.message);
    }
})
.catch(error => {
    errorMessage.textContent = error.message || 'Login failed';
    errorMessage.style.display = 'block';
});
```

---

### 2. js/catalog.js

**Line 40-42:** Replace localStorage with API call to fetch books

```javascript
// REPLACE THIS:
const books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');

// WITH THIS:
fetch('/api/books', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
})
.then(response => response.json())
.then(books => {
    // ... existing display logic
});
```

**Line 86-91:** Replace localStorage with API call to delete book

```javascript
// REPLACE THIS:
let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
books = books.filter(book => book.id !== id);
localStorage.setItem('libraryBooks', JSON.stringify(books));

// WITH THIS:
fetch('/api/books/' + id, {
    method: 'DELETE',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
})
.then(response => response.json())
.then(() => {
    loadBooks(); // Reload the books
});
```

---

### 3. js/add-book.js

**Line 38-56:** Replace localStorage with API call to add book

```javascript
// REPLACE THIS:
let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
books.push(formData);
localStorage.setItem('libraryBooks', JSON.stringify(books));
window.location.href = 'catalog.html';

// WITH THIS:
const formDataToSend = new FormData();
formDataToSend.append('title', formData.title);
formDataToSend.append('author', formData.author);
formDataToSend.append('isbn', formData.isbn);
formDataToSend.append('publisher', formData.publisher);
formDataToSend.append('publicationYear', formData.publicationYear);
formDataToSend.append('genre', formData.genre);
formDataToSend.append('description', formData.description);

// Add image file if exists
if (coverImageInput.files[0]) {
    formDataToSend.append('coverImage', coverImageInput.files[0]);
}

fetch('/api/books', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    },
    body: formDataToSend
})
.then(response => response.json())
.then(data => {
    window.location.href = 'catalog.html';
})
.catch(error => {
    alert('Error adding book: ' + error.message);
});
```

---

### 4. js/edit-book.js

**Line 43-45:** Replace localStorage with API call to fetch book

```javascript
// REPLACE THIS:
const books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
const book = books.find(b => b.id === bookId);

// WITH THIS:
fetch('/api/books/' + bookId, {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    }
})
.then(response => response.json())
.then(book => {
    // ... existing populate form logic
});
```

**Line 90-97:** Replace localStorage with API call to update book

```javascript
// REPLACE THIS:
let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
const index = books.findIndex(b => b.id === bookId);
if (index !== -1) {
    books[index] = updatedBook;
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}

// WITH THIS:
const formDataToSend = new FormData();
formDataToSend.append('title', updatedBook.title);
formDataToSend.append('author', updatedBook.author);
formDataToSend.append('isbn', updatedBook.isbn);
formDataToSend.append('publisher', updatedBook.publisher);
formDataToSend.append('publicationYear', updatedBook.publicationYear);
formDataToSend.append('genre', updatedBook.genre);
formDataToSend.append('description', updatedBook.description);

// Add image file if exists
if (coverImageInput.files[0]) {
    formDataToSend.append('coverImage', coverImageInput.files[0]);
}

fetch('/api/books/' + bookId, {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    },
    body: formDataToSend
})
.then(response => response.json())
.then(data => {
    window.location.href = 'catalog.html';
})
.catch(error => {
    alert('Error updating book: ' + error.message);
});
```

---

## Express Backend Example

Here's a sample Express server structure:

### server.js

```javascript
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('html-version')); // Serve static files

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'library_db'
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'book-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 5000000 } }); // 5MB limit

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length === 0) return res.json({ success: false, message: 'Invalid credentials' });
        
        const user = results[0];
        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (match) {
                const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key');
                res.json({ success: true, token });
            } else {
                res.json({ success: false, message: 'Invalid credentials' });
            }
        });
    });
});

// GET all books
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// GET single book
app.get('/api/books/:id', (req, res) => {
    db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
        res.json(results[0]);
    });
});

// CREATE book
app.post('/api/books', authenticateToken, upload.single('coverImage'), (req, res) => {
    const { title, author, isbn, publisher, publicationYear, genre, description } = req.body;
    const coverImage = req.file ? '/uploads/' + req.file.filename : null;
    
    const query = 'INSERT INTO books (title, author, isbn, publisher, publication_year, genre, description, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [title, author, isbn, publisher, publicationYear, genre, description, coverImage], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, id: result.insertId });
    });
});

// UPDATE book
app.put('/api/books/:id', authenticateToken, upload.single('coverImage'), (req, res) => {
    const { title, author, isbn, publisher, publicationYear, genre, description } = req.body;
    const coverImage = req.file ? '/uploads/' + req.file.filename : req.body.existingImage;
    
    const query = 'UPDATE books SET title = ?, author = ?, isbn = ?, publisher = ?, publication_year = ?, genre = ?, description = ?, cover_image = ? WHERE id = ?';
    
    db.query(query, [title, author, isbn, publisher, publicationYear, genre, description, coverImage, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

// DELETE book
app.delete('/api/books/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### package.json that we might need

```json
{
  "name": "library-catalog-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^5.2.1",
    "mysql": "^2.18.1",
    "body-parser": "^2.2.2",
    "cookie-parser": "^1.4.7",
    "csurf": "^1.11.0",
    "sanitize-html": "^2.17.3"
  }
}

express and mysql are the ones we usually use for each lab, body parser, cookie, csurf, and sanitize were from module 12. 
```


All TODO comments in the JavaScript files mark exactly where to make changes!
