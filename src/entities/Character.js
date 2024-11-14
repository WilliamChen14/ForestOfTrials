// src/Character.js
import * as THREE from 'three';

export class Character {
    constructor(scene) {
        this.scene = scene;

        // Create character mesh and set initial properties
        const characterMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1b9400, // Color for the character
            roughness: 0.5,
            metalness: 0,
        });
        this.characterMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1, 0.5),
            characterMaterial
        );
        this.characterMesh.castShadow = true;
        this.characterMesh.position.set(5, 1, 5); // Initial position

        this.moveSpeed = 0.1;
        this.jumpStrength = 0.15;
        this.gravity = -0.01;
        this.isOnGround = true;
        this.moveX = 0;
        this.moveY = 0;
        this.moveZ = 0;
        this.lastJumpTime = 0;
        this.jumpCooldownTime = 400; // Cooldown duration in milliseconds

        this.isOnGround = true;
        this.raycaster = new THREE.Raycaster();
        this.downVector = new THREE.Vector3(0, -2, 0);
        this.upVector = new THREE.Vector3(0, 2, 0);
        this.rightVector = new THREE.Vector3(2, 0, 0);
        this.leftVector = new THREE.Vector3(-2, 0, 0);
        this.forwardVector = new THREE.Vector3(0, 0, -2);
        this.backwardVector = new THREE.Vector3(0, 0, 2);
        this.collisionDistance = 0.25;


        // Add the character to the scene
        this.scene.add(this.characterMesh);
    }

    // Method to update character position each frame
    update(keysPressed, levelData) {
        this.levelData = levelData

        // Initialize movement allowed flags
        let canMoveForward = true;
        let canMoveBackward = true;
        let canMoveLeft = true;
        let canMoveRight = true;

        // Jump logic
        const currentTime = Date.now();
        if (keysPressed.space && this.isOnGround && (currentTime - this.lastJumpTime >= this.jumpCooldownTime)) {
            this.isOnGround = false;
            this.moveY = this.jumpStrength;
            this.lastJumpTime = currentTime;
        }

        if (!this.isOnGround) {
            this.moveY += this.gravity;
        }

        this.raycaster.set(this.characterMesh.position, this.forwardVector);
        const intersectsForward = this.raycaster.intersectObjects(this.levelData);
        if (intersectsForward.length > 0 && intersectsForward[0].distance <= this.collisionDistance) {
            canMoveForward = false;
        }

        this.raycaster.set(this.characterMesh.position, this.backwardVector);
        const intersectsBackward = this.raycaster.intersectObjects(this.levelData);
        if (intersectsBackward.length > 0 && intersectsBackward[0].distance <= this.collisionDistance) {
            canMoveBackward = false;
        }

        this.raycaster.set(this.characterMesh.position, this.leftVector);
        const intersectsLeft = this.raycaster.intersectObjects(this.levelData);
        if (intersectsLeft.length > 0 && intersectsLeft[0].distance <= this.collisionDistance) {
            canMoveLeft = false;
        }

        this.raycaster.set(this.characterMesh.position, this.rightVector);
        const intersectsRight = this.raycaster.intersectObjects(this.levelData);
        if (intersectsRight.length > 0 && intersectsRight[0].distance <= this.collisionDistance) {
            canMoveRight = false;
        }

        // Set movement based on key presses
        this.moveZ = keysPressed.w ? -this.moveSpeed : keysPressed.s ? this.moveSpeed : 0;
        this.moveX = keysPressed.a ? -this.moveSpeed : keysPressed.d ? this.moveSpeed : 0;

        const tempZ = this.moveZ;
        const tempX = this.moveX;
        if (this.moveZ < 0 && !canMoveForward) this.moveZ = 0; // Forward
        if (this.moveZ > 0 && !canMoveBackward) this.moveZ = 0; // Backward
        if (this.moveX < 0 && !canMoveLeft) this.moveX = 0;     // Left
        if (this.moveX > 0 && !canMoveRight) this.moveX = 0;    // Right

        const direction = new THREE.Vector2(this.moveX, this.moveZ);
        direction.normalize().multiplyScalar(this.moveSpeed);
        this.moveZ = tempZ;
        this.moveX = tempX;


        // Update character position based on movement
        this.characterMesh.position.x += direction.x;
        this.characterMesh.position.y += this.moveY;
        this.characterMesh.position.z += direction.y;

        // Collision detection can be added here

        // Snap character to ground if on a surface
        this.raycaster.set(this.characterMesh.position, this.downVector);
        const intersectsDown = this.raycaster.intersectObjects(this.levelData);

        // Check if there’s a ground tile directly below within a small distance
        if (!this.isOnGround && intersectsDown.length > 0 && intersectsDown[0].distance <= 0.5) {
            this.characterMesh.position.y = Math.floor(this.characterMesh.position.y) + 1;  // Snap character to ground level
            this.moveY = 0;               // Reset vertical velocity
            this.isOnGround = true;           // Allow jumping again
        } else {
            this.isOnGround = false;          // Character is in the air
        }
    }
}
