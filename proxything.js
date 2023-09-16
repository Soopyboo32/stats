function generate(data) {
    return new Proxy(data, {
        set(obj, prop, newval) {
            console.log("Setting " + prop + " to " + newval)
            obj[prop] = newval
        },
        get(obj, prop) {
            console.log("Getting " + prop)
            if (typeof obj[prop] == "object") {
                return generate(obj[prop])
            }
            return obj[prop]
        }
    })
}