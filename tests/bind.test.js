import Container from '../src/Container';
class Test {
    name = '';
    constructor (name) {
        this.name = name;
    }
}

let container = Container.getInstance();
container.bind('test', Test);

let test1 = container.make('test', 'test');
let test2 = container.make('test', 'test');
test('test1 not equal test2!', () => {
    expect(test1 === test2).toEqual(false);
});
