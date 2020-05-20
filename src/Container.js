import IContainer from './contracts/IContainer';
import {
    isClass
} from './helpers';
import {
    isFunction
} from 'underscore';
/**
 * @constructor {Container} 容器
 * @property {IContainer} getProxy
 * */
export default class Container extends IContainer {
    /**@property {Proxy<Container>} 容器实例代理对象*/
    #proxy = null;
    /**@static {Container} 容器单例对象*/
    static _instance = null;
    constructor() {
        super();
        this.#proxy = new Proxy(this, {
            get(obj, prop) {
                return typeof obj[prop] === 'undefined' ? obj.get(prop) : obj[prop];
            },
            set(obj, prop, value) {
                if(isClass(value)) {
                    obj.bind(prop, value);
                } else if(!isFunction(value)) {
                    obj.instance(prop, value);
                } else if(typeof value() === 'undefined') {
                    obj.bindMethod(prop, value);
                } else {
                    obj.bind(prop, value);
                }
                return value;
            }
        });
    }

    /**
     * 获取容器代理对象
     * @return {Container|Proxy}
     */
    static getInstance() {
        /**@var {Container} instance*/
        let instance = Container._instance;
        if(!instance) {
            Container._instance = instance = new Container();
        }
        return instance.getProxy();
    }
    /**
     * 获取容器代理对象
     * @return {Container|Proxy}
     */
    getProxy() {
        return this.#proxy;
    }

    /**
     * 是否是类类型
     * @param {any} obj
     * @return {boolean}
     * */
    isClass(obj) {
        return isClass(obj);
    }
}
