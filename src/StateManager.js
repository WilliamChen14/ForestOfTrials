// src/StateManager.js
export class StateManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.currentState = null;
    }

    async changeState(newStateClass) {
        if (this.currentState) this.currentState.exit();
        this.currentState = new newStateClass(this);

        // load the state
        this.showLoadMessage("loading state...");
        this.currentState.isInit = false;
        await this.currentState.enter();

        // done loading
        this.currentState.isInit = true;
        this.hideLoadMessage();
    }

    update() {
        if (this.currentState) {
            if (this.currentState.isInit === undefined || this.currentState.isInit) {
                this.currentState.update();
            }
        }
    }

    showLoadMessage(message) {
        const messageContainer = document.getElementById("message-container");
        messageContainer.innerText = message;
        messageContainer.style.display = "block"; // Show the message
    }

    hideLoadMessage() {
        const messageContainer = document.getElementById("message-container");
        messageContainer.style.display = "none"; 
    }
}