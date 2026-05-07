// Check if user is authenticated
if (localStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = 'login.html';
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

// Form submission
document.getElementById('addBookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        id: Date.now(), // Generate unique ID (in production, let MySQL auto-increment handle this)
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
    // formDataToSend.append('title', formData.title);
    // formDataToSend.append('author', formData.author);
    // ... append all fields
    // if (coverImageInput.files[0]) {
    //     formDataToSend.append('coverImage', coverImageInput.files[0]);
    // }
    // fetch('/api/books', {
    //     method: 'POST',
    //     body: formDataToSend
    // }).then(res => res.json()).then(data => {
    //     window.location.href = 'catalog.html';
    // });
    
    // Demo: Store in localStorage
    let books = JSON.parse(localStorage.getItem('libraryBooks') || '[]');
    books.push(formData);
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    
    // Redirect to catalog
    window.location.href = 'catalog.html';
});

// Set default year
document.getElementById('publicationYear').value = new Date().getFullYear();
