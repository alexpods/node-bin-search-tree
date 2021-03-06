var BinarySearchTree = require('../src/Tree');
var expect           = require('chai').expect;

describe('binary search tree', function() {
    var tree;
    var dict = { key1: 'value 1', 1234: 5678, key2: 1234, 5678: 'value2', zz: 'hello', a: 'something else' };

    it('should create new binary search tree', function() {
        expect(new BinarySearchTree()).to.be.instanceof(BinarySearchTree);
    });

    it('should sets new value in tree', function() {
        var tree  = new BinarySearchTree();
        var key   = 'some key';
        var value = 'some value';

        expect(tree.set(key, value)).to.be.equal(tree);
        expect(tree.root).to.be.equal(value);
        expect(tree.rootKey).to.be.equal(key);
    });

    beforeEach(function() {
        tree = new BinarySearchTree();

        Object.keys(dict).forEach(function(prop) {
            tree.set(prop, dict[prop]);
        });
    });

    it('should gets value from tree by key', function() {
        for (var prop in dict) {
            expect(tree.get(prop)).to.be.equal(dict[prop]);
        }
        expect(tree.get('absent_key')).to.be.equal(undefined);
    });

    it('should check if specified value for specified key exists', function() {
        for (var prop in dict) {
            expect(tree.has(prop)).to.be.true;
        };

        expect(tree.has('absent_key')).to.be.false;
    });

    it('should delete value by its key', function() {
        expect(tree.has('key2')).to.be.equal(true);
        expect(tree.delete('key2')).to.be.equal(true);
        var length = 0;
        for (var prop in dict) {
            length++;
            expect(tree.has(prop)).to.be.equal(prop !== 'key2');
        }
        expect(tree.length).to.be.equal(length-1);
        expect(tree.delete('absent_key')).to.be.equal(false);
    });


    it('should gets value with minimal key of the tree', function() {
        expect(tree.min).to.be.equal(dict[1234]);
        expect(tree.minKey).to.be.equal('1234');
    });

    it('should gets value with maximal key of the tree', function() {
        expect(tree.max).to.be.equal(dict['zz']);
        expect(tree.maxKey).to.be.equal('zz');
    });

    it('should gets length of tree', function() {
        var tree2 = new BinarySearchTree();
        expect(tree2.length).to.be.equal(0);

        tree2.set('key', 'value');
        expect(tree2.length).to.be.equal(1);

        expect(tree.length).to.be.equal(6);
        tree.delete('key2');
        expect(tree.length).to.be.equal(5);
    });

    it('should have default node comparison logic', function() {
        var tree = new BinarySearchTree();

        expect(tree.compareKeys('a', 'b')).to.be.below(0);
        expect(tree.compareKeys('b', 'a')).to.be.above(0);
        expect(tree.compareKeys('z', 'a')).to.be.above(0);
        expect(tree.compareKeys(1234, 'a')).to.be.below(0);
        expect(tree.compareKeys(1234, '123435')).to.be.below(0);
        expect(tree.compareKeys('123415', 1234)).to.be.above(0);
        expect(tree.compareKeys(true, 'asdf')).to.be.below(0);
        expect(tree.compareKeys(false, 'asdf')).to.be.below(0);
        expect(tree.compareKeys('1234', true)).to.be.above(0);
        expect(tree.compareKeys(false, '1234')).to.be.below(0);
    });

    it('should customize node comparison logic', function() {
        var tree = new BinarySearchTree(function(key1, key2) {
            return (key1[0] === 'k' && key2[0] !== 'k') ? -1 : (key1 < key2);
        });

        expect(tree.compareKeys('a1', 'b2')).to.be.below(0);
        expect(tree.compareKeys('b2', 'a1')).to.be.above(0);
        expect(tree.compareKeys('z',  'a')).to.be.above(0);
        expect(tree.compareKeys('key1', 'a1')).to.be.below(0);

        tree.set('a1',   3);
        tree.set('b2',   2);
        tree.set('z3',   5);
        tree.set('key1', 1);
        tree.set('key2', 2);
        tree.set('key3', 3);
        tree.set('key34',4);

        expect(tree.minKey).to.be.equal('key1');
        expect(tree.maxKey).to.be.equal('z3');
    });

    it('should clone tree (not deeply)', function() {
        var newTree = tree.clone();

        expect(newTree).to.be.instanceof(tree.constructor);
        expect(newTree.length).to.be.equal(0);
        expect(newTree._cc).to.be.equal(tree._cc);
    });

    it('should have array-like .forEach() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        tree.forEach(function(value, key, traversingTree) {
            visitedKeys.push(key);

            expect(traversingTree).to.be.equal(tree);
            expect(value).to.be.equal(dict[key]);
        });

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);
    });

    it('should have array-like .every() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        var result = tree.every(function(value, key, traversingTree) {
            visitedKeys.push(key);

            expect(value).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return value !== 0;
        });

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);
        expect(result).to.be.equal(true);

        expect(tree.every(function(value, key) {
            return key !== 'key1';
        })).to.be.equal(false);
    });

    it('should have array-like .some() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        var result = tree.some(function(value, key, traversingTree) {
            visitedKeys.push(key);

            expect(value).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return value === 0;
        });

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);
        expect(result).to.be.equal(false);

        expect(tree.some(function(value, key) {
            return key === 'key1';
        })).to.be.equal(true);
    });

    it('should have array-like .reduce() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        var result = tree.reduce(function(previousValue, currentValue, key, traversingTree) {
            visitedKeys.push(key);

            expect(currentValue).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return previousValue + ',' + currentValue;
        }, '__here__');

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);

        var dictResult = '__here__';
        for (var key in dict) {
            dictResult += ',' + dict[key];
        }

        var resultValues = result.split(',');
        var dictValues   = dictResult.split(',');

        resultValues.sort();
        dictValues.sort();

        expect(resultValues).to.be.deep.equal(dictValues);
    });

    it('should implements iterator interface', function() {
        var keys = Object.keys(dict);
        keys.sort();

        if (global.Symbol) {
            var i = 0;
            eval('for (var value of tree) { \
                expect(value).to.be.equal(dict[keys[i++]]); \
            }');
            expect(keys.length).to.be.equal(i);
        }
    });

    it('should implements values() iterator', function() {
        var valuesIterator = tree.values();
        var keys   = Object.keys(dict);

        if (global.Symbol) {
            var i = 0;
            keys.sort();
            eval('for (var value of valuesIterator) { \
                expect(value).to.be.equal(dict[keys[i++]]); \
            }');
            expect(keys.length).to.be.equal(i);
        }
    });

    it('should implements keys() iterator', function() {
        var keysIterator = tree.keys();
        var keys   = Object.keys(dict);

        if (global.Symbol) {
            var i = 0;
            keys.sort();
            eval('for (var key of keysIterator) { \
                expect(key).to.be.equal(keys[i++]); \
            }');
            expect(keys.length).to.be.equal(i);
        }
    });

    it('should implements entries() iterator', function() {
        var entriesIterator = tree.entries();
        var keys   = Object.keys(dict);

        if (global.Symbol) {
            var i = 0;
            keys.sort();
            eval('for (var entry of entriesIterator) { \
                expect(entry.length).to.be.equal(2); \
                expect(entry[0]).to.be.equal(keys[i]); \
                expect(entry[1]).to.be.equal(dict[keys[i]]); \
                ++i; \
            }');
            expect(keys.length).to.be.equal(i);
        }
    });

    it('should supports traversing in "pre" order', function() {
        var methods = ['forEach', 'every', 'some', 'reduce'];

        var keys = [5, 1, 6, 7, 3, 4, 9, 2, 8, 0];
        var res  = [5, 1, 0, 3, 2, 4, 6, 7, 9, 8];
        var resR = [5, 6, 7, 9, 8, 1, 3, 4, 2, 0];

        var tree = new BinarySearchTree();
        keys.forEach(function(value) { tree.set(value) });

        methods.forEach(function(method) {

            var i;

            i = 0;
            tree[method]('pre', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('pre:l', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('pre:left', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('pre:r', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(resR[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            i = 0;
            tree[method]('pre:right', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(resR[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);
        });
    });

    it('should supports traversing in "post" order', function() {
        var methods = ['forEach', 'every', 'some', 'reduce'];

        var keys = [5, 1, 6, 7, 3, 4, 9, 2, 8, 0];
        var res  = [0, 2, 4, 3, 1, 8, 9, 7, 6, 5];
        var resR = [8, 9, 7, 6, 4, 2, 3, 0, 1, 5];

        var tree = new BinarySearchTree();
        keys.forEach(function(value) { tree.set(value) });

        methods.forEach(function(method) {
            var i;

            i = 0;
            tree[method]('post', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('post:l', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('post:left', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('post:r', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(resR[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            i = 0;
            tree[method]('post:right', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(resR[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);
        });
    });

    it('should supports traversing in "level" order', function() {
        var methods = ['forEach', 'every', 'some', 'reduce'];

        var keys = [5, 1, 6, 7, 3, 4, 9, 2, 8, 0];
        var res  = [5, 1, 6, 0, 3, 7, 2, 4, 9, 8];
        var resR = [5, 6, 1, 7, 3, 0, 9, 4, 2, 8];

        var tree = new BinarySearchTree();
        keys.forEach(function(value) { tree.set(value) });

        methods.forEach(function(method) {
            var i;

            i = 0;
            tree[method]('level', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('level:l', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('level:left', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(res[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);

            i = 0;
            tree[method]('level:r', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(resR[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            i = 0;
            tree[method]('level:right', function(val, key) {
                if (method === 'reduce') {
                    val = arguments[1];
                    key = arguments[2];
                }

                expect(key).to.be.equal(resR[i]);
                expect(val).to.be.equal(undefined);
                ++i;

                return method !== 'some';
            });

            expect(keys.length).to.be.equal(i);
        });
    });

});