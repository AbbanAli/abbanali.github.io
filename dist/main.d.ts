declare const canvas: HTMLCanvasElement;
declare const ctx: CanvasRenderingContext2D;
declare const card: HTMLElement;
declare const buttons: NodeListOf<Element>;
declare const muteBtn: HTMLButtonElement;
declare let mouseX: number;
declare let mouseY: number;
interface Star {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    drift: number;
}
declare let stars: Star[];
declare const bgMusic: HTMLAudioElement;
declare const audioContext: AudioContext;
declare const source: MediaElementAudioSourceNode;
declare const bassBoost: BiquadFilterNode;
//# sourceMappingURL=main.d.ts.map