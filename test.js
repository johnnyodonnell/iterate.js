const iteratorFactory = require("./index");


const iterator = iteratorFactory.createNewInstance();

const list = [1, 2, 3];
const map = {first: 1, second: 2, third: 3};

iterator.iterate(list, function(item, next) {
    console.log(item);
    next();
}, function() {
    console.log("Done with list");
});

iterator.iterate(map, function(item, next) {
    console.log(item);
    next();
}, function() {
    console.log("Done with map");
});

