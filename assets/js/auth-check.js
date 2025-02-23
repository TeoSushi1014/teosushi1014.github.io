// Check authentication status
function checkAuth() {
    const adminToken = localStorage.getItem('adminToken');
    const currentPath = window.location.pathname;
    
    // List of protected routes that require authentication
    const protectedRoutes = [
        '/admin/dashboard',
        '/admin/dashboard/',
        '/admin/projects',
        '/admin/settings'
    ];
    
    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    
    if (isProtectedRoute && !adminToken) {
        // Redirect to login if not authenticated
        window.location.href = '/admin/login';
        return false;
    }
    
    // If on login page and already authenticated, redirect to dashboard
    if (currentPath === '/admin/login' && adminToken) {
        window.location.href = '/admin/dashboard';
        return false;
    }
    
    return true;
}

// Run auth check immediately
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Listen for storage changes (in case token is removed in another tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'adminToken' && !e.newValue) {
            checkAuth();
        }
    });
}); 