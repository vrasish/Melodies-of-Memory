// Blog management for Research Blog page
let blogPosts = JSON.parse(localStorage.getItem('melodiesBlogPosts')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPage();
    displayBlogPosts();
});

function initializeBlogPage() {
    // Set up form submission
    const form = document.getElementById('blogForm');
    form.addEventListener('submit', handleBlogSubmit);

    // Set default date to today
    const dateInput = document.getElementById('postDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

function handleBlogSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const blogPost = {
        id: Date.now(),
        title: formData.get('postTitle'),
        date: formData.get('postDate'),
        week: parseInt(formData.get('postWeek')),
        content: formData.get('postContent'),
        tags: formData.get('postTags').split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: new Date().toLocaleString()
    };

    // Add to blog posts array
    blogPosts.unshift(blogPost); // Add to beginning for newest first
    
    // Save to localStorage
    localStorage.setItem('melodiesBlogPosts', JSON.stringify(blogPosts));
    
    // Update display
    displayBlogPosts();
    
    // Reset form
    e.target.reset();
    document.getElementById('postDate').value = new Date().toISOString().split('T')[0];
    
    // Show success message
    showNotification('Reflection published successfully!', 'success');
}

function displayBlogPosts() {
    const container = document.getElementById('blogPostsContainer');
    
    if (blogPosts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <h4>No reflections yet</h4>
                <p>Start documenting your research journey by adding your first weekly reflection above.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    blogPosts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post';
        postElement.innerHTML = `
            <div class="blog-post-header">
                <h4>${post.title}</h4>
                <div class="blog-post-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="post-week">Week ${post.week}</span>
                </div>
            </div>
            <div class="blog-post-content">
                ${formatContent(post.content)}
            </div>
            ${post.tags.length > 0 ? `
                <div class="blog-post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="blog-post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">Edit</button>
                <button class="btn-delete" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        container.appendChild(postElement);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatContent(content) {
    // Convert line breaks to HTML
    return content.replace(/\n/g, '<br>');
}

function editPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Fill form with post data
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postWeek').value = post.week;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postTags').value = post.tags.join(', ');
    
    // Remove the post from the array (will be re-added when form is submitted)
    blogPosts = blogPosts.filter(p => p.id !== postId);
    localStorage.setItem('melodiesBlogPosts', JSON.stringify(blogPosts));
    
    // Update display
    displayBlogPosts();
    
    // Scroll to form
    document.querySelector('.blog-form-container').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Post loaded for editing', 'success');
}

function deletePost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    if (confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
        blogPosts = blogPosts.filter(p => p.id !== postId);
        localStorage.setItem('melodiesBlogPosts', JSON.stringify(blogPosts));
        displayBlogPosts();
        showNotification('Post deleted successfully', 'success');
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
