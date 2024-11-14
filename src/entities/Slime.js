// src/entities/Slime.js
import * as THREE from 'three';

export class Slime {
    constructor(scene, x, y, z) {
        this.scene = scene;

        // Create slime mesh and set its properties
        const slimeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ff00, // Green color for slime
            roughness: 0.8,
            metalness: 0.1,
        });
        this.mobMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), slimeMaterial);
        this.mobMesh.castShadow = true;
        this.mobMesh.receiveShadow = true;
        this.mobMesh.position.set(x, y, z);

        this.scene.add(this.mobMesh); // Add the slime to the scene

        // Collision and movement properties
        this.collisionDistance = 0.5; // Set collision distance for proximity detection
        this.moveSpeed = 0.02; // Movement speed of the slime
        this.direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        ).normalize(); // Random initial direction

        this.lastCollisionTime = 0;

        this.checkCollision = this.checkCollision.bind(this);
        this.getLastCollisionTime = this.getLastCollisionTime.bind(this);
        this.loseLife = this.loseLife.bind(this);

        this.health = 1;

    }

    // Method to check collision with the character, called every 500ms
    checkCollision(characterMesh) {
        const distance = this.mobMesh.position.distanceTo(characterMesh.position);
        if(distance <= this.collisionDistance){
            this.lastCollisionTime = Date.now();
        }
        return distance <= this.collisionDistance;
    }

    checkWallCollision(levelData){
        
    }

    getLastCollisionTime(){
        return this.lastCollisionTime;
    }

    loseLife(damage){
        this.health = this.health - damage;
    }

    // Update method to move the slime randomly
    update() {
        // Randomly change direction every 100 frames
        if (Math.random() < 0.02) {
            this.direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                (Math.random() - 0.5) * 2
            ).normalize();
        }

        // Update slime position based on direction and speed
        this.mobMesh.position.add(this.direction.clone().multiplyScalar(this.moveSpeed));

        // Keep slime within certain bounds (e.g., the floor area)
        if (Math.abs(this.mobMesh.position.x) > 10) this.direction.x *= -1;
        if (Math.abs(this.mobMesh.position.z) > 10) this.direction.z *= -1;

        if(this.health <= 0){
            this.remove();
        }
    }

    // Method to remove the slime from the scene if needed
    remove() {
        this.scene.remove(this.mobMesh);
    }
}