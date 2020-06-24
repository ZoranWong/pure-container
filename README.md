pure-container [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://www.npmjs.com/package/@zoranwong/pure-container)
==============
# pure-container is a container library for nodejs or web project.
## Install package
```
npm install @zoranwong/pure-container --save
```
## What is it
- pure-container is a container library that is built on javascript(es6). You can use it in your nodejs project or web front-end project.
- pure-container can help you easy to organize objects which in your js project.
-  It also can be used as the object's factory and provides an easy way to create an object by the name which you registered to container.
## How to use it
- import container to your es6 project and using in the project

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
});// bind a object factory method
container.user2 = User;// bind a class by setter method
container.user3 = (container, name, age, sex) => {
    return new User(name, age, sex);
}// bind a object factory method by setter method

//create object from container with parameters
container.make('user0', 'Mr. X', 29, 'Male');
container.make('user1', 'Mrs. Y', 26, 'Female');
container.user1 // get a registered object by getter

// register a instance to container
container.instance('counter', 1);
container.instance('config', {'version': '0.0.1'});
container.config = {counter: 1};// register a singleton object by setter method
// get a instance from container
container.get('counter');// get counter singleton instance
container.get('config');// get config singleton instance
container.config;//get config object by getter method

// bind method
container.bindMethod('createUser', function(name, age, sex){
    return new User(name, age, sex);
    });
// call the bind method by callMethodBinding    
let user = container.callMethodBinding('createUser', 'Mr. Zou', '29', 'Male');    
```

- import container to your nodejs project and using in the project

```
const Container = require('pure-container');
```



## API document

- Container.getInstance()  
```
  This is a static method in Container class which to get a Container singleton instance.
```

- container.instance(name, instance)
```
  This method can be used to register an instance into the container.
  params: instance(name: string, instance: any)
```

- container.bind(name, obj, needPool, singleton)
```
    This method can be used to register a class or a factory method which can be used to create object  into the container.
    params: bind(name: string, obj: constructor|Closure, needPool: boolean, singleton: boolean)
    name: binding name
    obj: binding constructor or Closure
    needPool: use object pool
    singleton: bind constructor as singleton object
```

- container.singleton(name, obj)
```
    This method can be used to register a class or a factory method which can be used to create object  into the container, but the container instantiates the object only once as you register a singleton for the class and the factory method.
    params: singleton(name: string, obj: constructor|Closure)
```

- container.get(name)
```
  This method provides an interface for you to obtain an object in which you register into the container without parameters.
```

- container.make(name, ...params)
```
    This method provides an interface for you to obtain an object in which you register into the container with parameters.
```

- container.bindMethod(name, method)
```
  This method can be used to bind an anonymous function into container.
```

- container.callMethodBinding(name, ...params)
```
   This method can be used to call an anonymous function which registered into container.
```

- setter
```
  The setter method of Container. If you set an instance it will call the instance(name, instance) to register the instance, and set a class or a factory method it will call the bind(name, obj) to register the class and the factory method.And also You can set an anonymous function to call the bindMethod(name, method) to register the anonymous function.
```

- getter
```
  The getter method of Container. If you can this method it will call the get(name) to obtain an instance for you.
```
