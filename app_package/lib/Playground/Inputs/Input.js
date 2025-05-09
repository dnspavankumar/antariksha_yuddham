"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputManager = exports.Input = void 0;
const core_1 = require("@babylonjs/core");
const State_1 = require("../States/State");
const States_1 = require("../States/States");
const Parameters_1 = require("../Parameters");
const GamepadInput_1 = require("./GamepadInput");
const Settings_1 = require("../../Settings");
const playgroundRunner_1 = require("../../playgroundRunner");
class Input {
    constructor() {
        this.dx = 0;
        this.dy = 0;
        this.shooting = false;
        this.launchMissile = false;
        this.burst = false;
        this.breaking = false;
        this.immelmann = false;
    }
    constrainInput() {
        this.dx = Math.max(Math.min(Parameters_1.Parameters.playerTurnRate, this.dx), -Parameters_1.Parameters.playerTurnRate);
        this.dy = Math.max(Math.min(Parameters_1.Parameters.playerTurnRate, this.dy), -Parameters_1.Parameters.playerTurnRate);
    }
}
exports.Input = Input;
// credit: https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}
class InputManager {
    constructor(scene, canvas) {
        InputManager._scene = scene;
        InputManager._canvas = canvas;
        InputManager.isTouch = isTouchDevice();
        InputManager.setupPointerLock();
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case core_1.KeyboardEventTypes.KEYDOWN:
                    /*if (kbInfo.event.keyCode == 39) {
                        InputManager.input.shooting = true;
                    } else if (kbInfo.event.keyCode == 40) {
                        InputManager.input.launchMissile = true;
                    } else*/ if (kbInfo.event.keyCode == 87) {
                        InputManager.input.burst = true;
                    }
                    else if (kbInfo.event.keyCode == 83) {
                        InputManager.input.breaking = true;
                    }
                    else if (kbInfo.event.keyCode == 81) {
                        InputManager.input.immelmann = true;
                    }
                    break;
                case core_1.KeyboardEventTypes.KEYUP:
                    /*if (kbInfo.event.keyCode == 39) {
                        InputManager.input.shooting = false;
                    } else if (kbInfo.event.keyCode == 40) {
                        InputManager.input.launchMissile = false;
                    } else*/ if (kbInfo.event.keyCode == 87) {
                        InputManager.input.burst = false;
                    }
                    else if (kbInfo.event.keyCode == 83) {
                        InputManager.input.breaking = false;
                    }
                    else if (kbInfo.event.keyCode == 81) {
                        InputManager.input.immelmann = false;
                    }
                    break;
            }
        });
        GamepadInput_1.GamepadInput.initialize();
    }
    static mouseMove(e) {
        if (InputManager.isTouch) {
            return;
        }
        if (GamepadInput_1.GamepadInput.gamepads.length != 0) {
            return;
        }
        const deltaTime = InputManager.deltaTime; //._scene.getEngine().getDeltaTime();
        var movementX = e.movementX ||
            e.mozMovementX ||
            e.webkitMovementX ||
            0;
        var movementY = e.movementY ||
            e.mozMovementY ||
            e.webkitMovementY ||
            0;
        const input = InputManager.input;
        input.dx = movementX * Parameters_1.Parameters.mouseSensitivty * deltaTime;
        input.dy = movementY * Parameters_1.Parameters.mouseSensitivty * deltaTime;
        if (Settings_1.Settings.invertY) {
            input.dy *= -1;
        }
        input.constrainInput();
        input.shooting = e.buttons == 1;
        input.launchMissile = e.buttons == 2;
    }
    static changeCallback(e) {
        const pointerEventType = core_1.Tools.IsSafari() ? "mouse" : "pointer";
        if (document.pointerLockElement === InputManager._canvas ||
            document.mozPointerLockElement === InputManager._canvas ||
            document.webkitPointerLockElement === InputManager._canvas) {
            // we've got a pointerlock for our element, add a mouselistener
            document.addEventListener(`${pointerEventType}move`, InputManager.mouseMove, false);
            document.addEventListener(`${pointerEventType}down`, InputManager.mouseMove, false);
            document.addEventListener(`${pointerEventType}up`, InputManager.mouseMove, false);
        }
        else {
            // pointer lock is no longer active, remove the callback
            document.removeEventListener(`${pointerEventType}move`, InputManager.mouseMove, false);
            document.removeEventListener(`${pointerEventType}down`, InputManager.mouseMove, false);
            document.removeEventListener(`${pointerEventType}up`, InputManager.mouseMove, false);
            State_1.State.setCurrent(States_1.States.inGameMenu);
        }
    }
    ;
    static disablePointerLock() {
        if (!playgroundRunner_1.useNative && !InputManager.isTouch) {
            if (document.exitPointerLock) {
                document.exitPointerLock();
            }
            var canvas = InputManager._canvas;
            if (canvas) {
                canvas.onclick = function () { };
            }
        }
    }
    static setupPointerLock() {
        if (!playgroundRunner_1.useNative && !InputManager.isTouch) {
            // register the callback when a pointerlock event occurs
            document.addEventListener('pointerlockchange', InputManager.changeCallback, false);
            document.addEventListener('mozpointerlockchange', InputManager.changeCallback, false);
            document.addEventListener('webkitpointerlockchange', InputManager.changeCallback, false);
            // when element is clicked, we're going to request a
            // pointerlock
            var canvas = InputManager._canvas;
            canvas.onclick = function () {
                canvas.requestPointerLock =
                    canvas.requestPointerLock ||
                        canvas.mozRequestPointerLock ||
                        canvas.webkitRequestPointerLock;
                // Ask the browser to lock the pointer)
                canvas.requestPointerLock();
            };
        }
    }
    dispose() {
        InputManager.disablePointerLock();
        InputManager._scene.onKeyboardObservable.remove(InputManager._keyboardObserver);
    }
}
exports.InputManager = InputManager;
InputManager._keyboardObserver = null;
InputManager.input = new Input;
InputManager.deltaTime = 0;
InputManager.isTouch = false;
//# sourceMappingURL=Input.js.map