/**
* @fileoverview Blockly Blocks
* @author azanbertre@gmail.com (Pedro Borges)
*/
'use strict';

const Blockly = require('./blockly-main.js');

/**
 *
 */
var Block = function() {

    Blockly.Blocks["NOME_BLOCO"] = {
        init: function() {
            this.jsonInit({
                "type": "TIPO_BLOCO",
                "message0": "MESSAGEM_0",
                "message1": "MESSAGEM_1",
                "args0": [
                    {
                        "type": "TIPO_ARG",
                        "src": "IMAGEM??",
                        "width": TAMANHO,
                        "height": TAMANHO,
                        "alt": "LEGENDA_IMAGEM",
                        "name": "NOME_ARG",
                        "options": [
                            ["NOME", "VALOR"],
                            ["NOME", "VALOR"]
                        ]
                    }
                ],
                "previousStatement": BLOCO_ANTERIOR,
                "nextStatement": PROXIMO_BLOCO,
                "colour": COR
            })
        }
    }
}

/**
 * Create a new Block Factory.
 * @constructor
 */
var UtilityBlocks = function() {

}

/**
 *
 */
UtilityBlocks.Block = Block;
