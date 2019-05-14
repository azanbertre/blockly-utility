'use strict';

var Blockly = require('../lib/blockly_compressed.js');

Blockly.setLocale = function (l) {
    try {
        Blockly.Msg = require(`../lib/msg/${l}`)(Blockly);
    } catch(e) {
        throw e;
    }
}

Blockly.setLocale('en');

module.exports = Blockly
