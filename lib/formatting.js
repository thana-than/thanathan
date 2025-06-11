function pageTitle(title) {
    return `${title} @ ThanaThan`;
}

function formatDate(date) {
    date = typeof date === Date ? date : new Date(date);
    const str = date.toLocaleDateString('en-CA');
    if (!str || str === "Invalid Date")
        return null;
    return str;
}

function getCategorySlug(category) {
    const str = category.toLowerCase();
    switch (str) {
        case '':
            return ''
        case 'post':
        case 'blog':
            return 'blog';
        case 'game':
        case 'games':
            return 'games';
        case 'website':
        case 'art':
        case 'video':
            return 'art';

        default:
            return 'art';
    }
}

module.exports = {
    pageTitle,
    formatDate,
    getCategorySlug
};