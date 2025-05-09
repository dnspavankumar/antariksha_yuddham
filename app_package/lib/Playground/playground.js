"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlaygroundScene = void 0;
const core_1 = require("@babylonjs/core");
const Assets_1 = require("./Assets");
const States_1 = require("./States/States");
const State_1 = require("./States/State");
const GameState_1 = require("./States/GameState");
const GameSession_1 = require("./States/GameSession");
const Diorama_1 = require("./States/Diorama");
const Main_1 = require("./States/Main");
class Playground {
    static CreateScene(engine, assetsHostUrl, canvas) {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new core_1.Scene(engine);
        //scene.autoClear = false;
        scene.clearColor = new core_1.Color4(0, 0, 0, 1);
        scene.autoClearDepthAndStencil = false;
        scene.skipPointerMovePicking = true;
        scene.pointerUpPredicate = () => false;
        scene.pointerDownPredicate = () => false;
        scene.pointerMovePredicate = () => false;
        // lighting
        const dirLight = new core_1.DirectionalLight("dirLight", new core_1.Vector3(0.47, -0.19, -0.86), scene);
        dirLight.diffuse = core_1.Color3.FromInts(255, 251, 199);
        dirLight.intensity = 1.5;
        // material image processing
        const imageProcessing = scene.imageProcessingConfiguration;
        imageProcessing.toneMappingEnabled = true;
        imageProcessing.toneMappingType = core_1.ImageProcessingConfiguration.TONEMAPPING_ACES;
        imageProcessing.exposure = 2.0;
        // glow
        const glowLayer = new core_1.GlowLayer("glowLayer", scene);
        glowLayer.intensity = 1.2;
        // This creates and positions a free camera (non-mesh)
        var camera = new core_1.FreeCamera("camera1", new core_1.Vector3(0, 5, -10), scene);
        new Assets_1.Assets(scene, assetsHostUrl, (assets) => {
            GameState_1.GameState.gameSession = new GameSession_1.GameSession(assets, scene, canvas, glowLayer);
            Main_1.Main.diorama = new Diorama_1.Diorama(scene, assets, engine, glowLayer);
            States_1.States.photoMode.assets = assets;
            State_1.State.setCurrent(States_1.States.main);
            // jump directly in the game
            //State.setCurrent(States.gameState);
        }, (assets) => {
            if (Main_1.Main.playButton) {
                Main_1.Main.playButton.isVisible = true;
            }
        });
        return scene;
    }
}
function CreatePlaygroundScene(engine, assetsHostUrl, canvas) {
    return Playground.CreateScene(engine, assetsHostUrl, canvas);
}
exports.CreatePlaygroundScene = CreatePlaygroundScene;
//# sourceMappingURL=playground.js.map