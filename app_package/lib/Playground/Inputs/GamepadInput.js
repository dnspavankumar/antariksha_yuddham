"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamepadInput = void 0;
const core_1 = require("@babylonjs/core");
const Settings_1 = require("../../Settings");
const Parameters_1 = require("../Parameters");
const State_1 = require("../States/State");
const States_1 = require("../States/States");
const Input_1 = require("./Input");
class GamepadInput {
    static initialize() {
        const gamepadManager = new core_1.GamepadManager();
        gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
            GamepadInput.gamepads.push(new GamepadInput(gamepad, Input_1.InputManager.input));
            console.log('gamepad connected');
        });
        gamepadManager.onGamepadDisconnectedObservable.add((gamepad, state) => [
            GamepadInput.gamepads.forEach(gm => {
                if (gm._gamepad == gamepad) {
                    gm.dispose();
                }
            })
        ]);
    }
    // can pass in any input to control here
    constructor(gamepad, input) {
        this._gamepad = gamepad;
        this._input = input;
    }
    tick() {
        const input = this._input;
        input.dx = this._gamepad.leftStick.x * Parameters_1.Parameters.playerTurnRate * Settings_1.Settings.sensitivity;
        input.dy = this._gamepad.leftStick.y * Parameters_1.Parameters.playerTurnRate * Settings_1.Settings.sensitivity;
        if (Settings_1.Settings.invertY) {
            input.dy *= -1;
        }
        input.constrainInput();
        input.breaking = (this._gamepad.rightStick.y > 0.3);
        input.burst = (this._gamepad.rightStick.y < -0.3);
        if (this._gamepad instanceof core_1.Xbox360Pad) {
            const pad = this._gamepad;
            input.shooting = pad.rightTrigger != 0;
            input.launchMissile = pad.leftTrigger != 0;
            input.immelmann = pad.buttonLeftStick != 0;
            if (pad.buttonStart) {
                State_1.State.setCurrent(States_1.States.inGameMenu);
            }
        }
        if (this._gamepad instanceof core_1.DualShockPad) {
            const pad = this._gamepad;
            input.shooting = pad.buttonR1 != 0;
            input.launchMissile = pad.rightTrigger != 0;
            input.immelmann = pad.buttonLeftStick != 0;
            if (pad.buttonOptions) {
                State_1.State.setCurrent(States_1.States.inGameMenu);
            }
        }
    }
    dispose() {
    }
}
exports.GamepadInput = GamepadInput;
GamepadInput.gamepads = new Array();
//# sourceMappingURL=GamepadInput.js.map