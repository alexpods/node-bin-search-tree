module.exports = BinarySearchTree;

var Iterator = require('./Iterator');
var traverse = require('./traverse');

var preOrderLeft   = traverse.preOrderLeft;
var preOrderRight  = traverse.preOrderRight;
var inOrderLeft    = traverse.inOrderLeft;
var inOrderRight   = traverse.inOrderRight;
var postOrderLeft  = traverse.postOrderLeft;
var postOrderRight = traverse.postOrderRight;
var levelOrderLeft  = traverse.levelOrderLeft;
var levelOrderRight = traverse.levelOrderRight;

function BinarySearchTree(options) {
    options = options || {};

    if (typeof options === 'function') {
        options['compare'] = options;
    }

    this._root   = null;
    this._min    = null;
    this._max    = null;
    this._length = 0;
    this._cc     = options['compare'];
}

Object.defineProperties(BinarySearchTree.prototype, {

    root: {
        get: function() {
            return this._root.v;
        }
    },

    rootKey: {
        get: function() {
            return this._root.k;
        }
    },

    min: {
        get: function() {
            return this._min.v;
        }
    },

    minKey: {
        get: function() {
            return this._min.k;
        }
    },

    max: {
        get: function() {
            return this._max.v;
        }
    },

    maxKey: {
        get: function() {
            return this._max.k;
        }
    },

    length: {
        get: function() {
            return this._length;
        }
    }
});

/**
 * Insert new value to binary search tree.
 * If key is already exists - than new node is not created, old value is replaced by new one
 *
 * @param key
 * @param value
 *
 * @return {BinarySearchTree} this
 */
BinarySearchTree.prototype.set = function(key, value) {
    if (!this._root) {
        this._root = this._min = this._max = { k: key, v: value, p: null, l: null, r: null, m: null };
        this._length++;
        return this;
    }

    var result = this._search(key);

    if (result[0]) {
        result[1].v = value;
        return this;
    }

    var node = { k: key, v: value, p: null, l: null, r: null, m: null };

    this._linkNodes(result[1], node);
    this._length++;

    if (this.compareKeys(key, this._min.k) < 0) {
        this._min = node;
    }
    else if (this.compareKeys(key, this._max.k) > 0) {
        this._max = node;
    }

    return this;
};

/**
 * Search for value by specified key.
 * If value for specified key does not exists - throw an error
 *
 * @param   key
 * @returns value
 *
 * @throws {Error} if value for specified key does not exists
 */
BinarySearchTree.prototype.get = function(key) {
    var result = this._search(key);

    if (!result[0]) {
        return;
    }

    return result[1].v;
};

/**
 * Checks if value for specified key exists in the binary search tree
 *
 * @param key
 * @returns {Boolean} true if value for specified key exists
 */
BinarySearchTree.prototype.has = function(key) {
    return this._search(key)[0];
};

/**
 * Remove value for specified key.
 * If value for specified key does not exists - throw an error
 *
 * @param   key
 * @returns value Removed value
 *
 * @throws {Error} if value for specified key does not exists
 */
BinarySearchTree.prototype.delete = function(key) {
    var result = this._search(key);

    if (!result[0]) {
        return false;
    }
    var node = result[1];

    if (node === this._root) {
        this._root = this._removeNode(node);
    }
    else {
        this._removeNode(node);
    }
    this._length--;

    return true;
};

/**
 * Creates new tree base on current.
 * Nodes are not cloned.
 *
 * @returns {BinarySearchTree} New binary searched tree based on current
 */
BinarySearchTree.prototype.clone = function() {
    var nt = new this.constructor();
    nt._cc = this._cc;

    return nt;
};

/**
 * Functional .forEach() method.
 *
 * @param callback Function that is executed once per each element of binary search tree.
 *                 Function has three arguments:
 *                    * value The value of current element being processed in tree.
 *                    * key   The key of current element being processed in tree.
 *                    * three The binary search tree forEach was called upon.
 */
BinarySearchTree.prototype.forEach = function(type, callback) {
    if (this._root === null) {
        return;
    }

    if (typeof type === 'function') {
        callback = type;
        type     = 'in';
    }

    var tree = this;

    var cb = function(node) { callback(node.v, node.k, tree); };

    switch (type) {
        case 'in':
        case 'in:l':
        case 'in:left':
            return inOrderLeft(this._root,     cb);


        case 'in:r':
        case 'in:right':
            return inOrderRight(this._root,    cb);

        case 'pre':
        case 'pre:l':
        case 'pre:left':
            return preOrderLeft(this._root,    cb);

        case 'pre:r':
        case 'pre:right':
            return preOrderRight(this._root,   cb);

        case 'post':
        case 'post:l':
        case 'post:left':
            return postOrderLeft(this._root,   cb);

        case 'post:r':
        case 'post:right':
            return postOrderRight(this._root,  cb);

        case 'level':
        case 'level:l':
        case 'level:left':
            return levelOrderLeft(this._root,  cb);

        case 'level:r':
        case 'level:right':
            return levelOrderRight(this._root, cb);

        default:
            throw new Error('Incorrect traverse type "' + type + '"!');
    }
};

/**
 * Functional .every() method.
 *
 * @param callback Function that is executed once per each element of binary search tree.
 *                 Function has three arguments:
 *                    * value The value of current element being processed in tree.
 *                    * key   The key of current element being processed in tree.
 *                    * three The binary search tree forEach was called upon.
 */
BinarySearchTree.prototype.every = function(type, callback) {
    if (this._root === null) {
        return true;
    }

    if (typeof type === 'function') {
        callback = type;
        type     = 'in';
    }

    var tree = this;

    var cb = function(node) {
        if (!callback(node.v, node.k, tree)) {
            throw 'break';
        }
    };

    try {
        switch (type) {
            case 'in':
            case 'in:l':
            case 'in:left':
                inOrderLeft(this._root, cb);
                break;


            case 'in:r':
            case 'in:right':
                inOrderRight(this._root, cb);
                break;

            case 'pre':
            case 'pre:l':
            case 'pre:left':
                preOrderLeft(this._root, cb);
                break;

            case 'pre:r':
            case 'pre:right':
                preOrderRight(this._root, cb);
                break;

            case 'post':
            case 'post:l':
            case 'post:left':
                postOrderLeft(this._root, cb);
                break;

            case 'post:r':
            case 'post:right':
                postOrderRight(this._root, cb);
                break;

            case 'level':
            case 'level:l':
            case 'level:left':
                levelOrderLeft(this._root, cb);
                break;

            case 'level:r':
            case 'level:right':
                levelOrderRight(this._root, cb);
                break;

            default:
                throw new Error('Incorrect traverse type "' + type + '"!');
        }
    } catch (e) {
        if (e === 'break') {
            return false;
        }
        else {
            throw e;
        }
    }

    return true;
};


/**
 * Functional .some() method.
 *
 * @param callback Function that is executed once per each element of binary search tree.
 *                 Function has three arguments:
 *                    * value The value of current element being processed in tree.
 *                    * key   The key of current element being processed in tree.
 *                    * three The binary search tree forEach was called upon.
 */
BinarySearchTree.prototype.some = function(type, callback) {
    if (this._root === null) {
        return true;
    }

    if (typeof type === 'function') {
        callback = type;
        type     = 'in';
    }

    var tree = this;

    var cb = function(node) {
        if (callback(node.v, node.k, tree)) {
            throw 'break';
        }
    };

    try {
        switch (type) {
            case 'in':
            case 'in:l':
            case 'in:left':
                inOrderLeft(this._root, cb);
                break;


            case 'in:r':
            case 'in:right':
                inOrderRight(this._root, cb);
                break;

            case 'pre':
            case 'pre:l':
            case 'pre:left':
                preOrderLeft(this._root, cb);
                break;

            case 'pre:r':
            case 'pre:right':
                preOrderRight(this._root, cb);
                break;

            case 'post':
            case 'post:l':
            case 'post:left':
                postOrderLeft(this._root, cb);
                break;

            case 'post:r':
            case 'post:right':
                postOrderRight(this._root, cb);
                break;

            case 'level':
            case 'level:l':
            case 'level:left':
                levelOrderLeft(this._root, cb);
                break;

            case 'level:r':
            case 'level:right':
                levelOrderRight(this._root, cb);
                break;

            default:
                throw new Error('Incorrect traverse type "' + type + '"!');
        }
    } catch (e) {
        if (e === 'break') {
            return true;
        }
        else {
            throw e;
        }
    }

    return false;
};

/**
 * Functional .reduce() method.
 *
 * @param callback Function that is executed once per each element of binary search tree.
 *                 Function has three arguments:
 *                    * previousValue The value previously returned in the last invocation of the callback,
 *                                    or initialValue, if supplied
 *                    * currentValue  The value of current element being processed in tree.
 *                    * key           The key of current element being processed in tree.
 *                    * three          The binary search tree forEach was called upon.
 *
 * @param [initialValue] Object to use as the first argument to the first call of the callback.
 *
 * @returns Value return by last callback invocation.
 */
BinarySearchTree.prototype.reduce = function(type, callback, initialValue) {
    if (this._root === null) {
        return true;
    }

    if (typeof type === 'function') {
        initialValue = callback;
        callback     = type;
        type         = 'in';
    }

    var tree = this;
    var result = initialValue;

    var cb = function(node) {
        result = callback(result, node.v, node.k, tree)
    };

    switch (type) {
        case 'in':
        case 'in:l':
        case 'in:left':
            inOrderLeft(this._root, cb);
            break;


        case 'in:r':
        case 'in:right':
            inOrderRight(this._root, cb);
            break;

        case 'pre':
        case 'pre:l':
        case 'pre:left':
            preOrderLeft(this._root, cb);
            break;

        case 'pre:r':
        case 'pre:right':
            preOrderRight(this._root, cb);
            break;

        case 'post':
        case 'post:l':
        case 'post:left':
            postOrderLeft(this._root, cb);
            break;

        case 'post:r':
        case 'post:right':
            postOrderRight(this._root, cb);
            break;

        case 'level':
        case 'level:l':
        case 'level:left':
            levelOrderLeft(this._root, cb);
            break;

        case 'level:r':
        case 'level:right':
            levelOrderRight(this._root, cb);
            break;

        default:
            throw new Error('Incorrect traverse type "' + type + '"!');
    }

    return result;
};


if (global.Symbol) {
    /**
     * Iterator interface.
     * Support for "for of" loop.
     *
     * @yelds Value of node tree.
     */
    BinarySearchTree.prototype[Symbol.iterator] = function() {
        return this.values();
    };
}

/**
 * Creates iterator for node values.
 *
 * @returns {BinarySearchTreeIterator} Iterator for node values.
 */
BinarySearchTree.prototype.values = function() {
    return new Iterator(this, 'v');
};

/**
 * Creates iterator for node keys.
 *
 * @return {BinarySearchTreeIterator} Iterator for node keys.
 */
BinarySearchTree.prototype.keys = function() {
    return new Iterator(this, 'k');
};

/**
 * Creates iterator for node key/value pairs.
 *
 * @returns {BinarySearchTreeIterator} Iterator for node key/value paris.
 */
BinarySearchTree.prototype.entries = function() {
    return new Iterator(this, 'e');
};

/**
 * Comparison of two node keys
 *
 * @param k1
 * @param k2 Second node
 * @returns {Number} negative - if node1 "less then" node 2,
 *                   positive - if node1 "greater then" node2
 *                   0 - otherwise
 */
BinarySearchTree.prototype.compareKeys = function(k1, k2) {
    var cc  = this._cc;
    var res = cc && cc(k1, k2);
    var toString = Object.prototype.toString;

    if (typeof res !== 'undefined') {
        return toString.call(res) === '[object Number]' ? res : (res ? -1 : 1);
    }

    if (k1 === k2) {
        return 0;
    }
    return k1 > k2 ? 1 : -1;
};

/**
 * Search node in subtree specified by its root.
 * If root does not specified than current tree root is taken
 *
 * @param key   Key of searching node
 * @param root  Subtree root. By default current tree root is taken
 * @returns {Array} Array [searchResult, node] where
 *                      * searchResult - true if node was found
 *                      * node         - searched node if it was found, otherwise last checked node
 *
 * @protected
 */
BinarySearchTree.prototype._search = function(key, root) {
    var node = root || this._root, res;

    if (!node) {
        return [false, node];
    }

    while (res = this.compareKeys(key, node.k)) {
        if (res < 0) {
            if (!node.l) {
                return [false, node];
            }
            node = node.l;
        }
        else {
            if (!node.r) {
                return [false, node];
            }
            node = node.r;
        }
    }

    return [true, node];
};

/**
 * Links parent and child nodes
 *
 * @param parent
 * @param child
 * @param [type]
 *
 * @protected
 */
BinarySearchTree.prototype._linkNodes = function(parent, child, type) {
    child.p  = parent;

    var res = this.compareKeys(child.k, parent.k);

    if (res === 0) {
        throw new Error('Could not link parent and child nodes with equal keys!');
    }

    if (typeof type !== 'undefined') {
        switch (type.toLowerCase()) {
            case 'l':
            case 'left':  parent.l = child; break;
            case 'r':
            case 'right': parent.r = child; break;
            default:
                throw new Error('Incorrect link nodes type!');
        }
    }
    else {
        res < 0 ? parent.l = child : parent.r = child;
    }
};

/**
 * Remove specified node
 *
 * @param node
 *
 * @protected
 */
BinarySearchTree.prototype._removeNode = function(node) {
    var parent = node.p;
    var right  = node.l;
    var left   = node.r;

    if (node === this._min) {
        this._min = node.r ? this._getMinNode(node.r) : node.p;
    }
    if (node === this._max) {
        this._max = node.l ? this._getMaxNode(node.l) : node.p;
    }

    var plType = parent && (parent.l === node ? 'left' : 'right'); // parent link type

    if (!left && !right) {
        if (parent) {
            plType === 'left' ? parent.l = null : parent.r = null;
            node.p = null;
        }
        return parent;
    }


    if (!left) {
        if (parent) {
            this._linkNodes(parent, right, plType);
            node.p = null;
        }
        else {
            right.p = null;
        }
        node.r = null;

        return parent || right;
    }

    if (!right) {
        if (parent) {
            this._linkNodes(parent, left, plType);
            node.p = null;
        }
        else {
            left.p = null;
        }
        node.l = null;

        return parent || left;
    }

    this._linkNodes(this._getMaxNode(left), right, 'right');

    if (parent) {
        this._linkNodes(parent, left, plType);
        node.p = null;
    }
    else {
        left.p = null;
    }

    node.l = null;
    node.r = null;

    return parent || left;
};

/**
 * Gets min key node for specified subtree by its root
 * If root does not specified than current tree root is taken
 *
 * @param root Subtree root node
 * @returns Node with minimum key
 *
 * @protected
 */
BinarySearchTree.prototype._getMinNode = function(root) {
    var node = root || this._root;

    while (node.l) {
        node = node.l;
    }

    return node;
};

/**
 * Gets max key node for specified subtree by its root
 * If root does not specified than current tree root is taken
 *
 * @param   root Subtree root node
 * @returns Node with maximum key
 *
 * @protected
 */
BinarySearchTree.prototype._getMaxNode = function(root) {
    var node = root || this._root;

    while (node.r) {
        node = node.r;
    }

    return node;
};