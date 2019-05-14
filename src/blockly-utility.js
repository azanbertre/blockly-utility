/**
* @fileoverview Blockly Workspace
* @author azanbertre@gmail.com (Pedro Borges)
*/
'use strict';

const Blockly = require('./blockly-main.js');

/**
 * Create a new Workspace.
 * @param {string} xml XML used to create the Blockly Toolbox.
 * @constructor
 */
// TODO Verificar a necessidade de se passar o xml
var Utility = function(xml) {
    this.toolbox = Blockly.Xml.textToDom(xml);
    this.workspace = null;
}

/**
 * Inject the Blockly toolbox in the page.
 * @param {string} container ID of the html element to be injected.
 */
Utility.prototype.inject = function(container="blockly") {
    this.workspace = Blockly.inject(container, {toolbox: this.toolbox});
}

/**
 * Turn the workspace blocks into code and run them.
 */
Utility.prototype.run = function() {
    var code = Blockly.JavaScript.workspaceToCode(this.workspace);
    var interpreter = new Interpreter(code);
    interpreter.run();
}

module.exports = Utility
