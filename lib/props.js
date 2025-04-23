export function getDisplayTitle(props) {
    if (!props?.title) {
        props = props[Object.keys(props)[0]];
    }

    if (!props)
        return null;

    if (props.status && props.status !== 'published')
        return `[${props.status.toUpperCase()}] ${props.title}`;
    return props.title;
}

export function getSubHead(props) {
    if (!props?.subHead) {
        props = props[Object.keys(props)[0]];
    }

    if (!props)
        return null;

    return props.subHead;
}