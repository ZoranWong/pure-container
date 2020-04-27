import { isFunction, isObject } from 'underscore';
export default class RegisterContext {
    instance = null;
    singleton = false;
    callback = null;
    context = null;
    constructor(instance, context, singleton = false) {
        this.singleton = singleton;
        this.context = context;
        this.callback = this.getClosure(instance);
    }

    getClosure(instance) {
        if (isFunction(instance)) {
            try {
                let obj = instance(this.context);
                if (typeof obj === 'undefined') {
                    return (context, ...params) => {
                        this.context = context;
                        return new instance(...params);
                    }
                } else {
                    return (context, ...params) => {
                        this.context = context;
                        return instance(context, ...params);
                    }
                }
            } catch (e) {
                return (context, ...params) => {
                    this.context = context;
                    return new instance(...params);
                }
            }
        } else {
            if (isObject(instance) && typeof instance.constructor !== 'undefined') {
                return (context, ...params) => {
                    this.context = context;
                    return new instance.constructor(...params);
                }
            } else {
                return (context) => {
                    this.context = context;
                    return instance;
                }
            }
        }
    }

    resovle(...params) {
        if (this.singleton) {
            if (this.instance) {
                return this.instance;
            } else {
                return (this.instance = this.callback(this.context, ...params))
            }
        } else {
            return this.callback(this.context, ...params);
        }
    }
}
