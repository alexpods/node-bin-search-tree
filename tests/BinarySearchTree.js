var BinarySearchTree = require('../src/BinarySearchTree');
var expect           = require('chai').expect;

describe('BinarySearchTree', function() {
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

        for (var prop in dict) {
            tree.set(prop, dict[prop]);
        }
    });

    it('should gets value from tree by key', function() {
        for (var prop in dict) {
            expect(tree.get(prop)).to.be.equal(dict[prop]);
        }
    });

    it('should throw an error if value does not exist for specified key', function() {
        expect(function() { tree.get('absent_key') }).to.throw(Error);
    });

    it('should check if specified value for specified key exists', function() {
        for (var prop in dict) {
            expect(tree.has(prop)).to.be.true;
        };

        expect(tree.has('absent_key')).to.be.false;
    });

    it('should remove value by its key', function() {
        expect(tree.has('key2')).to.be.equal(true);
        expect(tree.remove('key2')).to.be.equal(dict['key2']);
        var length = 0;
        for (var prop in dict) {
            length++;
            expect(tree.has(prop)).to.be.equal(prop !== 'key2');
        }
        expect(tree.length).to.be.equal(length-1);
    });

    it('should throw an error if value does not exist for specified key', function() {
        expect(function() { tree.remove('absent_key') }).to.throw(Error);
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
        tree.remove('key2');
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

    it('should have array-like .reduceRight() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        var resultRight = tree.reduceRight(function(previousValue, currentValue, key, traversingTree) {
            visitedKeys.push(key);

            expect(currentValue).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return typeof previousValue === 'undefined' ? currentValue : previousValue + ',' + currentValue;
        });

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);

        var result = tree.reduce(function(previousValue, currentValue, key, traversingTree) {
            visitedKeys.push(key);

            expect(currentValue).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return typeof previousValue === 'undefined' ? currentValue : previousValue + ',' + currentValue;
        });

        var resultRightValues = resultRight.split(',');
        var resultValues      = result.split(',');

        expect(resultRightValues).to.be.deep.equal(resultValues.reverse());

    });

    it('should have array-like .map() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        var newTree = tree.map(function(value, key, traversingTree) {
            visitedKeys.push(key);

            expect(value).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return value + '-mapped-value';
        });

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);

        expect(newTree).not.to.be.equal(tree);
        expect(newTree._root).not.to.be.equal(tree._root);
        expect(newTree.length).to.be.equal(tree.length);
        expect(newTree.root).to.be.equal(tree.root +  '-mapped-value');

        dictKeys.forEach(function(key) {
            expect(newTree.get(key)).to.be.equal(dict[key] + '-mapped-value');
        });

        expect(newTree.length).to.be.equal(dictKeys.length);

        var oldVal = tree.reduce(function(prev, val, key) {
            return prev + val + '-mapped-value' + key;
        }, '');

        var newVal = newTree.reduce(function(prev, val, key) {
            return prev + val + key;
        }, '');

        expect(newVal).to.be.equal(oldVal);
    });

    it('should have array-like .filter() method', function() {
        var dictKeys    = Object.keys(dict);
        var visitedKeys = [];

        var newTree = tree.filter(function(value, key, traversingTree) {
            visitedKeys.push(key);

            expect(value).to.be.equal(dict[key]);
            expect(traversingTree).to.be.equal(tree);

            return key[0] === 'k';
        });

        dictKeys.sort();
        visitedKeys.sort();

        expect(visitedKeys).to.be.deep.equal(dictKeys);

        expect(newTree).not.to.be.equal(tree);
        expect(newTree.length).to.be.equal(2);

        var newKeyValues = newTree.reduce(function(prev, val, key) {
            return prev + key + val;
        }, '');

        var dictKeyValues = '';
        for (var key in dict) {
            if (key[0] !== 'k') {
                continue;
            }
            dictKeyValues += key + dict[key];
        }

        expect(newKeyValues).to.be.equal(dictKeyValues);
    });

});