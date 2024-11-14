// src/states/HomeState.js
import { Controls } from "../Controls";
export class HomeState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.Controls = new Controls;
    }

    enter() {
        console.log("Entering Home State");
        // Add UI or instructions, set up any necessary event listeners
    }

    update() {
        // Any animations or updates for the home screen
    }

    exit() {
        console.log("Exiting Home State");
        // Clean up UI or event listeners
    }
}