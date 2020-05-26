function paramTypeCheck(value, index, type) {
    let cType = typeOf(value);
    if(typeOf(type) === 'string') {
        if(check(cType, type)) {
            return true;
        }else{
            throw new TypeError(`the parameters[${index}] is a ${type} value, not a ${cType} value`);
        }
    }else if(cType === 'object'){
        if(value instanceof type){
            return true;
        }else{
            throw new TypeError(`the parameters[${index}] is a class ${type.name} instance, not a class ${value.constructor.name} instance`);
        }
    }else{
        throw new TypeError(`the parameters[${index}] is a ${cType} instance, not a class ${value.constructor.name} instance`);
    }
}

function returnTypeCheck(value, type) {
    let cType = typeOf(value);
    if(typeOf(type) === 'string') {
        if(check(cType, type)) {
            return true;
        }else{
            throw new TypeError(`the function return data  is a ${type} value, not a ${cType} value`);
        }
    }else if(cType === 'object'){
        if(value instanceof type){
            return true;
        }else{
            throw new TypeError(`the function return data is a class ${type.name} instance, not a class ${value.constructor.name} instance`);
        }
    }else{
        throw new TypeError(`the function return data is a ${cType} instance, not a class ${value.constructor.name} instance`);
    }
}

function propertyTypeCheck(target, name, type) {
    let cType = typeOf(target);
    if(typeOf(type) === 'string') {
        if(check(cType, type)) {
            return true;
        }else{
            throw new TypeError(`the property ${name} is a ${type} value, not a ${cType} value`);
        }
    }else if(cType === 'object'){
        if(target instanceof type){
            return true;
        }else{
            throw new TypeError(`the property ${name} is a class ${type.name} instance, not a class ${target.constructor.name} instance`);
        }
    }else{
        throw new TypeError(`the property ${name} is a ${cType} instance, not a class ${target.constructor.name} instance`);
    }
}
class Descriptor {
    initializer () {}
}
/**
 * @param {string} type
 * @param {any} target
 * @param {string|int|null} name
 * @param {Descriptor} descriptor
 * @return {any}
 * */
function typeCheck(type, target, name, descriptor = null) {
    if(descriptor){
        let v = descriptor.initializer && descriptor.initializer.call(this);
        return {
            enumerable: true,
            configurable: true,
            get: function () {
                return v;
            },
            set: function (c) {
                if(propertyTypeCheck(c, name, type)) {
                    v = c;
                }
            }
        }
    }else if (name){
        return  paramTypeCheck(target, name, type);
    }else{
        return returnTypeCheck(target, type);
    }
}

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
function check(cType, type) {
    if(!(cType === type || ((cType === 'int' || cType === 'unsigned') && type === 'float'))){
        return  false;
    }
    return true;
}

export function string(target, name = null, descriptor = null) {
    return typeCheck('string', target, name, descriptor)
}

export function number(target, name, descriptor = null) {
    return typeCheck('number', target, name, descriptor)
}

export function unsigned(target, name, descriptor) {
    return typeCheck('unsigned', target, name, descriptor)
}

export function int(target, name, descriptor) {
    return typeCheck('int', target, name, descriptor)
}

export function array(target, name, descriptor) {
    return typeCheck('array', target, name, descriptor)
}

export function fun(target, name, descriptor) {
    return typeCheck('function', target, name, descriptor)
}

export function Closure(target, name, descriptor) {
    return typeCheck('Closure', target, name, descriptor)
}

export function ArrowFunction(target, name, descriptor) {
    return typeCheck('ArrowFunction', target, name, descriptor)
}

export function Constructor(target, name, descriptor) {
    return typeCheck('Constructor', target, name, descriptor)
}

export function Factory(target, name, descriptor) {
    return typeCheck('Factory', target, name, descriptor)
}

export function float(target, name, descriptor) {
    return typeCheck('float', target, name, descriptor)
}

export function Enum(data) {
    return function(target, name, descriptor) {
        return typeCheck('array', target, name, descriptor)
    }
}

export  function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

export function CheckCustomerClass(type) {
    return (target, name, descriptor) => {
        return typeCheck(type, target, name, descriptor);
    }
}

/**
 * @param {Array} params
 * @param {any} returnType
 * @param {function}
 * */
export function method(params, returnType) {
    return (target, name, descriptor) => {
        return {
            ...descriptor,
            value (...arg) {
                for (let index in params) {
                    let type = params[index];
                    if(typeOf(type) !== 'string')
                        type(arg[index], index);
                    else
                        paramTypeCheck(arg[index], index, type);
                }
                let result = descriptor.value.apply(this, arg);
                if(returnType){
                    if(typeOf(returnType) === 'string')
                        returnTypeCheck(result, returnType);
                    else
                        returnType(result);
                }
                return result;
            }
        };
    }
}