// src/utils/SoundController.ts
// Event-driven Web Audio API soundscape

class SoundManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;
    private masterGain: GainNode | null = null;

    private isInitialized: boolean = false;

    // Track which one-shot events have fired (to avoid repeats)
    private firedEvents = new Set<string>();

    public init() {
        if (this.isInitialized || typeof window === 'undefined') return;
        try {
            const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            this.ctx = new AC();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.isMuted ? 0 : 0.7;
            this.masterGain.connect(this.ctx.destination);

            // Unlock audio context on user interaction
            const unlock = () => {
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                const events = ['click', 'touchstart', 'keydown', 'wheel'];
                events.forEach(evt => window.removeEventListener(evt, unlock));
            };
            ['click', 'touchstart', 'keydown', 'wheel'].forEach(evt => {
                window.addEventListener(evt, unlock, { once: true, passive: true });
            });

            this.isInitialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    /** Whoosh: rising filtered noise sweep — call when car enters */
    public playWhoosh() {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        if (this.firedEvents.has('whoosh')) return;
        this.firedEvents.add('whoosh');

        const duration = 1.2;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 3;
        filter.frequency.setValueAtTime(200, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(4000, this.ctx.currentTime + duration * 0.4);
        filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + duration * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
        source.stop(this.ctx.currentTime + duration);
    }

    /** Shatter/Impact: low boom + noise burst — call when car explodes */
    public playShatter() {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        if (this.firedEvents.has('shatter')) return;
        this.firedEvents.add('shatter');

        const t = this.ctx.currentTime;

        // Sub-boom
        const boom = this.ctx.createOscillator();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(80, t);
        boom.frequency.exponentialRampToValueAtTime(20, t + 0.8);

        const boomGain = this.ctx.createGain();
        boomGain.gain.setValueAtTime(0.4, t);
        boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

        boom.connect(boomGain);
        boomGain.connect(this.masterGain);
        boom.start(t);
        boom.stop(t + 0.8);

        // Impact noise
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.05));
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(3000, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(200, t + 0.5);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noiseSource.start(t);
        noiseSource.stop(t + 0.5);
    }

    /** Loading blips: small data-processing ticks */
    public playLoadingTick() {
        if (!this.ctx || !this.masterGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const freq = 400 + Math.random() * 600;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.06);
    }

    /** Soft click for hover states */
    public playHoverSound() {
        if (!this.ctx || !this.masterGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.04);
    }

    /** Button click sound */
    public playClickSound() {
        if (!this.ctx || !this.masterGain || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.08);
    }

    /** Reset one-shot events (e.g. when scrolling back to top) */
    public resetEvents() {
        this.firedEvents.clear();
    }

    /** Reset a specific event to allow it to be re-triggered */
    public resetEvent(eventName: string) {
        this.firedEvents.delete(eventName);
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.1);
        }
        return this.isMuted;
    }

    public getMuteState(): boolean {
        return this.isMuted;
    }
}

export const SoundController = new SoundManager();
