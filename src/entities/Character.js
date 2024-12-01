// src/Character.js
import * as THREE from 'three';
import { Sign } from './Sign';
import { Model } from '../Models.js';

import CHARACTER from '/assets/models/character.glb'

export class Character {
    constructor(scene) {
        this.scene = scene;
        this.model = new Model(this.scene);
        this.model.loadModel(CHARACTER).then(() => {
            console.log("hello")
            this.characterMesh = this.model.sceneObject;
        });

        // Set initial position
        this.model.sceneObject.position.set(0, 1, 0); // Initial position

        // Enable shadow casting and receiving
        /*
        this.characterMesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        */

        // Movement properties
        this.moveSpeed = 0.1;
        this.jumpStrength = 0.15;
        this.gravity = -0.01;
        this.isOnGround = false;
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

        // Stats
        this.health = 5;
        this.updateHealthDisplay();
        this.lastMobCollisionTime = 0;

        this.lastDirection = new THREE.Vector3(0, 0, -1);
        this.lastAttackTime = 0;
        this.currentHitbox = 0;

        // Add the character to the scene
        this.scene.add(this.characterMesh);

        this.createAttackHitbox = this.createAttackHitbox.bind(this);

        this.heldItem = null;
        this.pickupCooldown = 500;
        this.lastPickupTime = 0;
    }

    createAttackHitbox(horizontalDirection) {
        // Create a visible hitbox with red color
        const hitboxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        let hitboxGeometry = null;
        if(horizontalDirection == 1){
            hitboxGeometry =  new THREE.BoxGeometry(1, 1, 2);
        }
        else{
            hitboxGeometry =  new THREE.BoxGeometry(2, 1, 1);
        }
        
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
    update(keysPressed, LastKeyPressed, MapLayout, Mobs, Signs, Exit, Tools, moveX, moveZ, changeLevel, stateManager, Hazards) {
        const currentTime = Date.now();
        this.levelData = MapLayout;
        this.signs = Signs;
        this.Mobs = Mobs;
        this.Exit = Exit;
        this.Tools = Tools;
        this.Hazards = Hazards || [];

        const angle = Math.atan2(this.lastDirection.x, this.lastDirection.z);
        this.characterMesh.rotation.y = angle;

        if(LastKeyPressed === "w"){
            this.lastDirection = new THREE.Vector3(0, 0, -1);
        }
        else if(LastKeyPressed === "a"){
            this.lastDirection = new THREE.Vector3(-1, 0, 0);
        }
        else if(LastKeyPressed === "d"){
            this.lastDirection = new THREE.Vector3(1, 0, 0);
        }
        else {
            this.lastDirection = new THREE.Vector3(0, 0, 1);
        }
            

        this.signs.forEach(obj => obj.checkSignCollision(this.characterMesh));

        if (keysPressed.j === true && currentTime - this.lastAttackTime > 500) {
            this.lastAttackTime = currentTime;
            if(LastKeyPressed === "d" || LastKeyPressed === "a")
                this.createAttackHitbox(1);
            else{
                this.createAttackHitbox(0);
            }
        }

        this.Hazards.forEach(hazard => {
            if (currentTime - hazard.getLastCollisionTime() > 800 && hazard.checkCollision(this.characterMesh)) {
                this.updateHealth(this.health - 1);
                console.log("collided with fire");
            }
            
            if (hazard.update) {
                hazard.update();
            }
        });

        this.Mobs.forEach(obj=> {
            if(currentTime - obj.getLastCollisionTime() > 500 && obj.checkCollision(this.characterMesh) && !obj.getIsDead()) {
                this.updateHealth(this.health - 1);
                console.log("collided with mob");
            }


            obj.update(this.levelData, this.Mobs);

            if(this.checkHitboxCollision(obj)){
                if(currentTime - obj.lastLostLife > 600){
                    obj.loseLife(1);
                    obj.lastLostLife = currentTime;
                }
            }
                
        });

        this.Tools.forEach(obj=> {
            if(obj.checkCollision(this.characterMesh) && keysPressed.k && currentTime - this.lastPickupTime > this.pickupCooldown){
                this.lastPickupTime = currentTime;
                console.log("tried to pick up box");
                if(this.heldItem === null){
                    this.heldItem = obj;
                }
            }

            if(obj === this.heldItem && keysPressed.k && currentTime - this.lastPickupTime > this.pickupCooldown){
                this.lastPickupTime = currentTime;
                console.log("tried to drop the box");
                obj.MapLayoutMesh.position.x = this.characterMesh.position.x + this.lastDirection.x;
                obj.MapLayoutMesh.position.y = this.characterMesh.position.y + this.lastDirection.y;
                obj.MapLayoutMesh.position.z = this.characterMesh.position.z + this.lastDirection.z;
                
                this.heldItem = null;
            }
        })


        

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

        // Collision detection in all directions
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

        if(currentTime - this.lastAttackTime < 400){
            this.moveX = 0;
            this.moveZ = 0;
        }

        const direction = new THREE.Vector2(this.moveX, this.moveZ);
        direction.normalize().multiplyScalar(this.moveSpeed);
        this.moveZ = tempZ;
        this.moveX = tempX;


        // Update character position based on movement
        this.characterMesh.position.x += direction.x;
        this.characterMesh.position.y += this.moveY;
        this.characterMesh.position.z += direction.y;
        /*
        this.model.sceneObject.position.x = this.characterMesh.position.x;
        this.model.sceneObject.position.y = this.characterMesh.position.y;
        this.model.sceneObject.position.z = this.characterMesh.position.z;
        this.model.mixer.update(0.3);
        */

        if(this.heldItem){
            this.heldItem.MapLayoutMesh.position.x = this.characterMesh.position.x;
            this.heldItem.MapLayoutMesh.position.y = this.characterMesh.position.y + 1;
            this.heldItem.MapLayoutMesh.position.z = this.characterMesh.position.z;
        }

        // Collision detection can be added here

        // Snap character to ground if on a surface
        this.raycaster.set(this.characterMesh.position, this.downVector);
        const intersectsDown = this.raycaster.intersectObjects(this.levelData);

        // Check if there’s a ground tile directly below within a small distance
        if (!this.isOnGround && intersectsDown.length > 0 && intersectsDown[0].distance <= 0.5) {
            const groundY = intersectsDown[0].point.y;
            this.characterMesh.position.y = groundY + 0.5;
            this.moveY = 0;               // Reset vertical velocity
            this.isOnGround = true;           // Allow jumping again
        }
        else { 
            this.isOnGround = false;
        }
    }
}
