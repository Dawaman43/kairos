export class AudioEngine {
    private static ctx: AudioContext | null = null;

    private static getCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.ctx;
    }

    static playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) {
        try {
            const ctx = this.getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio might be blocked by browser policy until user interaction
        }
    }

    static playClick() {
        this.playTone(800, 'sine', 0.05, 0.05);
    }

    static playHover() {
        this.playTone(1200, 'sine', 0.03, 0.02);
    }

    static playSuccess() {
        const ctx = this.getCtx();
        const t = ctx.currentTime;
        this.playTone(600, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(900, 'sine', 0.2, 0.1), 100);
    }

    static playError() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
    }

    static playScan() {
        this.playTone(400, 'square', 0.05, 0.03);
    }
}
