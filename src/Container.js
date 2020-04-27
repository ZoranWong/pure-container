import IContainer from './contracts/IContainer';
export default class Container extends IContainer {
    /**@property {Proxy<Container>} 容器实例代理对象*/
    #proxy = null;
    /**@property {Container} 容器单例对象*/
    static _instance = null;
    constructor() {
        super();
        this.#proxy = new Proxy(this, {
            get(obj, prop) {
                return typeof obj[prop] === 'undefined' ? obj.make(prop) : obj[prop];
            },
            set(obj, prop, value) {
                obj.bind(prop, value);
                return value;
            }
        });
    }

    /**
     * 获取容器代理对象
     * @return {Container|Proxy}
     */
    static getContainer() {
        if (!Container._instance) {
            Container._instance = new Container();
        }
        return Container._instance.getProxy();
    }
    /**
     * 获取容器代理对象
     * @return {Container|Proxy}
     */
    getProxy() {
        return this.#proxy;
    }
}
