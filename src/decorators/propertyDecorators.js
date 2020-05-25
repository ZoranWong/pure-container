function typeOf(value) {
    let type = typeof value;
    if(type === 'number'){
        let v = value + '';
        type = v.indexOf('.') > -1 ? 'float' : 'int';
        if(type === 'int') {
            type = v.charAt(0) === '-' ? 'int' : 'unsigned';
        }
    }
    return type;
}

function typeCheck(target, name, descriptor, type) {
    let v = descriptor.initializer && descriptor.initializer.call(this);
    return {
        enumerable: true,
        configurable: true,
        get: function () {
            return v;
        },
        set: function (c) {
            let cType = typeOf(c);
            if(cType === type){
                v = c;
            }else {
                throw new TypeError(`The type of attribute ${name} is a ${type}, not a ${cType}`);
            }
        }
    }
}

export function string(target, name, descriptor) {
    return typeCheck(target, name, descriptor, 'string');
}

export function number(target, name, descriptor) {
    return typeCheck(target, name, descriptor, 'number')
}

export function unsigned(target, name, descriptor) {
    return typeCheck(target, name, descriptor, 'unsigned')
}

export function int(target, name, descriptor) {
    return typeCheck(target, name, descriptor, 'int')
}

export function float(target, name, descriptor) {
    return typeCheck(target, name, descriptor, 'float')
}

export  function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}