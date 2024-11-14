// src/Character.js
import * as THREE from 'three';
import { Sign } from './Sign';


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
        this.characterMesh.position.set(0, 1, 0); // Initial position

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

        //stats
        this.health = 5;
        this.updateHealthDisplay();
        this.lastMobCollisionTime = 0;

        this.lastDirection = new THREE.Vector3(0, 0, -1);
        this.lastAttackTime = 0;
        this.currentHitbox = 0;


        // Add the character to the scene
        this.scene.add(this.characterMesh);

        this.createAttackHitbox = this.createAttackHitbox.bind(this);
    }

    createAttackHitbox() {
        // Create a visible hitbox with red color
        const hitboxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const hitboxGeometry = new THREE.BoxGeometry(2, 1, 1);
        const hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);

        // Position the hitbox based on last direction
        hitboxMesh.position.copy(this.characterMesh.position);
        hitboxMesh.position.add(this.lastDirection.clone().multiplyScalar(1));  // Offset from character position

        // Add hitbox to the scene
        this.scene.add(hitboxMesh);
        this.currentHitbox = hitboxMesh;

        // Remove hitbox after a short duration (e.g., 200ms)
        setTimeout(() => {
            this.scene.remove(hitboxMesh);
            this.currentHitbox = null;
        }, 200);
        return hitboxMesh;
    }

    checkHitboxCollision(mob) {
        if (!this.currentHitbox) return false; // No hitbox present

        const hitboxBoundingBox = new THREE.Box3().setFromObject(this.currentHitbox);
        const mobBoundingBox = new THREE.Box3().setFromObject(mob.mobMesh);
        
        return hitboxBoundingBox.intersectsBox(mobBoundingBox);
    }

     // Method to change the health value and update the health display
     updateHealth(health) {
        this.health = health;
        this.updateHealthDisplay();  // Update the heart display
    }

    // Update the health display by adding/removing heart elements
    updateHealthDisplay() {
        const healthContainer = document.getElementById("health-container");

        // Clear the existing hearts
        healthContainer.innerHTML = "";

        // Add hearts based on current health
        for (let i = 0; i < this.health; i++) {
            const heart = document.createElement("div");
            heart.classList.add("heart");  // Add the class for styling
            healthContainer.appendChild(heart);
        }
    }

    // Show the message container when collision with sign occurs
    showMessage(message) {
        const messageContainer = document.getElementById("message-container");
        messageContainer.innerText = message;
        messageContainer.style.display = "block"; // Show the message
        setTimeout(() => {
            messageContainer.style.display = "none"; // Hide the message after 3 seconds
        }, 3000);
    }

    // Method to update character position each frame
    update(keysPressed, MapLayout, Mobs, Signs, Exit, moveX, moveZ, changeLevel, stateManager) {
        const currentTime = Date.now();
        this.levelData = MapLayout;
        this.signs = Signs;
        this.Mobs = Mobs;
        this.Exit = Exit;


        this.signs.forEach(obj => obj.checkSignCollision(this.characterMesh));

        if (keysPressed.j === true && currentTime - this.lastAttackTime > 500) {
            this.lastAttackTime = currentTime;
            this.createAttackHitbox();
        }

        this.Mobs.forEach(obj=> {
            if(currentTime - obj.getLastCollisionTime() > 500 && obj.checkCollision(this.characterMesh)) {
                this.updateHealth(this.health - 1);
                console.log("collided with mob");
            }


            obj.update();

            if(this.checkHitboxCollision(obj)){
                obj.loseLife(1);
            }
                
        });
        

        //this.showMessage("You can jump with the space bar. \nWhen you are ready make your way to the Yellow Exit");



        // Initialize movement allowed flags
        let canMoveForward = true;
        let canMoveBackward = true;
        let canMoveLeft = true;
        let canMoveRight = true;

        // Jump logic
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
        const intersectsExitForward = this.raycaster.intersectObjects(this.Exit);
        if (intersectsExitForward.length > 0 && intersectsExitForward[0].distance <= this.collisionDistance) {
            console.log("exit hit");
            changeLevel();
        }

        this.raycaster.set(this.characterMesh.position, this.backwardVector);
        const intersectsBackward = this.raycaster.intersectObjects(this.levelData);
        if (intersectsBackward.length > 0 && intersectsBackward[0].distance <= this.collisionDistance) {
            canMoveBackward = false;
        }
        const intersectsExitBack = this.raycaster.intersectObjects(this.Exit);
        if (intersectsExitBack.length > 0 && intersectsExitBack[0].distance <= this.collisionDistance) {
            console.log("exit hit");
            changeLevel();
        }

        this.raycaster.set(this.characterMesh.position, this.leftVector);
        const intersectsLeft = this.raycaster.intersectObjects(this.levelData);
        if (intersectsLeft.length > 0 && intersectsLeft[0].distance <= this.collisionDistance) {
            canMoveLeft = false;
        }
        const intersectsExitLeft = this.raycaster.intersectObjects(this.Exit);
        if (intersectsExitLeft.length > 0 && intersectsExitLeft[0].distance <= this.collisionDistance) {
            console.log("exit hit");
            changeLevel();
        }

        this.raycaster.set(this.characterMesh.position, this.rightVector);
        const intersectsRight = this.raycaster.intersectObjects(this.levelData);
        if (intersectsRight.length > 0 && intersectsRight[0].distance <= this.collisionDistance) {
            canMoveRight = false;
        }
        const intersectsExitRight = this.raycaster.intersectObjects(this.Exit);
        if (intersectsExitRight.length > 0 && intersectsExitRight[0].distance <= this.collisionDistance) {
            console.log("exit hit");
            changeLevel();
        }

        // Set movement based on key presses
        this.moveX = moveX;
        this.moveZ = moveZ;
        /*
        this.moveZ = keysPressed.w ? -this.moveSpeed : keysPressed.s ? this.moveSpeed : 0;
        this.moveX = keysPressed.a ? -this.moveSpeed : keysPressed.d ? this.moveSpeed : 0;
        */

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
