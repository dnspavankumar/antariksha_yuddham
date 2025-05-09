export declare class Parameters {
    static maxSpeed: number;
    static maxAccel: number;
    static missileCoolDownTime: number;
    static mouseSensitivty: number;
    static timeToLockMissile: number;
    static playerTurnRate: number;
    static ImmelmannDuration: number;
    static AIPerceptionCone: number;
    static AIFollowDistance: number;
    static AIPredictionRange: number;
    static AITurnRate: number;
    static AIInputRandomness: number;
    static AIFirePrecision: number;
    static AIFriendlyFirePrecision: number;
    static AIEvadeTime: number;
    static AIMinimumSpeed: number;
    static AIMaximumSpeed: number;
    static AIFireRange: number;
    static AIBreakDistance: number;
    static AIBurstDistance: number;
    static AIMaxTargets: number;
    static AIDebugLabels: boolean;
    static AIImmelmannProbability: number;
    static allyCount: number;
    static enemyCount: number;
    static recordFrameCount: number;
    static allowSplitScreen: boolean;
    static recorderActive: boolean;
    static enableAudio: boolean;
    static starfieldHeavyShader: boolean;
    static guiFont: {
        family: string;
        book: string;
        bold: string;
        style: string;
    };
    static setFont(element: any, isBold: boolean): void;
    static initialize(): void;
    static getParameters(): (keyof Parameters)[];
    static generateCode(): string;
}
//# sourceMappingURL=Parameters.d.ts.map