// src/entities/Sign.js
import * as THREE from 'three';

export class Sign {
    constructor(scene, x, y, z, message) {
        this.scene = scene;
        this.message = message;  // Store the custom message

        const textureLoader = new THREE.TextureLoader();
        const woodTexture = textureLoader.load('../../assets/wood.png');

        // Create sign mesh and set its properties
        const signMaterial = new THREE.MeshPhysicalMaterial({
            map: woodTexture,
            color: 0x73543d,
            roughness: 0.5,
            metalness: 0,
        });
        
        this.sign = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.2), signMaterial);
        this.sign.castShadow = true;
        this.sign.receiveShadow = true;
        this.sign.position.set(x, y, z);

        this.scene.add(this.sign);         // Add the sign to the scene

        // Collision properties
        this.collisionDistance = 0.5;  // Set collision distance for proximity detection

        this.checkSignCollision = this.checkSignCollision.bind(this);
        this.showMessage = this.showMessage.bind(this);

    }

    showMessage(message) {
        const messageContainer = document.getElementById("message-container");
        messageContainer.innerText = message;
        messageContainer.style.display = "block"; // Show the message
        setTimeout(() => {
            messageContainer.style.display = "none"; // Hide the message after 3 seconds
        }, 3000);
    }

    // Method to check collision with the character
    checkSignCollision(characterMesh) {
        const distance = this.sign.position.distanceTo(characterMesh.position);
        if (distance <= this.collisionDistance) {
            this.showMessage(this.message);  // Display the message on collision
        }
    }

    // Method to remove the sign from the scene if needed
    remove() {
        this.scene.remove(this.sign);
    }
}