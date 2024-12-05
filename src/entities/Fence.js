import * as THREE from 'three';
import { Model } from '../Models.js';

import FENCE from '/assets/models/fence.glb'

export class Fence {
    constructor(scene, x, y, z, rotation) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.rotation = rotation;
        this.model = new Model();
    }
    async init() {
        await this.model.loadModel(FENCE, {
            rotationOffset: {
                x: 0,
                y: this.rotation,
                z: 0,
            },
            scaleOffset: {
                x: 0.3,
                y: 0.3,
                z: 0.3,
            }
       });
        this.fence = this.model.sceneObject;
        this.fence.position.set(this.positionX, this.positionY - 0.5, this.positionZ - 0.1);
        this.scene.add(this.fence);
    }

    // Method to remove the sign from the scene if needed
    remove() {
    }
}