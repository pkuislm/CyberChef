/**
 * @author
 * @copyright
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Dish from "../Dish.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * SetRegister operation
 */
class SetRegister extends Operation {

    /**
     * SetRegister constructor
     */
    constructor() {
        super();

        this.name = "Set Register";
        this.flowControl = true;
        this.module = "Default";
        this.description = "Store an specified value in registers which can then be passed into subsequent operations as arguments. <br><br>To use registers in arguments, refer to them using the notation <code>$Rn</code> where n is the register number, starting at 0.<br><br>For example:<br>Input: <code>Test</code><br>Extractor: <code>(.*)</code><br>Argument: <code>$R0</code> becomes <code>Test</code><br><br>Registers can be escaped in arguments using a backslash. e.g. <code>\\$R0</code> would become <code>$R0</code> rather than <code>Test</code>.";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Value",
                "type": "string",
                "value": ""
            },
            {
                "name": "Use output",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    async run(state) {
        const ings = state.opList[state.progress].ingValues;
        const [value, u] = ings;

        const c = u ? await state.dish.get(Dish.STRING) : value ?? "";

        if (!c) {
            return state;
        }

        if (isWorkerEnvironment()) {
            self.setRegisters(state.forkOffset + state.progress, state.numRegisters, [c]);
        }

        /**
         * Replaces references to registers (e.g. $R0) with the contents of those registers.
         *
         * @param {string} str
         * @returns {string}
         */
        function replaceRegister(str) {
            // Replace references to registers ($Rn) with contents of registers
            return str.replace(/(\\*)\$R(\d{1,2})/g, (match, slashes, regNum) => {
                const index = parseInt(regNum, 10) + 1;
                if (index <= state.numRegisters || index >= state.numRegisters + 2)
                    return match;
                if (slashes.length % 2 !== 0) return match.slice(1); // Remove escape
                return slashes + c;
            });
        }

        // Step through all subsequent ops and replace registers in args with extracted content
        for (let i = state.progress + 1; i < state.opList.length; i++) {
            if (state.opList[i].disabled) continue;

            let args = state.opList[i].ingValues;
            args = args.map(arg => {
                if (typeof arg !== "string" && typeof arg !== "object") return arg;

                if (typeof arg === "object" && Object.prototype.hasOwnProperty.call(arg, "string")) {
                    arg.string = replaceRegister(arg.string);
                    return arg;
                }
                return replaceRegister(arg);
            });
            state.opList[i].ingValues = args;
        }

        state.numRegisters += 1;
        return state;
    }

}

export default SetRegister;
