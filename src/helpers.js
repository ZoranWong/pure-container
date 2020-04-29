'use strict';
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
