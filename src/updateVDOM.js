import { h, createElement } from './util';

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
    let timer;
    let preVDom;
    function view() {
        return h(
            'div',
            null,
            'Hello World',
            h(
                'ul',
                null,
                h(
                    'li',
                    null,
                    () => {
                        let array = [];
                        for (let i = 0; i < state.nums; i++) {
                            array.push(h('div', { class: 'item' + i + state.nums }, `第${i}个`));
                        }
                        return array;
                    }
                )
            )
        )
    }

    function render(element) {
        const vdom = view();
        preVDom = vdom;

        const dom = createElement(vdom);
        element.appendChild(dom);

        timer = setInterval(() => {
            state.nums += 1;
            tick(element);
        }, 500);
    }

    function tick(element) {
        if (state.nums > 7) {
            clearTimeout(timer);
            return;
        }
        const newVDom = view();
        const patchObj = diff(preVDom, newVDom);
        console.log(patchObj);
        preVDom = newVDom;
        patch(element, patchObj);

    }

    function diff(oldVDom, newVDom) {
        if (oldVDom === undefined) {
            return {
                type: nodePatchTypes.CREATE,
                vdom: newVDom
            }
        }

        if (newVDom === undefined) {
            return {
                type: nodePatchTypes.REMOVE,
            }
        }

        if (typeof oldVDom !== typeof newVDom ||
            ((typeof oldVDom === 'string' || typeof oldVDom === 'number') && oldVDom !== newVDom) ||
            oldVDom.tag !== newVDom.tag) {
            return {
                type: nodePatchTypes.REPLACE,
                vdom: newVDom
            }
        }
        // 更新node
        if (oldVDom.tag) {
            // 比较props的变化
            const propsDiff = diffProps(oldVDom, newVDom);

            // 比较children的变化
            const childrenDiff = diffChildren(oldVDom, newVDom);

            if (propsDiff.length > 0 || childrenDiff.some(patchObj => (patchObj !== undefined))) {
                return {
                    type: nodePatchTypes.UPDATE,
                    props: propsDiff,
                    children: childrenDiff
                }
            }
        }
    }

    function diffProps(oldVDom, newVDom) {
        const patches = [];

        const allProps = {...oldVDom.props, ...newVDom.props};

        Object.keys(allProps).forEach(key => {
            const oldValue = oldVDom.props[key];
            const newValue = newVDom.props[key];
            
            if (newValue === undefined) {
                patches.push({
                    type: propPatchTypes.REMOVE,
                    key
                });
            } else if (oldValue === undefined || oldValue !== newValue) {
                patches.push({
                    type: propPatchTypes.UPDATE,
                    key,
                    value: newValue
                });
            }
        });

        return patches;
    }


    function diffChildren(oldVDom, newVDom) {
        const patches = [];
        
        const childLength = Math.max(oldVDom.children.length, newVDom.children.length);

        for (let i = 0; i < childLength; i++) {
            patches.push(diff(oldVDom.children[i], newVDom.children[i]));
        }
        return patches;
    }


    function patch(parent, patchObj, index = 0) {
        if (!patchObj || !parent) {
            return;
        }

        // 新建元素
        if (patchObj.type === nodePatchTypes.CREATE) {
            return parent.appendChild(createElement(patchObj.vdom));
        }
        const element = parent.children[index];
        
        // 删除元素
        if (patchObj.type === nodePatchTypes.REMOVE) {
            return parent.removeChild(element);
        }

        // 替换元素
        if (patchObj.type === nodePatchTypes.REPLACE) {
            return parent.replaceChild(createElement(patchObj.vdom), element);
        }

        // 更新元素
        if (patchObj.type === nodePatchTypes.UPDATE) {
            const {props, children} = patchObj;
            patchProps(element, props);
            
            children.forEach((patchObj, i) => {
                patch(element, patchObj, i);
            })
        }

    }

    function patchProps(element, props) {
        if (!props) {
            return;
        }
        props.forEach(patchObj => {
            if (patchObj.type === propPatchTypes.REMOVE) {
                element.removeAttribute(patchObj.key);
            } else if (patchObj.type === propPatchTypes.UPDATE) {
                element.setAttribute(patchObj.key, patchObj.value);
            }
        });
    }


    let app = document.createElement('div');
    document.body.appendChild(app);
    render(app);

}