import RegisterContext from './RegisterContext';
import {
    isFunction,
    isArray
} from 'underscore';
/**
 * @interface IContainer 容器接口
 * @type {Array}
 */
export default class IContainer {
    #instances = {};
    #bindings = {};
    #aliases = {};
    #methodBindings = {};
    constructor() {}

    /**
     * [注册一个现成的对象实例为单例]
     * @param  {[string]} name     [description]
     * @param  {[any]} instance [description]
     * @return {[IContainer]}          [description]
     */
    instance(name, instance) {
        if(!isFunction(instance)) {
            this.#instances[name] = instance;
            return this;
        } else {
            throw TypeError('注册对象不可以是函数或者类');
        }
    }

    bind(name, concrete, singleton = false) {
        this.#bindings[name] = new RegisterContext(name, concrete, this, singleton);
        return this;
    }

    bindMethod(method, callback) {
        this.#methodBindings[this.parseBindMethod(method)] = callback;
    }

    parseBindMethod(method) {
        if(isArray(method)) {
            return `${method[0]}@${method[1]}`;
        }
        return method;
    }

    hasMethodBinding(method) {
        method = this.parseBindMethod(method);
        let bindings = this.#methodBindings;
        return typeof bindings[method] !== 'undefined';
    }

    callMethodBinding(method, ...params) {
        let bindings = this.#methodBindings;
        if(this.hasMethodBinding(method)) {
            return bindings[method](...params);
        }
    }
    /**
     * [单例对象注册]
     * @param  {[string]} name     [单例对象名称]
     * @param  {[any]} instance [单例对象、类或者对象生产方法]
     * @return {[IContainer]}          [返回容器]
     */
    singleton(name, instance) {
        return this.bind(name, instance, true);
    }

    getAlias(name) {
        let aliases = this.#aliases;
        if(typeof aliases[name] === 'undefined') {
            return name;
        }
        return this.getAlias(name);
    }
    make(name, ...params) {
        return this.resovle(name, ...params);
    }

    resovle(name, ...params) {
        name = this.getAlias(name);
        let instances = this.#instances;
        if(typeof instances[name] !== 'undefined') {
            return instances[name];
        }
        let bindings = this.#bindings;
        let context = bindings[name];
        if(typeof context !== 'undefined') {
            let instance = context.resovle(...params);
            if(context.singleton) {
                instances[name] = instance;
            }
            return instance;
        } else {
            return null;
        }
    }
    /**
     * [获取或者创建对象]
     * @param  {[string]} name   [对象注册名称]
     * @return {[any]}        [返回注册对象实例]
     */
    get(name) {
        return this.resovle(name);
    }

    extend(name, callback) {
        name = this.getAlias(name);
        let instances = this.#instances;
        if(typeof instances[name] !== 'undefined') {
            let instance = instances[name];
            instances[name] = callback(instance, this);
        }
    }

    isShared(name) {
        let instances = this.#instances;
        let bindings = this.#bindings;
        return typeof instances[name] !== 'undefined' || typeof bindings[name] !== 'undefined' && bindings[name].singleton;
    }
}
