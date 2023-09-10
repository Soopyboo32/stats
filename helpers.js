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

/**
 * @typedef {()=>StaticCss} _StaticCss
 * 
 * @typedef {Object} _CssProps
 * @property {() => String} getCss
 * @property {() => String} getClassName
 * @property {() => String[]} getAllClasses
 * @property {(StaticCss) => StaticCss} merge
 * @property {() => StaticCss} named
 * 
 * @typedef {_StaticCss & _CssProps} StaticCss
 */

export function staticCss(...args) {
    let data = toStaticCssData(args)

    return fromStaticCssData(data, [generateClassName()])
}

staticCss.named = (id) => (...args) => {
    let data = toStaticCssData(args)

    return fromStaticCssData(data, [generateClassName(id)])
}

function toStaticCssData(asd) {
    let css = [];
    asd[0].forEach((s, i) => {
        css.push(s)
        if ((typeof asd[i + 1] == "object" || typeof asd[i + 1] == "function")
            && (asd[i + 1].internal_isCssClassGetter == true || asd[i + 1].classType === "StaticCss")) {
            css.push(asd[i + 1])
        } else if (asd[i + 1]) {
            css.push(asd[i + 1] + "")
        }
    })
    return css
}

function fromStaticCssData(data, classes = []) {
    classes = [...new Set(classes)]
    let val = data

    /**@type {StaticCss} */
    let ret = (...args2) => {
        let css = toStaticCssData(args2)

        let className = generateClassName();
        return fromStaticCssData(css, [...classes, className])
    }
    ret.merge = (otherCss) => {
        return fromStaticCssData([], [...classes, ...otherCss.getAllClasses(), ""])
    }
    ret.named = (id) => (...args) => {
        let data = toStaticCssData(args)

        return fromStaticCssData(data, [...classes, generateClassName(id)])
    }
    ret.getCss = () => val.map(d => {
        if (d.internal_isCssClassGetter) return `.${classes[classes.length - 1]}`;
        if (d.classType === "StaticCss") return `.${d.getClassName()}`;

        return d;
    }).join("")
    ret.getClassName = () => classes[classes.length - 1]
    ret.getAllClasses = () => classes
    ret.toString = () => {
        return `class="${classes.join(" ")}"`
    }
    ret.classType = "StaticCss"

    addCssToFile(ret)

    return ret
}

export let thisClass = {
    internal_isCssClassGetter: true
}

let generatedIds = new Set([""])
function generateClassName(id = "") {
    let testId = id
    while (generatedIds.has(testId)) {
        testId = id + "_" + Math.floor(Math.random() * 2400000).toString(16)
    }
    generatedIds.add(testId);
    return testId;
}
function generateId() {
    return Math.floor(Math.random() * 2400000).toString(16)
}

let styleElm = document.getElementById("css")
let cssAdded = new Set([])

/**
 * @param {StaticCss} staticCss 
 */
function addCssToFile(staticCss) {
    if (cssAdded.has(staticCss.getClassName())) {
        return;
    }
    cssAdded.add(staticCss.getClassName());

    styleElm.innerHTML += staticCss.getCss() + "\n";
}