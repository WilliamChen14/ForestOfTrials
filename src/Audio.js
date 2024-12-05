
let isExistAmbientMusic = false;
export class AudioPlayer {
    constructor() {
        if (!isExistAmbientMusic) {
            isExistAmbientMusic = true;
            this.ambientMusic = new Audio('/assets/audio/forest-theme.m4a');
            this.ambientMusic.volume = 0.05;
            this.ambientMusic.loop = true;
            this.ambientMusic.play();
        }

        this.runSound = new Audio('/assets/audio/run.wav');
        this.runSound.volume = 0.06;
        this.runSound.loop = true;

        this.damageSound = new Audio('/assets/audio/damage.wav');
        this.damageSound.volume = 0.15;

        this.attackSound = new Audio('/assets/audio/attack.wav');
        this.attackSound.volume = 0.08;
    }

    playRunSound() {
        this.runSound.play();
    }
    stopRunSound() {
        this.runSound.pause();
    }
    playAttackSound() {
        this.attackSound.currentTime = 0;
        this.attackSound.play();
    }
    playDamageSound() {
        this.damageSound.currentTime = 0;
        this.damageSound.play();
    }
}