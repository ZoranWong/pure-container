# pure-container is a container library for nodejs or web project.
## Install package
```
npm install pure-container --save
```

## How to use
# import container to your project and using in the project
```
import Container from 'pure-container';
// The Container class is a singleton class.You need use the static method getInstance to get a Container object.
const container = Container.getInstance();

// bind a class or a method which return a object
class User {
    name = '';
    age = 0;
    sex = '';
    constructor(name, age, sex){
        this.name = name;
        this.age = age;
        this.sex = sex;
    }
}
container.bind('user0', User);
container.bind('user1', (container, name, age, sex) => {
    return new User(name, age, sex);
});

//create object from container with parameters
container.make('user0', 'Mr. X', 29, 'Male');
container.make('user1', 'Mrs. Y', 26, 'Female');

// register a instance to container
container.instance('counter', 1);
container.instance('config', {'version': '0.0.1'});
// get a instance from container
container.get('counter');// get counter singleton instance
container.get('config');// get config singleton instance
```
