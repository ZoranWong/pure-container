import Container from '../src/Container';
let container = Container.getContainer();

class Test {
    test = 1;
    constructor(a = 1) {
        this.test = a;
    }
}

container.bind('testInstance', Test);
// container.testInstance = Test;
console.log(container.testInstance === container.testInstance);
console.log(container.testInstance);
container.singleton('user1', (container, age, name) => {
    let singleton = {
        name: name,
        age: age,
        container: container
    };
    return singleton;
});

container.make('user1', 34, 'Zoran');

console.log(container.user1 === container.user1);

console.log(container.user1);

container.bind('fun0', function() {
    return {
        x: 'xxxx'
    };
});

console.log(container);
