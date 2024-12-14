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
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return args[0];
    }

}

export default SetOutput;
