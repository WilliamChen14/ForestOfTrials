import * as THREE from 'three';

export class Lava {
    constructor(scene, x, y, z) {
        // Cache scene reference and position
        this.scene = scene;
        this.position = new THREE.Vector3(x, y, z);
        
        // Collision properties
        this.lastCollisionTime = 0;
        this.collisionDistanceSquared = 0.49; // 0.7² - precompute for faster checks
        this.damageInterval = 800;
        
        // Create cube mesh with minimal material
        const lava = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                color: 0xff4400,
            })
        );
        lava.position.copy(this.position);
        this.MapLayoutMesh = lava;
        
        // Batch add to scene
        scene.add(lava);
    }
    
    checkCollision(characterMesh) {
        // Use distanceToSquared instead of distanceTo to avoid square root calculation
        if (this.position.distanceToSquared(characterMesh.position) <= this.collisionDistanceSquared) {
            const currentTime = Date.now();
            if (currentTime - this.lastCollisionTime >= this.damageInterval) {
                this.lastCollisionTime = currentTime;
                return true;
            }
        }
        return false;
    }
    
    // Only calculate if needed
    getLastCollisionTime() {
        return this.lastCollisionTime;
    }
    
    remove() {
        this.scene.remove(this.MapLayoutMesh);
        this.scene.remove(this.light);
        // Clear references for garbage collection
        this.MapLayoutMesh = null;
        this.light = null;
        this.scene = null;
    }
}