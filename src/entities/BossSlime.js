// src/entities/BossSlime.js
import * as THREE from 'three';
import { Slime } from './Slime';
import { BigSlime } from './BigSlime';

export class BossSlime {
    constructor(scene, x, y, z) {
        this.scene = scene;

        // Create slime group to hold all cube parts
        this.mobMesh = new THREE.Group();

        // Slime materials
        const outerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ff00, // Bright green for outer layer
            transparent: true,
            opacity: 0.6,
            roughness: 0.4,
            metalness: 0.2,
        });

        const innerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x007700, // Darker green for inner layer
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
            metalness: 0.1,
        });

        // Create outer cube (even larger size)
        const outerGeometry = new THREE.BoxGeometry(6.0, 2.4, 6.0);
        const outerCube = new THREE.Mesh(outerGeometry, outerMaterial);

        // Create inner cube
        const innerGeometry = new THREE.BoxGeometry(2.0, 0.8, 2.0);
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);

        // Create mouth (black cube)
        const mouthGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.2);
        const mouth = new THREE.Mesh(mouthGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        mouth.position.set(0, -0.3, 0.7);

        // Add all parts to the group
        this.mobMesh.add(outerCube);
        this.mobMesh.add(innerCube);
        this.mobMesh.add(mouth);

        // Position the entire group
        this.mobMesh.position.set(x, y, z);

        // Add hopping animation properties
        this.jumpHeight = 0.5;
        this.jumpSpeed = 2;
        this.baseY = y;
        this.animationOffset = Math.random() * Math.PI * 2;

        // Shadow settings
        this.mobMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.scene.add(this.mobMesh); // Add the slime to the scene

        // Collision and movement properties
        this.collisionDistance = 1.8; // Set collision distance for proximity detection
        this.moveSpeed = 0.03; // Movement speed of the slime
        this.direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        ).normalize(); // Random initial direction

        this.lastCollisionTime = 0;

        // Bind methods
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
        this.health -= damage;
        this.lastLostLife = Date.now();
    }

    // Update method to move the slime randomly
    update(levelData, Mobs) {
        if(this.isDead){
            return;
        }

        // Randomly change direction
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

        // Minecraft-style hopping animation
        const time = Date.now() * 0.001;
        this.mobMesh.position.y = this.baseY + Math.abs(Math.sin(time * this.jumpSpeed + this.animationOffset)) * this.jumpHeight;

        // Rotate slightly during jump
        this.mobMesh.rotation.y = Math.sin(time * this.jumpSpeed + this.animationOffset) * 0.1;

        // Squash and stretch effect
        const squashStretch = 1 + Math.sin(time * this.jumpSpeed + this.animationOffset) * 0.2;
        this.mobMesh.scale.y = 1 / squashStretch;
        this.mobMesh.scale.x = this.mobMesh.scale.z = squashStretch;

        // Spawn baby slimes under certain conditions
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