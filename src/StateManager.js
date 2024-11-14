// src/StateManager.js
export class StateManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.currentState = null;
    }

    changeState(newStateClass) {
        if (this.currentState) this.currentState.exit();
        this.currentState = new newStateClass(this);
        this.currentState.enter();
    }

    update() {
        if (this.currentState) this.currentState.update();
    }
}