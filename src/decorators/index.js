import * as  propertyDecorators from './propertyDecorators';
let decorators = {};

for(let key in propertyDecorators){
    decorators[key] =propertyDecorators[key];
}
export default decorators;