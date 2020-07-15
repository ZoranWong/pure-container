'use strict';
import {isFunction, isObject} from 'underscore';
import IContainer from "./IContainer";
import {any, string, boolean, ArrowFunction, Constructor,} from "@zoranwong/pure-decorators";
import {isClass} from "../helpers";
const   POOL_MAX_SIZE = 100;
export default class RegisterContext {
    /**@property {boolean} singleton*/
    @boolean
    singleton = false;
    /**@property {Function} callback*/
    @ArrowFunction
    callback = () => {
        return null;
    };
    /**@property {IContainer} context*/
    context = null;
    /**@property {string} name*/
    @string
    name = '';
    @boolean
    needPool = false;
    @Constructor
    _constructor;
    static busyPool = new WeakMap();
    static freePool = new WeakMap();

    /**
     * @constructor
     * @param {string} name
     * @param {FunctionConstructor} instance
     * @param {IContainer} context
     * @param {boolean} singleton
     * */
    constructor(name, instance, context, singleton = false, needPool = false) {
        this.name = name;
        this.singleton = singleton;
        this.context = context;
        this.needPool = needPool;
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
                let isCls = isClass(instance);
                if (isCls) {
                    this._constructor = instance;
                    return (context, ...params) => {
                        this.context = context;
                        return new this._constructor(...params);
                    }
                } else {
                    this._constructor = function (context, ...params) {
                        this.instance = instance(context, ...params);
                    }
                    return (context, ...params) => {
                        this.context = context;
                        return (new this._constructor(context, ...params)).instance;
                    }
                }
            } catch (e) {
                this._constructor = function (...params) {
                    this.instance = new instance(...params)
                };
                return (context, ...params) => {
                    this.context = context;
                    return (new this._constructor(...params)).instance;
                }
            }
        } else {
            if (isObject(instance) && typeof instance.constructor !== 'undefined') {
                this._constructor = instance.constructor;
                return (context, ...params) => {
                    this.context = context;
                    return new this._constructor(...params);
                }
            } else {
                this._constructor = function () {
                    this.instance = instance;
                }
                return (context) => {
                    this.context = context;
                    return (new this._constructor()).instance;
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
        if (this.callback) {
            if (this.singleton) {
                let instance = this.callback(this.context, ...params);
                /**@var {IContainer} context*/
                let context = this.context;
                context.instance(this.name, instance);
                return instance;
            } else {
                let busyPool = [];
                let freePool = [];
                if(this.needPool && this._constructor) {
                    busyPool = RegisterContext.busyPool.get(this._constructor);
                    freePool = RegisterContext.freePool.get(this._constructor);
                }
                let obj = freePool ? freePool.pop() : null;
                obj = obj ? obj : this.callback(this.context, ...params);
                if (this.needPool && this._constructor) {
                    busyPool = busyPool || [];
                    busyPool.push(obj);
                    this.bindDestroy(obj);
                }
                return obj;
            }
        }
        return null;
    }

    bindDestroy(instance) {
        let destroy = () => {
            //
            /**@var {Array} busyPool*/
            let busyPool = RegisterContext.busyPool.get(this._constructor);
            busyPool = busyPool ? busyPool : [];
            let index = busyPool.indexOf(instance);
            if (index > -1)
                delete busyPool[index];
            RegisterContext.busyPool.set(this._constructor, busyPool);
            /**@var {Array} freePool*/
            let freePool = RegisterContext.freePool.get(this._constructor);
            freePool = freePool ? freePool : [];
            if(freePool.length < POOL_MAX_SIZE)
                freePool.push(instance);
            RegisterContext.freePool.set(this._constructor, freePool);
        }
        if(!instance.hasOwnProperty('destroy')){
            Object.defineProperty(instance, 'destroy', {
                writable: false,
                value: destroy
            });
        }
    }
}
