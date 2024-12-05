// src/entities/Sign.js
import * as THREE from 'three';
import { Model } from '../Models.js';


export class Memory {
    constructor(scene, x, y, z, message) {
        this.scene = scene;
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
        this.message = message;  // Store the custom message
        this.isMessageShowing = false;

        const MemoryMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfff39c,
            roughness: 0.5,
            metalness: 0.6,
        });
        const memory = new THREE.Mesh(new THREE.SphereGeometry(0.2, 15, 15), MemoryMaterial);
        memory.castShadow = true;
        memory.receiveShadow = true;
        memory.position.set(x, y, z);
        this.MapLayoutMesh = memory;
        scene.add(memory);

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
        const distance = this.MapLayoutMesh.position.distanceTo(characterMesh.position);
        if (distance <= this.collisionDistance) {
            this.showMessage(this.message);  // Display the message on collision
        }
    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.MapLayoutMesh);
    }
}