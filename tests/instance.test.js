import Container from '../lib';

let container = Container.getInstance();
container.instance('instance', {
    name: 'xxxxxx'
});

let test1 = container.get('instance');
let test2 = container.get('instance');
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
