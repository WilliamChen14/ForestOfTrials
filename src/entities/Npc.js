// src/entities/Sign.js
import * as THREE from 'three';
import { Model } from '../Models.js';

import NPC from '/assets/models/npc.glb'
const clock = new THREE.Clock();

export class Npc {
    constructor(scene, x, y, z, message) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.message = message;  // Store the custom message
        this.isMessageShowing = false;
        this.mesh = null;
        this.model = new Model();
        this.scene = scene;

        const MemoryMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfff39c,
            roughness: 0.5,
            metalness: 1.0,
        });

        // Collision properties
        this.collisionDistance = 1;  // Set collision distance for proximity detection

        this.checkSignCollision = this.checkSignCollision.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    async init() {
        await this.model.loadModel(NPC, {
            rotationOffset: {
                x: 0,
                y: -Math.PI / 2,
                z: 0,
            },
            scaleOffset: {
                x: 0.5,
                y: 0.5,
                z: 0.5,
            }
       });
        this.npc = this.model.sceneObject;
        this.npc.castShadow = true;
        this.npc.receiveShadow = true;
        this.npc.position.set(this.positionX, this.positionY - 0.4, this.positionZ);
        this.mesh = this.npc;
        this.MapLayoutMesh = this.npc;
        this.scene.add(this.npc);
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
        const distance = this.MapLayoutMesh.position.distanceTo(characterMesh.position);
        if (distance <= this.collisionDistance) {
            this.showMessage(this.message);  // Display the message on collision
        }
    }

    update() {
        let deltaTime = clock.getDelta();
        this.model.mixer.update(deltaTime * 1)
    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}