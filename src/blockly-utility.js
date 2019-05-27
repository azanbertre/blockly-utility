/**
* @fileoverview Blockly Workspace
* @author azanbertre@gmail.com (Pedro Borges)
*/
'use strict';

const Blockly = require('./blockly-main.js');
const Interpreter = Blockly.Interpreter;

/**
 * Create a new Utility.
 * @param {string} xml XML used to create the Blockly Toolbox.
 * @constructor
 */
// TODO Verificar a necessidade de se passar o xml
var Utility = function(xml) {
    this._toolbox = Blockly.Xml.textToDom(xml);
    this._functions = {};
    this._highlightPause = false;
    this.pid = 0;
}

/**
 * Blockly reference.
 * @type {Blockly}
 */
Utility.Blockly = Blockly;

/**
 * Current Blockly workspace instance.
 * @type {Blockly.Workspace}
 */
Utility.Workspace = null;

/**
 * Create a new Workspace.
 * If container specified, inject Blockly in the page, else, create a headless workspace.
 * @param {string} container ID of the html element to be injected, defaults to null.
 * @return {Blockly.Workspace} The generated Workspace.
 */
Utility.prototype.createWorkspace = function(container=null) {
    if(!container) this.Workspace = new Blockly.Workspace();
    else this.Workspace = Blockly.inject(container, {toolbox: this._toolbox});
    return this.Workspace;
}

/**
 * Create a new Interpreter.
 * If code specified, will use it on the new Interpreter, else, get the workspace code in JavaScript.
 * @param {string} code JavaScript code to be executed in the interpreter.
 * @param {string} api JS-Interpreter function api to be used in the interpreter.
 * @return {Interpreter} The created Interpreter.
 */
Utility.prototype.createInterpreter = function(code=null, api=null) {
    var c = code || this.getCode();
    var api = api || this.interpreterAPI;
    var interpreter = new Interpreter(c, this.interpreterAPI);
    return interpreter;
}

/**
 * Get the workspace to code in any of Blockly's supported languages.
 * @param {string} language Programming language to be used by Blockly, defaults to JavaScript.
 * @return {string} The code in the specified language.
 */
Utility.prototype.getCode = function(language='JavaScript') {
    return Blockly[language].workspaceToCode(this.Workspace);
}

/**
 * Run the given JavaScript code using an instance of the JS-Interpreter.
 * @param {string} code JavaScript code to be executed in the interpreter.
 */
Utility.prototype.runCode(code) {
    var interpreter = new Interpreter(code);
    interpreter.run();
}

/**
 * Turn the workspace blocks into code and run all at once.
 */
Utility.prototype.run = function() {
    var code = this.getCode();
    var interpreter = new Interpreter(code);
    interpreter.run();
}

/**
 * Execute one step of the workspace code.
 * @param {Interpreter} interpreter JS-Interpreter instance.
 */
Utility.prototype.step = function(interpreter) {
    this._highlightPause = false;
    do {
        try {
            var hasMoreCode = interpreter.step();
        } finally {
            if(!hasMoreCode) {
                this.stop();
                return;
            }
        }
    } while(hasMoreCode && !this._highlightPause);
}

/**
 * Turn the workspace blocks into code and run it block by block.
 * @param {number} delay Time in milliseconds between each step.
 */
Utility.prototype.stepRun = function(delay = 500) {
    var interpreter;
    var g = function(delay) {
        if(!interpreter) {
            let code = this.getCode();
            interpreter = this.createInterpreter();
            setTimeout(function() {
                this._highlightPause = true;
            }.bind(this), 1);
            g(delay);
        } else {
            this.pid = setTimeout(function() {
                g(delay);
                this.step(interpreter);
            }.bind(this), delay);
        }

    }.bind(this);
}

/**
 * Function used by the Interpreter when executing.
 * @param {Interpreter} interpreter JS-interpreter stance.
 * @param {!Interpreter.Object} scope Global scope.
 */
Utility.prototype.interpreterAPI = function(interpreter, scope) {
    var highlightBlock = function(id) {
        this.Workspace.highlightBlock(id);
        this._highlightPause = true;
    }.bind(this);

    var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
    }
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));

    for(var name in this._functions) {
        var obj = this._functions[name];
        var n = name;
        interpreter.setProperty(scope, name,
            interpreter.createNativeFunction(
                (fname, param=null) => {
                    return obj[n](fname, param);
                }
            ));
    }
}

/**
 * Stop the execution of the code and clear the workspace.
 */
Utility.prototype.stop = function() {
    this.Interpreter = null;
    this.Workspace.highlightBlock(null);
    clearTimeout(this.pid);
}

/**
 * Add a fuction to be executed when calling run or stepRun.
 * @param {string} name Name of the function.
 * @param {Object} obj Object which has the function.
 */
Utility.prototype.addToExecution = function(name, obj) {
    this._functions[name] = obj;
}

module.exports = Utility
