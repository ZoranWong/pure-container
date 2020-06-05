`use strict`;
import {
    isClass
} from '../src/helpers';

function fun0() {
    return {};
}

let fun1 = function () {
    return {};
}

let fun2 = () => {
    return {};
}

test('fun0 is not a class', () => {
    expect(isClass(fun0))
        .toEqual(false);
});

test('fun1 is not a class', () => {
    expect(isClass(fun1))
        .toEqual(false);
});

test('fun2 is not a class', () => {
    expect(isClass(fun2))
        .toEqual(false);
});

function fun3() {}

let fun4 = function () {}

let fun5 = () => {}

test('fun3 is a class', () => {
    expect(isClass(fun3))
        .toEqual(false);
});

test('fun4 is a class', () => {
    expect(isClass(fun4))
        .toEqual(false);
});

test('fun5 is not a class', () => {
    expect(isClass(fun5))
        .toEqual(false);
});

class Test {
    name = '';
}

test('Test is a class', () => {
    expect(isClass(Test))
        .toEqual(true);
});
