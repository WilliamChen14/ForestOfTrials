import * as THREE from 'three';
import { Model } from '../Models.js';

import ROCKS from '/assets/models/rocks1.glb'

export class Rocks {
    constructor(scene, x, y, z, rotation) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.rotation = rotation;
        this.model = new Model();
    }
    async init() {
        await this.model.loadModel(ROCKS, {
            rotationOffset: {
                x: 0,
                y: this.rotation,
                z: 0,
            },
            scaleOffset: {
                x: 0.5,
                y: 0.5,
                z: 0.5,
            }
        });
        this.fireplace = this.model.sceneObject;
        this.fireplace.position.set(this.positionX, this.positionY - 0.5, this.positionZ - 0.1);
        this.scene.add(this.fireplace);
    }

    // Method to remove the sign from the scene if needed
    remove() {
    }
}