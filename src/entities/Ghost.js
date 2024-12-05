// src/entities/Slime.js
import * as THREE from 'three';

export class Ghost {
    constructor(scene, x, y, z) {
        this.scene = scene;

        const textureLoader = new THREE.TextureLoader();
        const ghostTexture = textureLoader.load('../../assets/ghost.jpg');

        // Create slime mesh and set its properties
        const slimeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ff00, // Green color for slime
            map: ghostTexture,
            roughness: 0.8,
            metalness: 0.1,
        });
        this.mobMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2, 0.9), slimeMaterial);
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
        this.lastLostLife = 0;

        this.health = 2;
        this.isDead = false;

        // Collision raycaster
        this.raycaster = new THREE.Raycaster();
        this.collisionVectors = [
            new THREE.Vector3(1, 0, 0),    // Right
            new THREE.Vector3(-1, 0, 0),   // Left
            new THREE.Vector3(0, 0, 1),    // Forward
            new THREE.Vector3(0, 0, -1)    // Backward
        ];

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
            //this.direction.negate(); // Invert direction for a simple bounce effect
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
    update(levelData, Mobs, character) {
        if(this.isDead){
            return;
        }
        // Randomly change direction every 100 frames
        const distanceFromChar = Math.abs(this.mobMesh.position.distanceTo(character.position));
        let xDir = 0;
        let yDir = 0;
        if (distanceFromChar < 10) {
            if(character.position.x < this.mobMesh.position.x){
                xDir = -Math.random();
            }
            else{
                xDir = Math.random();
            }

            if(character.position.z < this.mobMesh.position.z){
                yDir = -Math.random();
            }
            else{
                yDir = +Math.random();
            }

            
            this.direction = new THREE.Vector3(
                xDir,
                0,
                yDir
            ).normalize();
        }

        this.checkWallCollision(levelData);

        // Update slime position based on direction and speed
        this.mobMesh.position.add(this.direction.clone().multiplyScalar(this.moveSpeed));


        if(this.health <= 0){
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