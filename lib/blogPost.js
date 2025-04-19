export function getDisplayTitle(post) {
    if (post.status && post.status !== 'published')
        return `[${post.status.toUpperCase()}] ${post.title}`;
    return post.title;
}