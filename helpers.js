/**
 * @typedef {Object} Ref
 * @property {(listener: (this: HTMLElement, ev: MouseEvent) => any) => Ref} onClick
 * @property {(renderer: () => String, ...args: any[]) => Ref} reRender
 * @property {() => boolean} exists
 * @property {() => HTMLElement | null} exists
 */

export function useRef() {
    let id = generateId()

    /**
     * @type {Ref}
     */
    let ref = {
        toString: () => `id="${id}"`,
        onClick: (listener) => {
            setTimeout(() => {
                let elm = ref.getElm()
                if (!elm) return;
                elm.addEventListener("click", listener)
            })
            return ref;
        },
        reRender: (renderer, ...args) => {
            let elm = ref.getElm()
            if (!elm) return ref;
            elm.outerHTML = renderer(...args)
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
 * @property {(listener: (this: HTMLElement, ev: MouseEvent) => any) => Ref} onClick
 * @property {(renderer: () => String, ...args: any[]) => Ref} reRender
 * @property {() => boolean} exists
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