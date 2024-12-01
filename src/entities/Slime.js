import * as THREE from 'three';

export class Slime {
    constructor(scene, x, y, z) {
        this.scene = scene;
        
        // Create slime group to hold all cube parts
        this.mobMesh = new THREE.Group();
        
        // Slime material - semi-transparent green
        const slimeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x44FF44,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.0,
        });

        // Create outer cube (slightly transparent)
        const outerGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        const outerCube = new THREE.Mesh(outerGeometry, slimeMaterial);
        
        // Create inner cube (more opaque, darker green)
        const innerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x257425,
            transparent: true,
            opacity: 0.9,
            roughness: 0.1,
            metalness: 0.0,
        });
        const innerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);

        // Create mouth (black cube)
        const mouthGeometry = new THREE.BoxGeometry(0.25, 0.1, 0.1);
        const mouth = new THREE.Mesh(mouthGeometry, eyeMaterial);
        mouth.position.set(0, -0.15, 0.36);

        // Add all parts to the group
        this.mobMesh.add(outerCube);
        this.mobMesh.add(innerCube);

        // Position the entire group
        this.mobMesh.position.set(x, y, z);
        
        // Add hopping animation properties
        this.jumpHeight = 0.3;
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

        this.scene.add(this.mobMesh);

        // Collision and movement properties
        this.collisionDistance = 0.5;
        this.moveSpeed = 0.03;
        this.direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        ).normalize();

        this.lastCollisionTime = 0;
        this.lastLostLife = 0;
        this.health = 1;
        this.isDead = false;

        // Bind methods
        this.checkCollision = this.checkCollision.bind(this);
        this.getLastCollisionTime = this.getLastCollisionTime.bind(this);
        this.loseLife = this.loseLife.bind(this);

        // Collision raycaster
        this.raycaster = new THREE.Raycaster();
        this.collisionVectors = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1)
        ];
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
        this.health = this.health - damage;
        this.lastLostLife = Date.now;
    }

    update(levelData, Mobs) {
        if(this.isDead){
            return;
        }

        // Random direction change
        if (Math.random() < 0.02) {
            this.direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                (Math.random() - 0.5) * 2
            ).normalize();
        }

        this.checkWallCollision(levelData);

        // Update position
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

        if(this.health <= 0){
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
