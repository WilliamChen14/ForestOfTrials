import * as THREE from 'three';
import { Model } from '../Models.js';

import HOUSE from '/assets/models/house.glb'

export class House {
    constructor(scene, x, y, z, rotation) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.rotation = rotation;
        this.model = new Model();
    }
    async init() {
        await this.model.loadModel(HOUSE, {
            rotationOffset: {
                x: 0,
                y: Math.PI + this.rotation,
                z: 0,
            },
            scaleOffset: {
                x: 0.5,
                y: 0.5,
                z: 0.5,
            }
        });
        this.house = this.model.sceneObject;
        this.house.position.set(this.positionX, this.positionY - 0.5, this.positionZ - 0.1);
        this.scene.add(this.house);
    }

    // Method to remove the sign from the scene if needed
    remove() {
    }
}