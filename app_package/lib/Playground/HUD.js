"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HUD = void 0;
const gui_1 = require("@babylonjs/gui");
const core_1 = require("@babylonjs/core");
const Parameters_1 = require("./Parameters");
const Input_1 = require("./Inputs/Input");
const TouchInput_1 = require("./Inputs/TouchInput");
const Settings_1 = require("../Settings");
const GuiFramework_1 = require("./GuiFramework");
class HUDPanel {
    //private _fpsCounter: TextBlock;
    constructor(assets, adt, divisor, index) {
        this._targets = new Array();
        this._divisor = divisor;
        this._index = index;
        /*this._fpsCounter = new TextBlock();
        this._fpsCounter.text= "00000000";
        this._fpsCounter.width = 0.2;
        this._fpsCounter.height = "40px";
        this._fpsCounter.color = "white";
        this._fpsCounter.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._fpsCounter.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._fpsCounter.top = "0px";
        this._fpsCounter.left = "0px";
        adt.addControl(this._fpsCounter);
*/
        for (let i = 0; i < 20; i++) {
            var image = new gui_1.Image("img", assets.assetsHostUrl + "/assets/UI/trackerIcon.svg");
            image.height = "32px";
            image.width = "32px";
            image.isVisible = false;
            adt.addControl(image);
            this._targets.push(image);
            image.alpha = 0.4;
        }
        this._targetLock = new gui_1.Image("img", assets.assetsHostUrl + "/assets/UI/missileLockIcon.svg");
        this._targetLock.height = "128px";
        this._targetLock.width = "128px";
        this._targetLock.sourceWidth = 256;
        this._targetLock.sourceLeft = 0;
        this._targetLock.isVisible = false;
        adt.addControl(this._targetLock);
        // this._bars = new StackPanel("bars");
        // this._bars.paddingBottomInPixels = 20;
        // if (index) {
        //     this._bars.leftInPixels = 20;
        //     this._bars.horizontalAlignment = StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
        // } else {
        //     this._bars.leftInPixels = 20;
        //     this._bars.horizontalAlignment = InputManager.isTouch ? StackPanel.HORIZONTAL_ALIGNMENT_CENTER : StackPanel.HORIZONTAL_ALIGNMENT_LEFT;
        // }
        // this._bars.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_BOTTOM;
        // this._bars.width = 0.2;
        // adt.addControl(this._bars);
        this._statsPanel = new gui_1.Rectangle("statsPanel");
        this._statsPanel.heightInPixels = 185;
        this._statsPanel.thickness = 0;
        if (index) {
            if (Input_1.InputManager.isTouch) {
                this._statsPanel.width = 1.0;
                this._statsPanel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
                this._statsPanel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            }
            else {
                this._statsPanel.widthInPixels = 425;
                this._statsPanel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
                this._statsPanel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                this._statsPanel.left = "-90px";
                this._statsPanel.top = "-90px";
            }
        }
        else {
            if (Input_1.InputManager.isTouch) {
                this._statsPanel.width = 1.0;
                this._statsPanel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
                this._statsPanel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            }
            else {
                this._statsPanel.widthInPixels = 425;
                this._statsPanel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
                this._statsPanel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                this._statsPanel.left = "90px";
                this._statsPanel.top = "-90px";
            }
        }
        adt.addControl(this._statsPanel);
        this._statsPanelImage = new gui_1.Image("statsPanelImage", "/assets/UI/statsPanel.svg");
        this._statsPanelImage.widthInPixels = 300;
        this._statsPanelImage.heightInPixels = 185;
        this._statsPanelImage.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        if (Input_1.InputManager.isTouch === false) {
            this._statsPanel.addControl(this._statsPanelImage);
        }
        this._statsGrid = new gui_1.Grid();
        this._statsGrid.addColumnDefinition(45, true);
        this._statsGrid.addColumnDefinition(1.0, false);
        if (Input_1.InputManager.isTouch) {
            this._statsGrid.addRowDefinition(15, true);
            this._statsGrid.addRowDefinition(15, true);
            this._statsGrid.addRowDefinition(15, true);
        }
        else {
            this._statsGrid.addRowDefinition(40, true);
            this._statsGrid.addRowDefinition(40, true);
            this._statsGrid.addRowDefinition(40, true);
            this._statsGrid.top = "38px";
        }
        this._statsGrid.widthInPixels = 200;
        this._statsGrid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._statsGrid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        this._statsPanel.addControl(this._statsGrid);
        let size = (Input_1.InputManager.isTouch) ? 10 : 35;
        this._healthIcon = new gui_1.Image("health", "/assets/UI/healthIcon.svg");
        this._healthIcon.widthInPixels = size;
        this._healthIcon.heightInPixels = size;
        this._statsGrid.addControl(this._healthIcon, 0, 0);
        this._speedIcon = new gui_1.Image("health", "/assets/UI/speedIcon.svg");
        this._speedIcon.widthInPixels = size;
        this._speedIcon.heightInPixels = size;
        this._statsGrid.addControl(this._speedIcon, 1, 0);
        this._reloadIcon = new gui_1.Image("health", "/assets/UI/reloadIcon.svg");
        this._reloadIcon.widthInPixels = size;
        this._reloadIcon.heightInPixels = size;
        this._statsGrid.addControl(this._reloadIcon, 2, 0);
        this._health = new gui_1.Slider("health");
        this._health.color = "#af2d0e";
        this._health.background = "#878787";
        this._health.height = 1.0;
        this._health.displayThumb = false;
        this._health.minimum = 0;
        this._health.maximum = 100;
        this._statsGrid.addControl(this._health, 0, 1);
        this._speed = new gui_1.Slider("Speed");
        this._speed.color = "#e8b410";
        this._speed.background = "#878787";
        this._speed.height = 1.0;
        this._speed.displayThumb = false;
        this._speed.minimum = 0;
        this._speed.maximum = 1;
        this._statsGrid.addControl(this._speed, 1, 1);
        this._missile = new gui_1.Slider("MissileLoading");
        this._missile.background = "#05d000";
        this._missile.color = "#878787";
        this._missile.rotation = Math.PI;
        this._missile.height = 1.0;
        this._missile.displayThumb = false;
        this._missile.minimum = 0;
        this._missile.maximum = Parameters_1.Parameters.missileCoolDownTime;
        this._statsGrid.addControl(this._missile, 2, 1);
    }
    tick(engine, player, shipManager) {
        // hide every image
        this._targets.forEach(image => {
            image.isVisible = false;
        });
        let targetIndex = 0;
        shipManager.ships.forEach((ship) => {
            if (ship.isValid() && ship != player && ship.faction != player.faction) {
                this._computeScreenCoord(engine, player.shipCamera.getFreeCamera(), ship.root.position, this._targets[targetIndex]);
                targetIndex++;
            }
        });
        this._missile.value = player.missileCooldown;
        this._speed.value = player.speedRatio;
        this._health.value = player.life;
        if (player.bestPrey > 0 && shipManager.ships[player.bestPrey] && player.shipCamera) {
            const interpolate = Math.min(player.bestPreyTime / Parameters_1.Parameters.timeToLockMissile, 1);
            this._computeScreenCoord(engine, player.shipCamera.getFreeCamera(), shipManager.ships[player.bestPrey].root.position, this._targetLock, interpolate);
            this._targetLock.rotation = 1. - interpolate;
            // this._targetLock.width = 0.1 - interpolate * 0.075;
            // this._targetLock.height = 0.4 - interpolate * 0.3;
            this._targetLock.isVisible = true;
            if (interpolate > 0.99) {
                this._targetLock.sourceLeft = 256;
                // this._targetLock.color = "red";
                // this._targetLock.alpha = 1;
            }
            else {
                this._targetLock.sourceLeft = 0;
                // this._targetLock.color = "white";
                // this._targetLock.alpha = 0.5 + interpolate * 0.5;
            }
        }
        else {
            this._targetLock.isVisible = false;
        }
        //this._fpsCounter.text = engine.getFps().toFixed() + " fps";
    }
    setAlpha(alpha) {
        // this._bars.alpha = alpha;
        this._statsPanel.alpha = alpha;
        this._missile.alpha = alpha;
        this._speed.alpha = alpha;
        this._health.alpha = alpha;
        this._targets.forEach(image => {
            image.alpha = alpha * 0.4;
        });
        this._targetLock.alpha = alpha * 0.4;
        //this._fpsCounter.alpha = alpha;
    }
    _computeScreenCoord(engine, camera, position, image, centerInterpolate = 1) {
        const w = (engine.getRenderWidth() * 0.5);
        const h = engine.getRenderHeight() * 0.5;
        var spo0 = core_1.Vector4.TransformCoordinates(position, camera.getViewMatrix());
        var spo1 = core_1.Vector4.TransformCoordinates(new core_1.Vector3(spo0.x, spo0.y, spo0.z), camera.getProjectionMatrix());
        spo1.x /= spo1.w;
        spo1.y /= spo1.w;
        var l = spo1.x * w * centerInterpolate;
        var t = -spo1.y * h * centerInterpolate;
        var visible = spo1.z < 0;
        if (visible && spo1.z < 0) {
            t *= -1000;
            l *= -1000;
        }
        if (l < -w) {
            l = -w + 0.05 * w;
            visible = true;
        }
        else if (l > w) {
            l = w - 0.05 * w;
            visible = true;
        }
        if (t < -h) {
            t = -h + 0.1 * h;
            visible = true;
        }
        else if (t > h) {
            t = h - 0.1 * h;
            visible = true;
        }
        l /= this._divisor;
        l += (this._index * this._divisor - Math.floor(this._divisor / 2)) * w / this._divisor;
        image.left = l;
        image.top = t;
        image.rotation = Math.atan2(spo1.x, spo1.y) + ((spo1.z < 0) ? Math.PI : 0);
        image.isVisible = visible;
    }
}
class HUD {
    constructor(shipManager, assets, scene, players) {
        this._touchInput = null;
        console.log(JSON.stringify(Object.getOwnPropertyNames(Parameters_1.Parameters)));
        this._shipManager = shipManager;
        this._adt = gui_1.AdvancedDynamicTexture.CreateFullscreenUI("HUD", true, scene);
        this._adt.layer.layerMask = 0x10000000;
        this._resizeListener = this._resizeListener.bind(this);
        window.addEventListener("resize", this._resizeListener);
        this._hudPanels = new Array();
        for (let i = 0; i < players.length; i++) {
            this._hudPanels.push(new HUDPanel(assets, this._adt, players.length, i));
        }
        this._aiCounter = new gui_1.Rectangle("aiCounter");
        this._aiCounter.thickness = 0;
        if (Input_1.InputManager.isTouch) {
            this._aiCounter.height = 0.1;
            this._aiCounter.width = 1.0;
            this._aiCounter.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
            this._aiCounter.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        }
        else {
            this._aiCounter.heightInPixels = 185;
            this._aiCounter.widthInPixels = 445;
            this._aiCounter.left = "80px";
            this._aiCounter.top = "-90px";
            this._aiCounter.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            this._aiCounter.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        }
        this._adt.addControl(this._aiCounter);
        this._aiCounterGrid = new gui_1.Grid();
        this._aiCounterGrid.addRowDefinition(0.55, false);
        this._aiCounterGrid.addRowDefinition(0.45, false);
        this._aiCounterGrid.addColumnDefinition(0.5, false);
        this._aiCounterGrid.addColumnDefinition(300, true);
        this._aiCounterGrid.addColumnDefinition(0.5, false);
        this._aiCounterGrid.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._aiCounterGrid.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_CENTER;
        this._aiCounterGrid.height = 1.0;
        this._aiCounterGrid.width = 1.0;
        this._aiCounter.addControl(this._aiCounterGrid);
        this._alliesRemaining = new gui_1.TextBlock("alliesRemaining");
        this._alliesRemaining.color = "white";
        if (Input_1.InputManager.isTouch) {
            this._alliesRemaining.height = 1.0;
            this._alliesRemaining.fontSize = "15px";
        }
        else {
            this._alliesRemaining.heightInPixels = 40;
            this._alliesRemaining.fontSize = "30px";
        }
        this._alliesRemaining.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._alliesRemaining.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._alliesRemaining.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._alliesRemaining.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        GuiFramework_1.GuiFramework.setFont(this._alliesRemaining, true, true);
        this._aiCounterGrid.addControl(this._alliesRemaining, 0, 0);
        this._alliesRemainingLabel = new gui_1.TextBlock("_alliesRemainingLabel");
        this._alliesRemainingLabel.color = "white";
        if (Input_1.InputManager.isTouch) {
            this._alliesRemainingLabel.height = 1.0;
            this._alliesRemainingLabel.fontSize = "10px";
        }
        else {
            this._alliesRemainingLabel.heightInPixels = 40;
            this._alliesRemainingLabel.fontSize = "14px";
        }
        this._alliesRemainingLabel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._alliesRemainingLabel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        this._alliesRemainingLabel.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._alliesRemainingLabel.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        GuiFramework_1.GuiFramework.setFont(this._alliesRemainingLabel, true, true);
        this._aiCounterGrid.addControl(this._alliesRemainingLabel, 1, 0);
        this._enemiesRemaining = new gui_1.TextBlock("enemiesRemaining");
        this._enemiesRemaining.color = "white";
        if (Input_1.InputManager.isTouch) {
            this._enemiesRemaining.height = 1.0;
            this._enemiesRemaining.fontSize = "15px";
        }
        else {
            this._enemiesRemaining.heightInPixels = 40;
            this._enemiesRemaining.fontSize = "30px";
        }
        this._enemiesRemaining.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._enemiesRemaining.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._enemiesRemaining.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._enemiesRemaining.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
        GuiFramework_1.GuiFramework.setFont(this._enemiesRemaining, true, true);
        this._aiCounterGrid.addControl(this._enemiesRemaining, 0, 2);
        this._enemiesRemainingLabel = new gui_1.TextBlock("_enemiesRemainingLabel");
        this._enemiesRemainingLabel.color = "white";
        if (Input_1.InputManager.isTouch) {
            this._enemiesRemainingLabel.height = 1.0;
            this._enemiesRemainingLabel.fontSize = "10px";
        }
        else {
            this._enemiesRemainingLabel.heightInPixels = 40;
            this._enemiesRemainingLabel.fontSize = "14px";
        }
        this._enemiesRemainingLabel.horizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._enemiesRemainingLabel.verticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        this._enemiesRemainingLabel.textHorizontalAlignment = gui_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._enemiesRemainingLabel.textVerticalAlignment = gui_1.Control.VERTICAL_ALIGNMENT_TOP;
        GuiFramework_1.GuiFramework.setFont(this._enemiesRemainingLabel, true, true);
        this._aiCounterGrid.addControl(this._enemiesRemainingLabel, 1, 2);
        if (Parameters_1.Parameters.AIDebugLabels) {
            this._shipManager.ships.forEach(ship => {
                const text = new gui_1.TextBlock("shiplable");
                this._adt.addControl(text);
                text.linkWithMesh(ship.root);
                text.color = "white";
                text.isVisible = false; // Comment out to see AI debug labels
                text.fontFamily = "'Courier New', monospace";
                ship.debugLabel = text;
            });
        }
        this._parameters = this.makeParametersPanel();
        this._parameters.horizontalAlignment = gui_1.StackPanel.HORIZONTAL_ALIGNMENT_RIGHT;
        this._parameters.verticalAlignment = gui_1.StackPanel.VERTICAL_ALIGNMENT_TOP;
        this._parameters.widthInPixels = 350;
        this._parameters.paddingTopInPixels = 20;
        this._parameters.isVisible = !Input_1.InputManager.isTouch;
        this._adt.addControl(this._parameters);
        if (Input_1.InputManager.isTouch) {
            this._touchInput = new TouchInput_1.TouchInput(this._adt, this._shipManager);
        }
    }
    _resizeListener() {
        if (this._adt && this._adt.getScene()) {
            console.log(this._adt.getScene().getEngine().getRenderWidth());
            this._adt.scaleTo(this._adt.getScene().getEngine().getRenderWidth(), this._adt.getScene().getEngine().getRenderHeight());
        }
    }
    tick(engine, gameSpeed, players) {
        this._parameters.isVisible = Settings_1.Settings.showParameters;
        let enemyCount = 0, allyCount = 0;
        this._hudPanels.forEach((hudPanel, index) => {
            hudPanel.tick(engine, players[index], this._shipManager);
        });
        this._shipManager.ships.forEach((ship, shipIndex) => {
            if (ship.isValid()) {
                if (ship.faction == 1) {
                    enemyCount++;
                }
                else if (!ship.isHuman) {
                    allyCount++;
                }
                if (Parameters_1.Parameters.AIDebugLabels) {
                    const movement = `${ship.input.burst ? 'bursting' : ''}${ship.input.breaking ? 'breaking' : ''}`;
                    ship.debugLabel.text = `${ship.state}\nidx: ${shipIndex} tgt: ${ship.bestPrey}\n${movement}`;
                    ship.debugLabel.isVisible = Parameters_1.Parameters.AIDebugLabels;
                }
            }
        });
        this._enemiesRemaining.text = `${enemyCount}`;
        this._alliesRemaining.text = `${allyCount}`;
        this._alliesRemainingLabel.text = "ALLIES";
        this._enemiesRemainingLabel.text = "ENEMIES";
        // tick alpha from game speed, should hide HUD instead
        this._aiCounter.alpha = gameSpeed;
        this._hudPanels.forEach((hudPanel) => {
            hudPanel.setAlpha(gameSpeed);
        });
        if (this._touchInput) {
            this._touchInput.tick();
        }
    }
    makeParametersPanel() {
        const panel = new gui_1.StackPanel("parameters");
        Parameters_1.Parameters.getParameters().forEach(param => {
            console.log(param);
            const container = new gui_1.StackPanel(`${param} container`);
            container.isVertical = false;
            container.adaptHeightToChildren = true;
            container.widthInPixels = 350;
            const text = new gui_1.TextBlock(`param ${param}`, param);
            text.color = 'white';
            text.fontSizeInPixels = 20;
            text.heightInPixels = 20;
            text.widthInPixels = 250;
            container.addControl(text);
            switch (typeof Parameters_1.Parameters[param]) {
                case "number":
                case "string":
                    const input = new gui_1.InputText(`${param} input`, Parameters_1.Parameters[param]);
                    input.background = 'black';
                    input.color = 'white';
                    input.widthInPixels = 70;
                    input.onTextChangedObservable.add(() => {
                        let val = Parameters_1.Parameters[param];
                        if (typeof val === 'number') {
                            if (!isNaN(parseFloat(input.text))) {
                                val = parseFloat(input.text);
                            }
                        }
                        else {
                            val = input.text;
                        }
                        Parameters_1.Parameters[param] = val;
                    });
                    container.addControl(input);
                    break;
                case "boolean":
                    const checkbox = new gui_1.Checkbox(`${param} input`);
                    checkbox.isChecked = Parameters_1.Parameters[param];
                    checkbox.onIsCheckedChangedObservable.add(() => {
                        Parameters_1.Parameters[param] = checkbox.isChecked;
                    });
                    checkbox.widthInPixels = 20;
                    checkbox.heightInPixels = 20;
                    checkbox.color = 'white';
                    container.addControl(checkbox);
                    break;
            }
            panel.addControl(container);
        });
        const exportButton = gui_1.Button.CreateSimpleButton("export", "Copy Parameters to Clipboard");
        exportButton.background = "black";
        exportButton.color = "white";
        exportButton.onPointerDownObservable.add(() => {
            navigator.clipboard.writeText(Parameters_1.Parameters.generateCode());
        });
        exportButton.widthInPixels = 300;
        exportButton.heightInPixels = 20;
        panel.addControl(exportButton);
        return panel;
    }
    dispose() {
        this._adt.dispose();
        window.removeEventListener("resize", this._resizeListener);
    }
}
exports.HUD = HUD;
//# sourceMappingURL=HUD.js.map