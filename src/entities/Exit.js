import * as THREE from 'three';

export class Exit {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.doorGroup = new THREE.Group(); // Group to hold all door parts
        this.MapLayoutMesh = null; // For collision detection
        
        // Create door components
        this.createDoor(x, y, z);
        
        // Add the door group to the scene
        this.scene.add(this.doorGroup);
    }
    
    createDoor(x, y, z) {
        // Material Definitions
        const doorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8B4513, // Brown color for the door
            roughness: 0.6,
            metalness: 0.2,
        });
        
        const frameMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x654321, // Darker brown for the frame
            roughness: 0.7,
            metalness: 0.3,
        });
        
        const handleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFD700, // Gold color for the handle
            roughness: 0.4,
            metalness: 0.9,
        });
        
        // 1. Main Door Body
        const doorGeometry = new THREE.BoxGeometry(1.2, 2, 0.2); // width, height, thickness
        const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
        doorMesh.castShadow = true;
        doorMesh.receiveShadow = true;
        doorMesh.position.set(x, y, z);
        doorMesh.rotation.y = Math.PI / 2; // Changed to positive PI/2 to face the other way
        
        // 2. Door Frame
        const frameThickness = 0.05;
        const frameHeight = 2.1;
        const frameWidth = 1.3;
        const frameDepth = 0.25;
        
        const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameThickness);
        const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        frameMesh.castShadow = true;
        frameMesh.receiveShadow = true;
        frameMesh.position.set(x, y, z);
        frameMesh.rotation.y = Math.PI / 2; // Changed to match door rotation
        
        // 3. Door Handle
        const handleRadius = 0.05;
        const handleLength = 0.4;
        const handleGeometry = new THREE.CylinderGeometry(handleRadius, handleRadius, handleLength, 32);
        const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
        handleMesh.castShadow = true;
        handleMesh.receiveShadow = true;
        
        // Adjusted handle position for new door orientation
        handleMesh.position.set(x - 0.2, y, z + 0.09); // Changed x and z offsets
        handleMesh.rotation.z = Math.PI / 2;
        
        // 4. Hinges
        const hingeRadius = 0.02;
        const hingeLength = 0.1;
        const hingeGeometry = new THREE.CylinderGeometry(hingeRadius, hingeRadius, hingeLength, 16);
        const hingeMesh1 = new THREE.Mesh(hingeGeometry, frameMaterial);
        hingeMesh1.castShadow = true;
        hingeMesh1.receiveShadow = true;
        hingeMesh1.position.set(x + 0.5, y + 0.4, z); // Changed x offset
        hingeMesh1.rotation.x = Math.PI / 2;
        
        const hingeMesh2 = new THREE.Mesh(hingeGeometry, frameMaterial);
        hingeMesh2.castShadow = true;
        hingeMesh2.receiveShadow = true;
        hingeMesh2.position.set(x + 0.5, y - 0.4, z); // Changed x offset
        hingeMesh2.rotation.x = Math.PI / 2;
        
        // Add all parts to the door group
        this.doorGroup.add(doorMesh);
        this.doorGroup.add(frameMesh);
        this.doorGroup.add(handleMesh);
        this.doorGroup.add(hingeMesh1);
        this.doorGroup.add(hingeMesh2);
        
        // Set the position of the entire door group
        this.doorGroup.position.set(0, 0, 0);
        
        // Set the collision mesh to the main door body
        this.MapLayoutMesh = doorMesh;
    }
    
    remove() {
        this.scene.remove(this.doorGroup);
    }
}