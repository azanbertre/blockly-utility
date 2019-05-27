'use strict';

const { src, dest, parallel } = require('gulp');
const replace = require('gulp-replace');
const insert = require('gulp-insert');
const concat = require('gulp-concat');

function blockly_main() {
    var srcs = [
        'blockly/blockly_compressed.js',
        'blockly/blocks_compressed.js',
        'blockly/javascript_compressed.js',
        'blockly/dart_compressed.js',
        'blockly/lua_compressed.js',
        'blockly/python_compressed.js',
        'blockly/php_compressed.js'
    ];
    return src(srcs)
        .pipe(concat('blockly_compressed.js'))
        .pipe(insert.append(`
            var JSDOM = require('jsdom').JSDOM;
            var window = new JSDOM().window;
            var document = window.document;

            if (typeof DOMParser !== 'function') {
                Blockly.Xml.utils.textToDomDocument = function(text) {
                    var jsdom = new JSDOM(text, { contentType: 'text/xml' });
                    return jsdom.window.document;
                };
            }
            module.exports = Blockly
        `))
        .pipe(dest('lib'))
}

function blockly_msg() {
    return src('blockly/msg/js/*.js')
        .pipe(insert.wrap('module.exports = function(Blockly){ ', 'return Blockly.Msg;}'))
        .pipe(replace(/goog\.[^\n]*\;/g, ''))
        .pipe(dest('lib/msg'))
}

function interpreter() {
    return src('JS-Interpreter/interpreter.js')
        .pipe(insert.prepend('var acorn = require("acorn");'))
        .pipe(concat('interpreter.js'))
        .pipe(insert.append('module.exports = Interpreter'))
        .pipe(dest('lib'))
}

function acorn() {
    return src('JS-Interpreter/acorn.js')
        .pipe(dest('lib'))
}

exports.default = parallel(
    blockly_main,
    blockly_msg,
    interpreter,
    acorn
)
