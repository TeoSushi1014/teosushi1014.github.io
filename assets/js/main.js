async function loadPosts() {
    try {
        const marked = await import('https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js');
        const response = await fetch('https://api.github.com/repos/TeoSushi1014/teosushi1014.github.io/contents/_posts');
        const posts = await response.json();
        
        const content = document.getElementById('content');
        content.innerHTML = '';

        for (const post of posts) {
            const postContent = await fetch(post.download_url);
            const postText = await postContent.text();
            const postData = parseMarkdown(postText);
            
            content.innerHTML += `
                <article class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-4">${postData.title}</h2>
                    <div class="prose max-w-none">${marked.parse(postData.content)}</div>
                    <div class="text-sm text-gray-500 mt-4">${new Date(postData.date).toLocaleDateString()}</div>
                </article>
            `;
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function parseMarkdown(text) {
    const frontMatter = text.split('---')[1];
    const content = text.split('---')[2];
    
    const metadata = {};
    frontMatter.split('\n').forEach(line => {
        if (line.includes(':')) {
            const [key, value] = line.split(':');
            metadata[key.trim()] = value.trim().replace(/"/g, '');
        }
    });

    return {
        title: metadata.title || 'Untitled',
        date: metadata.date || 'No date',
        content: content || 'No content'
    };
}

document.addEventListener('DOMContentLoaded', loadPosts);
