import Container from '../src/Container';

let container = Container.getInstance();
container.instance('instance', {
    name: 'xxxxxx'
});

let test1 = container.get('instance');
let test2 = container.get('instance');
test('container singleton object test1  equal test2!', () => {
    expect(test1 === test2).toEqual(true);
});
