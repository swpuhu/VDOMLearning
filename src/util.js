export function flatten(arr) {
    return [...arr];
}

export function h(tag, props = {}, ...children) {
    return {
        tag,
        props,
        children: flatten(children)
    }
}

export function createElement(vdom) {
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom);
    }

    const {tag, props, children} = vdom;

    const element = document.createElement(tag);

    for (let key in props) {
        element.setAttribute(key, props[key]);
    }

    children.map(createElement).forEach(element.appendChild.bind(element));
    return element;
}

