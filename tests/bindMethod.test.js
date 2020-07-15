import Container from '../lib';
class Test {
    name = '';
    constructor(name) {
        this.name = name;
    }
}
let container = Container.getInstance();
container.bindMethod('createTest', function (name) {
    return new Test(name);
});
let test0 = container.callMethodBinding('createTest', 'Mr');

test('test0 is a Test object!', () => {
    expect(test0 instanceof Test)
        .toEqual(true);
});
