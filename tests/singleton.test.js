import Container from '../src/Container';
class Test {
    name = '';
    constructor (name) {
        this.name = name;
    }
}

let container = Container.getInstance();
container.singleton('testSingleton', Test);

let test1 = container.make('testSingleton', 'test0');
let test2 = container.make('testSingleton', 'test1');
test('container singleton object test1  equal test2!', () => {
    expect(test1 === test2).toEqual(true);
});
