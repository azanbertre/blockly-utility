'use strict';

var Blockly = require('../lib/blockly_compressed');
var Interpreter = require('../lib/interpreter');

Blockly.setLocale = function (l) {
    try {
        Blockly.Msg = require(`../lib/msg/${l}`)(Blockly);
    } catch(e) {
        throw e;
    }
}

Blockly.setLocale('en');

Blockly.Interpreter = Interpreter;

module.exports = Blockly
