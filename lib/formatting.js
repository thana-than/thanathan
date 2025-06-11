export function pageTitle(title) {
    return `${title} @ ThanaThan`;
}

export function formatDate(date) {
    date = typeof date === Date ? date : new Date(date);
    const str = date.toLocaleDateString('en-CA');
    if (!str || str === "Invalid Date")
        return null;
    return str;
}