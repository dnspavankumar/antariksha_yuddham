"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchInput = void 0;
const gui_1 = require("@babylonjs/gui");
const Input_1 = require("./Input");
const Parameters_1 = require("../Parameters");
const Settings_1 = require("../../Settings");
function makeThumbArea(name, thickness, color, background) {
    const rect = new gui_1.Ellipse();
    rect.name = name;
    rect.thickness = thickness;
    rect.color = color;
    if (background)
        rect.background = background;
    rect.paddingLeft = "0px";
    rect.paddingRight = "0px";
    rect.paddingTop = "0px";
    rect.paddingBottom = "0px";
    return rect;
}
class TouchButton {
    constructor(name, text, adt) {
        this.container = new gui_1.Container(name);
        this.container.isPointerBlocker = true;
        this.text = new gui_1.TextBlock(`${name}Text`, text);
        this.container.addControl(this.text);
        this.text.color = 'white';
        this.circle = new gui_1.Ellipse(`${name}Circle`);
        this.container.addControl(this.circle);
        this.circle.width = 0.8;
        this.circle.height = 0.8;
        this.circle.color = 'white';
        this.container.left = -10;
        this.container.top = -10;
        this.container.verticalAlignment = gui_1.Button.VERTICAL_ALIGNMENT_BOTTOM;
        this.container.horizontalAlignment = gui_1.Button.HORIZONTAL_ALIGNMENT_RIGHT;
        this.container.background = "transparent";
        this.container.color = "white";
        this.onPointerDownObservable = this.container.onPointerDownObservable;
        this.onPointerUpObservable = this.container.onPointerUpObservable;
        this.onPointerDownObservable.add(() => this.circle.width = this.circle.height = 0.7);
        this.onPointerUpObservable.add(() => this.circle.width = this.circle.height = 0.8);
        adt.addControl(this.container);
    }
    set color(color) {
        this.text.color = color;
        this.circle.color = color;
    }
    get color() {
        return this.text.color;
    }
    setSize(size) {
        this.container.widthInPixels = this.container.heightInPixels = size;
    }
}
class TouchInput {
    constructor(adt, shipManager) {
        this._xAddPos = 0;
        this._yAddPos = 0;
        this._adt = adt;
        this._shipManager = shipManager;
        this._xAddPos = 0;
        let sideJoystickOffset = 10;
        let bottomJoystickOffset = -10;
        this._leftThumbContainer = makeThumbArea("this._leftThumb", 2, "blue", null);
        this._leftThumbContainer.isPointerBlocker = true;
        this._leftThumbContainer.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._leftThumbContainer.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._leftThumbContainer.alpha = 0.4;
        this._leftThumbContainer.left = sideJoystickOffset;
        this._leftThumbContainer.top = bottomJoystickOffset;
        this._leftInnerThumbContainer = makeThumbArea("leftInnerThumb", 4, "blue", null);
        this._leftInnerThumbContainer.height = 0.4;
        this._leftInnerThumbContainer.width = 0.4;
        this._leftInnerThumbContainer.isPointerBlocker = true;
        this._leftInnerThumbContainer.horizontalAlignment =
            gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._leftInnerThumbContainer.verticalAlignment =
            gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
        this._leftPuck = makeThumbArea("this._leftPuck", 0, "blue", "blue");
        this._leftPuck.height = 0.4;
        this._leftPuck.width = 0.4;
        this._leftPuck.isPointerBlocker = true;
        this._leftPuck.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._leftPuck.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
        const _this = this;
        let leftPuckFloatLeft, leftPuckFloatTop, leftPuckIsDown = false;
        this._leftThumbContainer.onPointerDownObservable.add(function (coordinates) {
            _this._leftPuck.isVisible = true;
            leftPuckFloatLeft =
                coordinates.x -
                    _this._leftThumbContainer._currentMeasure.width * 0.5 -
                    sideJoystickOffset;
            _this._leftPuck.left = leftPuckFloatLeft;
            leftPuckFloatTop =
                adt._canvas.height -
                    coordinates.y -
                    _this._leftThumbContainer._currentMeasure.height * 0.5 +
                    bottomJoystickOffset;
            _this._leftPuck.top = leftPuckFloatTop * -1;
            leftPuckIsDown = true;
            _this._leftThumbContainer.alpha = 0.9;
        });
        this._leftThumbContainer.onPointerUpObservable.add(function (coordinates) {
            _this._xAddPos = 0;
            _this._yAddPos = 0;
            leftPuckIsDown = false;
            _this._leftPuck.isVisible = false;
            _this._leftThumbContainer.alpha = 0.4;
        });
        this._leftThumbContainer.onPointerMoveObservable.add(function (coordinates) {
            if (leftPuckIsDown) {
                _this._xAddPos =
                    coordinates.x -
                        _this._leftThumbContainer._currentMeasure.width * 0.5 -
                        sideJoystickOffset;
                _this._yAddPos =
                    adt._canvas.height -
                        coordinates.y -
                        _this._leftThumbContainer._currentMeasure.height * 0.5 +
                        bottomJoystickOffset;
                leftPuckFloatLeft = _this._xAddPos;
                leftPuckFloatTop = _this._yAddPos * -1;
                _this._leftPuck.left = leftPuckFloatLeft;
                _this._leftPuck.top = leftPuckFloatTop;
            }
        });
        adt.addControl(this._leftThumbContainer);
        this._leftThumbContainer.addControl(this._leftInnerThumbContainer);
        this._leftThumbContainer.addControl(this._leftPuck);
        this._leftPuck.isVisible = false;
        this._fireButton = new TouchButton("fireButton", "FIRE", adt);
        this._fireButton.color = "orange";
        this._fireButton.onPointerDownObservable.add(() => {
            Input_1.InputManager.input.shooting = true;
            this._fireButton.color = "white";
        });
        this._fireButton.onPointerUpObservable.add(() => {
            Input_1.InputManager.input.shooting = false;
            this._fireButton.color = "orange";
        });
        this._missileButton = new TouchButton("missileButton", "MISSILE", adt);
        this._missileButton.color = "grey";
        this._missileButton.onPointerDownObservable.add(() => {
            Input_1.InputManager.input.launchMissile = true;
            this._missileButton.color = "white";
        });
        this._missileButton.onPointerUpObservable.add(() => {
            Input_1.InputManager.input.launchMissile = false;
        });
        this._burstButton = new TouchButton("burstButton", "BURST", adt);
        this._burstButton.color = "blue";
        this._burstButton.onPointerDownObservable.add(() => {
            Input_1.InputManager.input.burst = true;
        });
        this._burstButton.onPointerUpObservable.add(() => {
            Input_1.InputManager.input.burst = false;
        });
        this._brakeButton = new TouchButton("brakeButton", "BRAKE", adt);
        this._brakeButton.color = "yellow";
        this._brakeButton.container.horizontalAlignment = gui_1.Button.HORIZONTAL_ALIGNMENT_LEFT;
        this._brakeButton.container.leftInPixels = 10;
        this._brakeButton.onPointerDownObservable.add(() => {
            Input_1.InputManager.input.breaking = true;
        });
        this._brakeButton.onPointerUpObservable.add(() => {
            Input_1.InputManager.input.breaking = false;
        });
        this._flipButton = new TouchButton("flipButton", "FLIP", adt);
        this._flipButton.color = "pink";
        this._flipButton.container.horizontalAlignment = gui_1.Button.HORIZONTAL_ALIGNMENT_LEFT;
        this._flipButton.container.leftInPixels = 10;
        this._flipButton.onPointerDownObservable.add(() => {
            Input_1.InputManager.input.immelmann = true;
        });
        this._flipButton.onPointerUpObservable.add(() => {
            Input_1.InputManager.input.immelmann = false;
        });
    }
    tick() {
        const thirdOfScreen = Math.min((this._adt.getSize().width - 20) * 0.3, (this._adt.getSize().height - 20) * 0.3);
        this._leftThumbContainer.widthInPixels = this._leftThumbContainer.heightInPixels = thirdOfScreen;
        this._fireButton.setSize(thirdOfScreen);
        this._fireButton.container.heightInPixels = this._fireButton.container.widthInPixels = thirdOfScreen;
        this._missileButton.setSize(thirdOfScreen);
        this._missileButton.container.topInPixels = -30 - thirdOfScreen * 2;
        this._burstButton.setSize(thirdOfScreen);
        this._burstButton.container.topInPixels = -20 - thirdOfScreen;
        this._brakeButton.setSize(thirdOfScreen);
        this._brakeButton.container.topInPixels = -20 - thirdOfScreen;
        this._flipButton.setSize(thirdOfScreen);
        this._flipButton.container.topInPixels = -30 - thirdOfScreen * 2;
        Input_1.InputManager.input.dx = this._xAddPos / 3000;
        Input_1.InputManager.input.dy = (this._yAddPos / 3000) * -1;
        if (Settings_1.Settings.invertY) {
            Input_1.InputManager.input.dy *= -1;
        }
        Input_1.InputManager.input.constrainInput();
        const player = this._shipManager.ships[0];
        if (player.missileCooldown <= 0 &&
            player.bestPreyTime >= Parameters_1.Parameters.timeToLockMissile &&
            player.bestPrey >= 0) {
            this._missileButton.color = "red";
        }
        else {
            this._missileButton.color = "grey";
        }
    }
}
exports.TouchInput = TouchInput;
//# sourceMappingURL=TouchInput.js.map