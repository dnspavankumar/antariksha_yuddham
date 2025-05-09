"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameters = void 0;
class Parameters {
    static setFont(element, isBold) {
        element.fontFamily = Parameters.guiFont.family;
        if (isBold) {
            element.fontWeight = Parameters.guiFont.bold;
        }
        else {
            element.fontWeight = Parameters.guiFont.book;
        }
        element.fontStyle = Parameters.guiFont.style;
    }
    // paste exported parameters inside this function
    static initialize() {
        this.maxSpeed = 2;
        this.maxAccel = 0.003;
        this.missileCoolDownTime = 10000;
        this.mouseSensitivty = 0.0003;
        this.timeToLockMissile = 2000;
        this.playerTurnRate = 0.04;
        this.AIPerceptionCone = -0.5;
        this.AIFollowDistance = -10;
        this.AIPredictionRange = 2;
        this.AITurnRate = 0.04;
        this.AIInputRandomness = 0;
        this.AIFirePrecision = 0.98;
        this.AIFriendlyFirePrecision = 0.97;
        this.AIEvadeTime = 3000;
        this.AIMinimumSpeed = 1;
        this.AIMaximumSpeed = 5;
        this.AIFireRange = 550;
        this.AIBreakDistance = 30;
        this.AIBurstDistance = 500;
        this.AIMaxTargets = 4;
        this.AIDebugLabels = false;
        this.AIImmelmannProbability = 0.2;
        this.ImmelmannDuration = 1000;
        this.allyCount = 10;
        this.enemyCount = 10;
        this.recordFrameCount = 2000;
        this.allowSplitScreen = false;
        this.recorderActive = true;
        this.enableAudio = true;
        this.starfieldHeavyShader = true;
    }
    static getParameters() {
        const exclude = ["length", "name", "prototype", "initialize", "getParameters", "generateCode"];
        return Object.getOwnPropertyNames(Parameters).filter(name => exclude.indexOf(name) === -1);
    }
    static generateCode() {
        let string = "";
        this.getParameters().forEach(param => {
            const value = this[param];
            let output;
            switch (typeof value) {
                case "string":
                    output = `"${value}""`;
                    break;
                case "number":
                    output = `${value}`;
                    break;
                case "boolean":
                    output = value ? "true" : "false";
                    break;
            }
            string += `this.${param} = ${output};\n`;
        });
        return string;
    }
}
exports.Parameters = Parameters;
Parameters.guiFont = {
    family: "magistral, sans-serif",
    book: "300",
    bold: "700",
    style: "normal"
};
//# sourceMappingURL=Parameters.js.map