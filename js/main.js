// Function to fetch and display posts
async function loadPosts() {
    try {
        const response = await fetch('/_posts');
        const posts = await response.json();
        const contentDiv = document.getElementById('content');
        
        posts.forEach(post => {
            const postElement = createPostElement(post);
            contentDiv.appendChild(postElement);
        });
    } catch (error) {
        console.log('Error loading posts:', error);
    }
}

// Function to create post element
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    
    const html = `
        <div class="p-6">
            ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}" class="w-full h-48 object-cover mb-4">` : ''}
            <h2 class="text-xl font-semibold mb-2">${post.title}</h2>
            <div class="text-gray-600 text-sm mb-4">${new Date(post.date).toLocaleDateString()}</div>
            <div class="prose">${post.body}</div>
        </div>
    `;
    
    article.innerHTML = html;
    return article;
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', loadPosts);