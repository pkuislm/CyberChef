/**
 * @author
 * @copyright
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * SetOutput operation
 */
class SetOutput extends Operation {

    /**
     * SetOutput constructor
     */
    constructor() {
        super();

        this.name = "Set Output";
        this.module = "Default";
        this.description = "Set output.";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Value",
                "type": "string",
                "value": ""
            },
            {
                "name": "Insert previous result",
                "type": "option",
                "value": ["None", "Before", "After"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        switch (args[1]) {
            case "Before":
                return input + args[0];
            case "After":
                return args[0] + input;
            default:
                return args[0];
        }
    }

}

export default SetOutput;
