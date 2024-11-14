// Level.js
import * as THREE from 'three';

export function StarterLevel(scene) {
    let groundTiles = [];
    const tileSize = 1;
    const floorSize = 10;

    // Function to add tiles at specific positions with specific properties
    const addTile = (x, y, z, color) => {
        const tileMaterial = new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.5,
            metalness: 0,
        });
        const tile = new THREE.Mesh(new THREE.BoxGeometry(tileSize, 1, tileSize), tileMaterial);
        tile.castShadow = true;
        tile.receiveShadow = true;
        tile.position.set(x, y, z);
        scene.add(tile);
        groundTiles.push(tile);
    };

    // Add ground tiles (10x10 grid)
    for (let x = 0; x < floorSize; x++) {
        for (let z = 0; z < floorSize; z++) {
            addTile(x, 0, z, 0x008000);
        }
    }

    // Add raised tiles to create platforms or obstacles
    addTile(2, 1, 2, 0x808000);
    addTile(2, 1, 3, 0x808000);
    addTile(3, 1, 2, 0x808000);
    addTile(3, 1, 3, 0x808000);
    addTile(3, 2, 2, 0x808000);
    addTile(3, 2, 3, 0x808000);

    // Add special tiles
    addTile(0, 1, 10, 0x4a3f3a);
    addTile(10, 1, 0, 0x4a3f3a);

    // Set up lights (adjust to your preference)
    const sunLight = new THREE.DirectionalLight( 0xffffff, 1);
    sunLight.castShadow = true; // default false
    sunLight.position.set(-5,5,5);

    const target = new THREE.Object3D(); // Create a target object
    target.position.set(0, 0, 0); // Set the target position, for example, the center of the scene
    scene.add(target);

    // Set the light to point towards the target
    sunLight.target = target;
    
    scene.add( sunLight );

    // Optionally, add ambient light to ensure basic visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); 
    ambientLight.castShadow = true; // default false
    ambientLight.position.set(-5,5,5);

    ambientLight.target = target;
    scene.add(ambientLight);


    //const defaultPosition = new THREE.Vector3(5, 0, 5);


    return groundTiles;  // Return all tiles for collision detection
}
