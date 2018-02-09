const Q = require("q");


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
            iterate: function(arr, iterCback, doneCback) {
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

