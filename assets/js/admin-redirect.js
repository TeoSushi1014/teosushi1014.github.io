// Handle admin redirect
document.addEventListener('DOMContentLoaded', () => {
    const adminLinks = document.querySelectorAll('a[href="/admin/login"]');
    
    adminLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if user is already logged in
            const isLoggedIn = localStorage.getItem('adminToken');
            
            if (isLoggedIn) {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/admin/login';
            }
        });
    });
}); 