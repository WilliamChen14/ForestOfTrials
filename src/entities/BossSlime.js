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

        // Add animation properties
        this.jumpHeight = 0.3; // Reduced from 0.5
        this.jumpSpeed = 1.5;  // Reduced from 2
        this.baseY = y;
        this.animationOffset = Math.random() * Math.PI * 2;

        // Shadow settings
        this.mobMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.scene.add(this.mobMesh);

        // Movement and collision properties
        this.collisionDistance = 1.8;
        this.moveSpeed = 0.01; // Reduced from 0.03
        this.direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        ).normalize();

        // Position control
        this.startPosition = new THREE.Vector3(x, y, z);
        this.maxDistance = 3; // Maximum distance from start position

        // Movement timing
        this.directionChangeInterval = 5000; // Change direction every 5 seconds
        this.lastDirectionChange = Date.now();
        this.lastCollisionTime = 0;
        this.lastLostLife = 0;
        this.lastSpawnSlime = 0;

        // Combat properties
        this.health = 10;
        this.isDead = false;

        // Collision detection
        this.raycaster = new THREE.Raycaster();
        this.collisionVectors = [
            new THREE.Vector3(1, 0, 0),    // Right
            new THREE.Vector3(-1, 0, 0),   // Left
            new THREE.Vector3(0, 0, 1),    // Forward
            new THREE.Vector3(0, 0, -1)    // Backward
        ];

        // Bind methods
        this.checkCollision = this.checkCollision.bind(this);
        this.getLastCollisionTime = this.getLastCollisionTime.bind(this);
        this.loseLife = this.loseLife.bind(this);
    }

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
            return intersects.length > 0 && intersects[0].distance <= this.collisionDistance;
        });

        if (collisionDetected) {
            this.direction.negate();
        }
    }

    getLastCollisionTime(){
        return this.lastCollisionTime;
    }

    loseLife(damage){
        this.health -= damage;
        this.lastLostLife = Date.now();
    }

    update(levelData, Mobs) {
        if(this.isDead){
            return;
        }

        const currentTime = Date.now();

        // Change direction less frequently and more deliberately
        if (currentTime - this.lastDirectionChange > this.directionChangeInterval) {
            const distanceFromStart = this.mobMesh.position.distanceTo(this.startPosition);
            
            if (distanceFromStart > this.maxDistance) {
                // Move back toward start position
                this.direction = new THREE.Vector3()
                    .subVectors(this.startPosition, this.mobMesh.position)
                    .normalize();
            } else {
                // Random direction but with smaller variations
                this.direction = new THREE.Vector3(
                    (Math.random() - 0.5),
                    0,
                    (Math.random() - 0.5)
                ).normalize();
            }
            
            this.lastDirectionChange = currentTime;
        }

        this.checkWallCollision(levelData);

        // More controlled movement
        this.mobMesh.position.add(this.direction.clone().multiplyScalar(this.moveSpeed));

        // Slower animation
        const time = currentTime * 0.001;
        this.mobMesh.position.y = this.baseY + Math.abs(Math.sin(time * this.jumpSpeed + this.animationOffset)) * this.jumpHeight;

        // Reduced rotation
        this.mobMesh.rotation.y = Math.sin(time * this.jumpSpeed + this.animationOffset) * 0.05;

        // Gentler squash and stretch
        const squashStretch = 1 + Math.sin(time * this.jumpSpeed + this.animationOffset) * 0.15;
        this.mobMesh.scale.y = 1 / squashStretch;
        this.mobMesh.scale.x = this.mobMesh.scale.z = squashStretch;

        // Spawn baby slimes when hit
        if(this.lastLostLife > currentTime - 600 && currentTime - this.lastSpawnSlime > 600){
            const babySlimeThree = new Slime(this.scene, this.mobMesh.position.x, this.mobMesh.position.y, this.mobMesh.position.z);
            Mobs.push(babySlimeThree);
            this.lastSpawnSlime = currentTime;
        }

        // Death and spawning big slimes
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

    remove() {
        this.scene.remove(this.mobMesh);
    }
}