'use strict';

function DoublyLinkedList() {
    this.head = this.tail = null;
    this.length = 0;
}

DoublyLinkedList.prototype = new function () {

    function createNode(value, previousNode, nextNode) {
        return {
            value: value,
            prev: (previousNode ? previousNode : null),
            next: (nextNode ? nextNode : null)
        };
    }

    function insertWhenEmpty(value) {
        /* jshint validthis: true */

        this.head = this.tail = createNode(value);
        this.length = 1;
        return this.head;
    }

    function validateInserting(value, node) {
        /* jshint validthis: true */

        if (!this.length) {
            if (node) {
                throw new Error('List is empty, ' +
                        'where does the target node come from?');
            }
            return insertWhenEmpty.call(this, value);
        }

        if (!node) {
            throw new Error('Target node is missing!');
        }

        return false;
    }

    this.insert = function (value, node) {
        var ret = validateInserting.call(this, value, node);
        if (ret) {
            return ret;
        }

        ret = createNode(value);
        ret.prev = node.prev;
        ret.next = node;

        if (node.prev) {
            node.prev.next = ret;
        } else {
            this.head = ret;
        }

        node.prev = ret;
        this.length++;

        return ret;
    };

    this.insertAfter = function (value, node) {
        var ret = validateInserting.call(this, value, node);
        if (ret) {
            return ret;
        }

        ret = createNode(value);
        ret.prev = node;
        ret.next = node.next;

        if (node.next) {
            node.next.prev = ret;
        } else {
            this.tail = ret;
        }

        node.next = ret;
        this.length++;

        return ret;
    };

    this.remove = function (node) {
        if (!this.length && node) {
            throw new Error('List is empty, what are you trying to remove?');
        }

        if (this.length && !node) {
            throw new Error('Node to remove is missing!');
        }

        if (!node) {
            return;
        }

        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        this.length--;
        node.prev = node.next = null;

        return node;
    };

    this.push = function (val) {
        return this.insertAfter(val, this.tail);
    };

    this.pop = function () {
        return this.remove(this.tail);
    };

    this.shift = function () {
        return this.remove(this.head);
    };

    this.unshift = function (val) {
        return this.insert(val, this.head);
    };

    this.each = function (it) {
        for (var node = this.head; node; node = node.next) {
            it(node.value, node);
        }
    };

};

exports.DoublyLinkedList = DoublyLinkedList;
