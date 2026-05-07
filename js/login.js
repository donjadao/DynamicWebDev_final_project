// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // TODO: Replace with actual API call to your Node.js/Express backend
    // Example: fetch('/api/login', { method: 'POST', body: JSON.stringify({username, password}) })
    
    // Demo authentication (replace this with actual backend authentication)
    if (username === 'admin' && password === 'admin123') {
        // Store authentication token (in production, use httpOnly cookies)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        // Redirect to catalog
        window.location.href = 'catalog.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.style.display = 'block';
    }
});
