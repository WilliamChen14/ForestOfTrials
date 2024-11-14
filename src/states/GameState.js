// src/states/GameState.js
import { Controls } from '../Controls.js';
import { Character } from '../entities/Character.js';


import { StarterLevel } from '../levels/StarterLevel.js';

import * as THREE from 'three';

export class GameState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.controls = new Controls();
        this.character = new Character(this.stateManager.scene);
        this.levelData = StarterLevel(stateManager.scene);
    }

    enter() {
        console.log("Entering Game State");
    }

    update() {
        // Pass controls to the character's update method
        this.character.update(this.controls.keysPressed, this.levelData);

        // Additional game update logic...

        const cameraOffset = new THREE.Vector3(0, 10, 8); // Adjust to change angle and distance
        this.stateManager.camera.position.copy(this.character.characterMesh.position).add(cameraOffset);
        this.stateManager.camera.lookAt(this.character.characterMesh.position);
    }

    exit() {
        console.log("Exiting Game State");
        this.controls.resetKeys(); // Reset keys when exiting the state
    }
}