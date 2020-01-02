import { h, createElement } from './util';
import './style.less';
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
        nums: 5,
        msg: 'Hello World',
        activeIndex: 0
    };
    window.state = state;
    let timer;
    let preVDom;
    function view() {
        return h(
            'div',
            null,
            state.msg,
            h(
                'ul',
                null,
                () => {
                    let array = [];
                    for (let i = 0; i < state.nums; i++) {
                        array.push(h(
                            'li',
                            { class: state.activeIndex === i ? 'active' : ''},
                            `第${i}个`
                        ));
                    }
                    return array;
                }
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
        if (state.nums > 20) {
            clearTimeout(timer);
            return;
        }
        const newVDom = view();
        diff(preVDom, newVDom, element);
        preVDom = newVDom;
    }

    function diff(oldVDom, newVDom, parent, index = 0) {
        if (oldVDom === undefined) {
            return parent.appendChild(createElement(newVDom));
        }
        const element = parent.childNodes[index];
        if (newVDom === undefined) {
            // return {
            //     type: nodePatchTypes.REMOVE,
            // }
            return parent.removeChild(element);
        }

        if (typeof oldVDom !== typeof newVDom ||
            ((typeof oldVDom === 'string' || typeof oldVDom === 'number') && oldVDom !== newVDom) ||
            oldVDom.tag !== newVDom.tag) {
            // return {
            //     type: nodePatchTypes.REPLACE,
            //     vdom: newVDom
            // }
            return parent.replaceChild(createElement(newVDom), element);
        }
        // 更新node
        if (oldVDom.tag) {
            // 比较props的变化
            diffProps(oldVDom, newVDom, element);

            // 比较children的变化
            diffChildren(oldVDom, newVDom, element);

            // if (propsDiff.length > 0 || childrenDiff.some(patchObj => (patchObj !== undefined))) {
            //     return {
            //         type: nodePatchTypes.UPDATE,
            //         props: propsDiff,
            //         children: childrenDiff
            //     }
            // }
        }
    }

    function diffProps(oldVDom, newVDom, element) {
        // const patches = [];

        const allProps = {...oldVDom.props, ...newVDom.props};

        Object.keys(allProps).forEach(key => {
            const oldValue = oldVDom.props[key];
            const newValue = newVDom.props[key];

            if (newValue === undefined) {
                // patches.push({
                //     type: propPatchTypes.REMOVE,
                //     key
                // });
                element.removeAttribute(key);
            } else if (oldValue === undefined || oldValue !== newValue) {
                // patches.push({
                //     type: propPatchTypes.UPDATE,
                //     key,
                //     value: newValue
                // });
                element.setAttribute(key, newValue);
            }
        });

        // return patches;
    }


    function diffChildren(oldVDom, newVDom, parent) {
        // const patches = [];

        const childLength = Math.max(oldVDom.children.length, newVDom.children.length);

        for (let i = 0; i < childLength; i++) {
            diff(oldVDom.children[i], newVDom.children[i], parent, i);
            // patches.push(diff(oldVDom.children[i], newVDom.children[i]));
        }
        // return patches;
    }


    function patch(parent, patchObj, index = 0) {
        if (!patchObj) {
            return;
        }
        // 新建元素
        if (patchObj.type === nodePatchTypes.CREATE) {
            return parent.appendChild(createElement(patchObj.vdom));
        }
        const element = parent.childNodes[index];
        
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
            });
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



    function update() {
        tick(app);
    }
    window.update = update;
}
