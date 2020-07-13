import Container from '../src/Container';
// import {CheckCustomerClass, int, method, readonly, string, unsigned} from "@zoranwong/pure-decorators";
import {string, CheckType, method, int} from '@zoranwong/pure-decorators';

// console.log(obj);

class Test {
    name = '';
}

let container = Container.getInstance();
container.bind('test', Test);

let test1 = container.make('test', 'test');
let test2 = container.make('test', 'test');

test('test1 not equal test2!', () => {
    expect(test1 === test2)
        .toEqual(false);
});
class User {
    constructor() {

    }
}
container.user = User;

let user1 = container.user;
let user2 = container.user;
test('user1 not equal user2!', () => {
    expect(user1 === user2)
        .toEqual(false);
});

container.mixin({
    userInfo(){
        console.log('------------- user info --------');
    }
});

container.userInfo();

container.bind('user01', User, true);

let user01 = container['user01'];
user01.destroy();
console.log(user01);
let user02 = container['user01'];
let user03 = container['user01'];
console.log(user01 === user02, user01 === user03)