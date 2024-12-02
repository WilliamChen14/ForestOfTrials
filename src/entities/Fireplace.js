import * as THREE from 'three';
import { Model } from '../Models.js';

import FIREPLACE from '/assets/models/fireplace.glb'

export class Fireplace {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.model = new Model();
    }
    async init() {
        await this.model.loadModel(FIREPLACE, {
            scaleOffset: {
                x: 0.1,
                y: 0.1,
                z: 0.1,
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