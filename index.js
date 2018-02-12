const Q = require("q");


const mapToList = function(map) {
    list = [];

    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            list.push(map[key]);
        }
    }

    return list;
};

const iteratorFactory = {
    createNewInstance: function(maxConcurrent = 1) {
        let i = 0;

        const handleItem = function(item, arr, iterCback, cback) {
            if (!(i % 100)) {
                console.log("i = %d", i);
            }

            iterCback(item, function(err) {
                if (err) {
                    cback(err);
                } else if (i < arr.length) {
                    handleItem(arr[i++], arr, iterCback, cback);
                } else {
                    cback();
                }
            });
        };

        const iterator = {
            iterate: function(collection, iterCback, doneCback) {
                let arr;
                if (collection.constructor === Array) {
                    arr = collection;
                } else {
                    arr = mapToList(collection);
                }

                const promises = [];

                i = 0;
                while (i < maxConcurrent && i < arr.length) {
                    const deferred = Q.defer();
                    promises.push(deferred.promise);

                    handleItem(arr[i++], arr, iterCback, function(err) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve();
                        }
                    });
                }

                Q.all(promises).then(function() {
                    doneCback();
                }).catch(doneCback);
            },
        };

        return iterator;
    },
};

module.exports = iteratorFactory;

