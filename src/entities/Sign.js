// src/entities/Sign.js
import * as THREE from 'three';
import { Model } from '../Models.js';

import SIGN from '/assets/models/sign.glb'

export class Sign {
    constructor(scene, x, y, z, message) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.message = message;  // Store the custom message
        this.model = new Model();
        this.isMessageShowing = false;
    }

    async init () {
        await this.model.loadModel(SIGN, {
            rotationOffset: {
                x: 0,
                y: -Math.PI / 2,
                z: 0,
            },
            scaleOffset: {
                x: 0.4,
                y: 0.4,
                z: 0.4,
            }
        });
        this.sign = this.model.sceneObject;
        this.sign.position.set(this.positionX, this.positionY - 0.5, this.positionZ);

        this.scene.add(this.sign);         // Add the sign to the scene

        // Collision properties
        this.collisionDistance = 1;  // Set collision distance for proximity detection

        this.checkSignCollision = this.checkSignCollision.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    showMessage(message) {
        this.isMessageShowing = true;
        const messageContainer = document.getElementById("message-container");
        messageContainer.innerText = message;
        messageContainer.style.display = "block"; // Show the message
        setTimeout(() => {
            messageContainer.style.display = "none"; // Hide the message after 3 seconds
        }, 1000);
    }

    // Method to check collision with the character
    checkSignCollision(characterMesh) {
        const distance = this.sign.position.distanceTo(characterMesh.position);
            console.log(distance - this.collisionDistance)
        if (distance <= this.collisionDistance) {
            this.showMessage(this.message);  // Display the message on collision
        }
    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.sign);
    }
}