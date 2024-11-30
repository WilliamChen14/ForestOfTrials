// src/entities/Slime.js
import * as THREE from 'three';
import { Slime } from './Slime';
import { BigSlime } from './BigSlime';

export class BossSlime {
    constructor(scene, x, y, z) {
        this.scene = scene;

        // Create slime mesh and set its properties
        const slimeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ff00, // Green color for slime
            roughness: 0.8,
            metalness: 0.1,
        });
        this.mobMesh = new THREE.Mesh(new THREE.BoxGeometry(6.0, 2.4, 6.0), slimeMaterial);
        this.mobMesh.castShadow = true;
        this.mobMesh.receiveShadow = true;
        this.mobMesh.position.set(x, y, z);

        this.scene.add(this.mobMesh); // Add the slime to the scene

        // Collision and movement properties
        this.collisionDistance = 1.6; // Set collision distance for proximity detection
        this.moveSpeed = 0.03; // Movement speed of the slime
        this.direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        ).normalize(); // Random initial direction

        this.lastCollisionTime = 0;

        this.checkCollision = this.checkCollision.bind(this);
        this.getLastCollisionTime = this.getLastCollisionTime.bind(this);
        this.loseLife = this.loseLife.bind(this);
        this.lastLostLife = 0;

        this.health = 10;

        this.lastSpawnSlime = 0;

        // Collision raycaster
        this.raycaster = new THREE.Raycaster();
        this.collisionVectors = [
            new THREE.Vector3(1, 0, 0),    // Right
            new THREE.Vector3(-1, 0, 0),   // Left
            new THREE.Vector3(0, 0, 1),    // Forward
            new THREE.Vector3(0, 0, -1)    // Backward
        ];

        this.isDead = false;

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
        const collisionDetected = this.collisionVectors.some(direction => {
            this.raycaster.set(this.mobMesh.position, direction);
            const intersects = this.raycaster.intersectObjects(levelData);

            // Check if any wall is within the collision distance
            return intersects.length > 0 && intersects[0].distance <= this.collisionDistance;
        });

        if (collisionDetected) {
            // Reverse direction or pick a new random direction
            this.direction.negate(); // Invert direction for a simple bounce effect
        }
    }

    getLastCollisionTime(){
        return this.lastCollisionTime;
    }

    loseLife(damage){
        this.health = this.health - damage;
        this.lastLostLife = Date.now;
    }

    // Update method to move the slime randomly
    update(levelData, Mobs) {
        if(this.isDead){
            return;
        }
        // Randomly change direction every 100 frames
        if (Math.random() < 0.02) {
            this.direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                (Math.random() - 0.5) * 2
            ).normalize();
        }

        this.checkWallCollision(levelData);

        // Update slime position based on direction and speed
        this.mobMesh.position.add(this.direction.clone().multiplyScalar(this.moveSpeed));

        if(this.lastLostLife > Date.now() - 600 && Date.now() - this.lastSpawnSlime > 600){
            const babySlimeThree = new Slime(this.scene, this.mobMesh.position.x, this.mobMesh.position.y, this.mobMesh.position.z);
            Mobs.push(babySlimeThree);
            this.lastSpawnSlime = Date.now();
        }

        if(this.health <= 0){
            const babySlimeOne = new BigSlime(this.scene, this.mobMesh.position.x, this.mobMesh.position.y, this.mobMesh.position.z);
            Mobs.push(babySlimeOne);
            const babySlimeTwo = new BigSlime(this.scene, this.mobMesh.position.x, this.mobMesh.position.y, this.mobMesh.position.z);
            Mobs.push(babySlimeTwo);
            this.isDead = true;
            this.remove();
        }

    }

    getIsDead(){
        return this.isDead;
    }

    // Method to remove the slime from the scene if needed
    remove() {
        this.scene.remove(this.mobMesh);
        
        
    }
}