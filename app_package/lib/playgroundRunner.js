"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBabylonApp = exports.useNative = exports.useWebGPU = void 0;
const core_1 = require("@babylonjs/core");
require("@babylonjs/loaders/glTF");
const playground_1 = require("./Playground/playground");
const Parameters_1 = require("./Playground/Parameters");
const GuiFramework_1 = require("./Playground/GuiFramework");
exports.useWebGPU = false;
exports.useNative = false;
function initializeBabylonApp(options) {
    return __awaiter(this, void 0, void 0, function* () {
        Parameters_1.Parameters.initialize();
        exports.useNative = !!_native;
        if (exports.useNative) {
            options.assetsHostUrl = "app://";
        }
        else {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            options.assetsHostUrl = window.location.href.split('?')[0];
            if (!options.assetsHostUrl) {
                options.assetsHostUrl = "";
            }
            Parameters_1.Parameters.starfieldHeavyShader = urlParams.get("heavyStarfield") === "yes";
        }
        if (options.assetsHostUrl) {
            console.log("Assets host URL: " + options.assetsHostUrl);
        }
        else {
            console.log("No assets host URL provided");
        }
        if (!exports.useNative) {
            document.body.style.width = "100%";
            document.body.style.height = "100%";
            document.body.style.margin = "0";
            document.body.style.padding = "0";
            // Add CSS to hide Babylon.js branding
            const style = document.createElement('style');
            style.textContent = `
            .babylonjs-footer {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
            .babylonjs-logo {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        `;
            document.head.appendChild(style);
            const div = document.createElement("div");
            div.style.width = "100%";
            div.style.height = "100%";
            document.body.appendChild(div);
            const canvas = document.createElement("canvas");
            canvas.id = "renderCanvas";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.display = "block";
            canvas.oncontextmenu = () => false;
            div.appendChild(canvas);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            options.canvas = canvas;
        }
        else {
            options.canvas = {};
            core_1.MorphTargetManager.EnableTextureStorage = false;
        }
        const canvas = options.canvas;
        let engine;
        if (exports.useNative) {
            engine = new core_1.NativeEngine();
        }
        else if (exports.useWebGPU) {
            engine = new core_1.WebGPUEngine(canvas, {
                deviceDescriptor: {
                    requiredFeatures: [
                        "depth-clip-control",
                        "depth24unorm-stencil8",
                        "depth32float-stencil8",
                        "texture-compression-bc",
                        "texture-compression-etc2",
                        "texture-compression-astc",
                        "timestamp-query",
                        "indirect-first-instance",
                    ],
                },
            });
            yield engine.initAsync();
            engine.compatibilityMode = false;
        }
        else {
            const badOS = /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);
            engine = new core_1.Engine(canvas, !badOS, { disableWebGL2Support: false, powerPreference: "high-performance", doNotHandleContextLost: false, audioEngine: true });
            // Disable the Babylon.js watermark
            engine.hideLoadingUI();
            // Hide the loading screen without setting to null
            engine.displayLoadingUI = function () { };
            // Remove the Babylon.js branding
            const disableBrandingFunc = function () {
                // Find and remove any Babylon.js branding elements
                const brandingElements = document.querySelectorAll('.babylonjs-footer');
                brandingElements.forEach(element => {
                    element.remove();
                });
            };
            // Call immediately and also after a short delay to ensure it works
            disableBrandingFunc();
            setTimeout(disableBrandingFunc, 1000);
        }
        window.engine = engine;
        const scene = (0, playground_1.CreatePlaygroundScene)(engine, options.assetsHostUrl, canvas);
        GuiFramework_1.GuiFramework.updateScreenRatio(engine);
        engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            engine.resize();
            GuiFramework_1.GuiFramework.updateScreenRatio(engine);
        });
    });
}
exports.initializeBabylonApp = initializeBabylonApp;
//# sourceMappingURL=playgroundRunner.js.map