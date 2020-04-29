import Container from '../src/Container';
class Test {
    name = '';
    constructor(name) {
        this.name = name;
    }
}

let container = Container.getInstance();
container.singleton('testSingleton', Test);

let test1 = container.make('testSingleton', 'test0');
let test2 = container.make('testSingleton', 'test1');
test('container singleton object test1  equal test2!', () => {
    expect(test1 === test2)
        .toEqual(true);
});

container.config = {
    'counter': 0,
    'version': '0.0.1'
};

let config0 = container.config;
config0.counter++;

test('config object is a singleton object in container!', () => {
    expect(container.config.counter === 1)
        .toEqual(true);
});


container.instance('instance', {
    name: 'xxxxxx'
});

let test3 = container.get('instance');
let test4 = container.get('instance');
test('container singleton object test3  equal test4!', () => {
    expect(test3 === test4)
        .toEqual(true);
});
