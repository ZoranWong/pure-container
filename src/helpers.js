'use strict';
/**
 * @method 判断是否为类类型
 * @param {any} instance
 * @return {boolean}
 * */
export function isClass(instance) {
    try {
        let obj = new instance;
        if(obj instanceof instance) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}
