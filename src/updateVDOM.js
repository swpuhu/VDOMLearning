import {h, createElement} from './util';

export default function () {
    const nodePatchTypes = {
        CREATE: 'create node',
        REMOVE: 'remove node',
        REPLACE: 'replace node',
        UPDATE: 'update node'
    };

    const propPatchTypes = {
        REMOVE: 'remove prop',
        UPDATE: 'update prop'
    };

    let state = {
        nums: 5
    };

    let vdom = h(
        'div',
        null,
        'Hello World',
        h(
            'ul',
            null,
            h(
                'li',
                null,
            )
        )
    )
}