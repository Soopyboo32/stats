/**
 * @typedef {Object} Ref
 * @property {(callback: (this: HTMLElement, ev: MouseEvent) => any) => Ref} onClick
 * @property {(callback: () => any) => Ref} onEnter
 * @property {(data: String) => Ref} reRender
 * @property {(data: String) => Ref} renderInner
 * @property {() => boolean} exists
 * @property {() => HTMLElement | null} getElm
 */

export function useRef() {
    let id = generateId()

    /**
     * @type {Ref}
     */
    let ref = {
        toString: () => `id="${id}"`,
        onClick: (callback) => {
            setTimeout(() => {
                let elm = ref.getElm()
                if (!elm) return;
                elm.addEventListener("click", callback)
            })
            return ref;
        },
        onEnter: (callback) => {
            setTimeout(() => {
                let elm = ref.getElm()
                if (!elm) return;
                elm.addEventListener("keyup", (key) => {
                    if (key.key === "Enter") {
                        callback()
                    }
                })
            })
            return ref;
        },
        reRender: (data) => {
            let elm = ref.getElm()
            if (!elm) return ref;
            elm.outerHTML = data;
            return ref;
        },
        renderInner: (data) => {
            let elm = ref.getElm()
            if (!elm) return ref;
            elm.innerHTML = data;
            return ref;
        },
        exists: () => {
            let elm = ref.getElm()
            return !!elm;
        },
        getElm: () => document.getElementById(id)
    }

    return ref;
}

/**
 * @typedef {()=>Css} Css
 */

export function css(...args) {
    let str = toCssString(args)

    return fromCssString(str)
}

function toCssString(asd) {
    let css = ""
    asd[0].forEach((s, i) => {
        css += s + (asd[i + 1] || "")
    })
    return css
}

function fromCssString(str) {
    let val = str

    /**@type {Css} */
    let ret = (...args2) => {
        let css = toCssString(args2)

        return fromCssString(val + css)
    }
    ret.toString = () => `style="${val.replace("\"", "\\\"")}"`

    return ret
}

function generateId() {
    return Math.floor(Math.random() * 2400000).toString(16)
}

export function showPopup(content) {
    //TODO: actual popup
    alert(content)
}