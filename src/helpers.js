function isFunction(cxs) {
    if (typeof cxs != "function")
        return false;
    if (cxs.prototype === undefined)
        return true;
    let str = String(cxs);

    // has own prototype properties
    if (Object.getOwnPropertyNames(cxs.prototype).length >= 2)
        return false;

    if (str.slice(0, 5) === "class")
        return false;
    return true;
}

function isClass(obj) {
    if (typeof obj != "function") {
        return false;
    }

    // async function or arrow function
    if (typeof obj.prototype === 'undefined') {
        return false;
    }


    // generator function and malformed inheritance
    if (obj.prototype.constructor !== obj) {
        return false;
    }

    // has own prototype properties
    if (Object.getOwnPropertyNames(obj.prototype).length >= 2)
        return true;

    let str = String(obj);

    // ES6 class
    if (str.slice(0, 5) == "class")
        return true;

    // anonymous function
    if (/^function\s*\(|^function anonymous\(/.test(str))
        return false;
    if (/this/.test(str)) {
        let hasThis = /(classCallCheck)/.test(str);
        // Upper-cased first char of the name and has `this` in the body, or it's
        // a native class in ES5 style.
        if ((hasThis ||
            (/\[native code\]/.test(str) &&
                obj.name !== "BigInt" && // ES6 BigInt and Symbol is not class
                obj.name !== "Symbol"
            )
        )) {
            return true;
        }

        // TypeScript anonymous class to ES5 with default export
        return /^function\sdefault_\d+\s*\(/.test(str);
    }
    return false;
}


function isArrowFun(cxs) {
    if (!isFunction(cxs)) return false;
    let str = String(cxs);
    if (/^\([\w\s\,]*\)\s* \=>\s*\{[\s\S]*\}$/.test(str))
        return true;
    if (/^function[\s]*\([\w\s\,]*\)\s*\{\s*\[native code\]\s*\}/.test(str)) {
        return true;
    }
    return false;
}

export {
    isClass,
    isFunction,
    isArrowFun
};
