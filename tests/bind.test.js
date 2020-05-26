import Container from '../src/Container';
import {CheckCustomerClass, int, method, readonly, string, unsigned} from "../src/decorators";

class Test {
    @string
    name = '';
    @CheckCustomerClass(Number)
    count = 0;
    constructor(name) {
        this.name = name;
    }
    @method([string], int)
    log(context) {
        return 1;
    }
}

let container = Container.getInstance();
container.bind('test', Test);

let test1 = container.make('test', 'test');
let test2 = container.make('test', 'test');
try{
    test1.count = -2;
}catch (e) {
    console.log(e.message);
}

try{
    test1.log(-1);
}catch (e) {
    console.log(e.message);
}

try{
    test1.log('x');
}catch (e) {
    console.log(e.message);
}

test('test1 not equal test2!', () => {
    expect(test1 === test2)
        .toEqual(false);
});

container.user = class User {
    constructor() {

    }
}

let user1 = container.user;
let user2 = container.user;
test('user1 not equal user2!', () => {
    expect(user1 === user2)
        .toEqual(false);
});
