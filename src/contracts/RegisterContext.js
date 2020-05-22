'use strict';
import { isFunction, isObject } from 'underscore';
import IContainer from "./IContainer";

export default class RegisterContext {
    /**@property {boolean} singleton*/
    singleton = false;
    /**@property {Function} callback*/
    callback = ()=>{};
    /**@property {IContainer} context*/
    context = null;
    /**@property {string} name*/
    name = '';
    /**
     * @constructor
     * @param {string} name
     * @param {FunctionConstructor} instance
     * @param {IContainer} context
     * @param {boolean} singleton
     * */
    constructor(name, instance, context, singleton = false) {
        this.name = name;
        this.singleton = singleton;
        this.context = context;
        this.callback = this.getClosure(instance);
    }

    /**
     * [getClosure description]
     * @param  {any} instance [绑定对象或者函数]
     * @return {Function}          [对象创建函数]
     */
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

    /**
     * 对象创建函数
     * @param  {IArguments} params [参数数组]
     * @return {any}        [返回创建的]
     */
    resolve(...params) {
        if(this.callback) {
            if (this.singleton) {
                let instance = this.callback(this.context, ...params);
                /**@var {IContainer} context*/
                let context = this.context;
                context.instance(this.name, instance);
                return instance;
            } else {
                return this.callback(this.context, ...params);
            }
        }
        return  null;
    }
}
