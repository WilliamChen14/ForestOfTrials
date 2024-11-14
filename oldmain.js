import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement);

const defaultPosition = new THREE.Vector3(5, 0, 5);

// Position the camera
camera.position.set(5, 15, 5);  // Adjust to top-down view
camera.lookAt(defaultPosition);

// Create a tile-based floor (10x10 grid)
const groundTiles = [];
const tileSize = 1;  // Adjust based on preferred scale
const floorSize = 10;

const sunLight = new THREE.DirectionalLight( 0xffffff, 1);
sunLight.castShadow = true; // default false
sunLight.position.set(10,10,10);

const target = new THREE.Object3D(); // Create a target object
target.position.set(0, 0, 0); // Set the target position, for example, the center of the scene
scene.add(target);

// Set the light to point towards the target
sunLight.target = target;
a
scene.add( sunLight );

// Optionally, add ambient light to ensure basic visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); 
ambientLight.castShadow = true; // default false
scene.add(ambientLight);

function resetGame() {
    character.position.copy(defaultPosition);
    character.position.y = 1;  
    moveX = 0;
    moveY = 0;  
    moveZ = 0;
    isOnGround = true;
    keysPressed = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
    };
}

for (let x = 0; x < floorSize; x++) {
    for (let z = 0; z < floorSize; z++) {
        const tileMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x008000,              // base color of the material
            roughness: 0.5,               // how rough the material is
            metalness: 0,               // metallic quality
        })
        const tile = new THREE.Mesh(
            new THREE.BoxGeometry(tileSize, 1, tileSize),
            tileMaterial
        );
        tile.castShadow = true
        tile.receiveShadow = true
        tile.position.set(x, 0, z);
        scene.add(tile);
        groundTiles.push(tile);
    }
}
for (let x = 2; x < 4; x++) {
    for (let z = 2; z < 4; z++) {
        const tileMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x808000,              // base color of the material
            roughness: 0.5,               // how rough the material is
            metalness: 0,               // metallic quality
        })
        const tile = new THREE.Mesh(
            new THREE.BoxGeometry(tileSize, 1, tileSize),
            tileMaterial
        );
        tile.castShadow = true
        tile.receiveShadow = true
        tile.position.set(x, 1, z);
        scene.add(tile);
        groundTiles.push(tile);
    }
}
for (let x = 3; x < 4; x++) {
    for (let z = 2; z < 4; z++) {
        const tileMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x808000,              // base color of the material
            roughness: 0.5,               // how rough the material is
            metalness: 0,               // metallic quality
        })
        const tile = new THREE.Mesh(
            new THREE.BoxGeometry(tileSize, 1, tileSize),
            tileMaterial
        );
        tile.castShadow = true
        tile.receiveShadow = true
        tile.position.set(x, 2, z);
        scene.add(tile);
        groundTiles.push(tile);
    }
}

const tile1 = new THREE.Mesh(
    new THREE.BoxGeometry(tileSize, 1, tileSize),
    new THREE.MeshBasicMaterial({ color: 0x4a3f3a })
);
tile1.position.set(0, 1, 10);
scene.add(tile1);
groundTiles.push(tile1);

const tile2 = new THREE.Mesh(
    new THREE.BoxGeometry(tileSize, 1, tileSize),
    new THREE.MeshBasicMaterial({ color: 0x4a3f3a })
);
tile2.position.set(10, 1, 0);
scene.add(tile2);
groundTiles.push(tile2);

// Create a simple character (a cube) and set initial position
const characterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1b9400,              // base color of the material
    roughness: 0.5,               // how rough the material is
    metalness: 0,               // metallic quality
})
const character = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    characterMaterial
);
character.castShadow = true
character.position.set(5, 1, 5);  // Center character on grid
scene.add(character);


// Movement variables
const moveSpeed = 0.1;
const jumpStrength = 0.15;
const jumpCooldownTime = 400; // Cooldown duration in milliseconds (1 second)
let lastJumpTime = 0; // Timestamp of the last jump
const gravity = -0.01;
let moveX = 0;
let moveY = 0;
let moveZ = 0;
let isOnGround = true;
const raycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -2, 0);
const upVector = new THREE.Vector3(0, 2, 0);
const rightVector = new THREE.Vector3(2, 0, 0);
const leftVector = new THREE.Vector3(-2, 0, 0);
const forwardVector = new THREE.Vector3(0, 0, -2);
const backwardVector = new THREE.Vector3(0, 0, 2);
const collisionDistance = 0.25;

//collision visualizer
// Create arrow helpers for each ray
const arrowLength = 2.0;  // Length of arrows for visualization
const forwardArrow = new THREE.ArrowHelper(forwardVector.clone().normalize(), character.position, arrowLength, 0xff0000); // Red
const backwardArrow = new THREE.ArrowHelper(backwardVector.clone().normalize(), character.position, arrowLength, 0x00ff00); // Green
const leftArrow = new THREE.ArrowHelper(leftVector.clone().normalize(), character.position, arrowLength, 0x0000ff); // Blue
const rightArrow = new THREE.ArrowHelper(rightVector.clone().normalize(), character.position, arrowLength, 0xffff00); // Yellow
const downArrow = new THREE.ArrowHelper(downVector.clone().normalize(), character.position, arrowLength, 0xff00ff); // Magenta

// Add arrows to the scene
/*
scene.add(forwardArrow);
scene.add(backwardArrow);
scene.add(leftArrow);
scene.add(rightArrow);
scene.add(downArrow);
*/

// Event listener for keypresses
window.addEventListener('keydown', onKeyPress);
window.addEventListener('keyup', onKeyRelease);

let keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,  // Add space for jumping
};

function onKeyPress(event) {
    switch (event.key) {
        case "w":  // Move up
            moveZ = -moveSpeed;
            keysPressed.w = true;
            break;
        case "a":  // Move left
            moveX = -moveSpeed;
            keysPressed.a = true;
            break;
        case "s":  // Move down
            moveZ = moveSpeed;
            keysPressed.s = true;
            break;
        case "d":  // Move right
            moveX = moveSpeed;
            keysPressed.d = true;
            break;
        case "j":
            console.log("Action J");
            break;
        case "k":
            console.log("Action K");
            break;
        case "l":
            console.log("Action L");
            break;
        case "r":
            console.log("Action reset game");
            resetGame();
            break;
        case "Escape":
            console.log("Pause Game");
            break;
        case " ":
            keysPressed.space = true;
            break;
        default:
            break;
    }
}

// Stop movement when key is released
function onKeyRelease(event) {
    switch (event.key) {
        case "w":
            if(keysPressed.s){
                moveZ = moveSpeed;
            }
            else{
                moveZ = 0
            }
            keysPressed.w = false;
            break;
        case "a":  // Move left
            if(keysPressed.d){
                moveX = moveSpeed;
            }
            else{
                moveX = 0;
            }
            keysPressed.a = false;
            break;
        case "s":  // Move down
            if(keysPressed.w){
                moveZ = -moveSpeed;
            }
            else{
                moveZ = 0
            }
            keysPressed.s = false;
            break;
        case "d":  // Move right
            if(keysPressed.a){
                moveX = -moveSpeed;
            }
            else{
                moveX = 0;
            }
            keysPressed.d = false;
            break;
        case " ":
            keysPressed.space = false;
            break;
        default:
            break;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Initialize movement allowed flags
    let canMoveForward = true;
    let canMoveBackward = true;
    let canMoveLeft = true;
    let canMoveRight = true;

    const currentTime = Date.now();
    if(keysPressed.space && isOnGround && (currentTime - lastJumpTime >= jumpCooldownTime)){
        isOnGround = false;
        moveY = jumpStrength;
        lastJumpTime = currentTime;
    }

    if(!isOnGround){
        moveY += gravity;
    }

    // Check collisions in each direction
    raycaster.set(character.position, forwardVector);
    const intersectsForward = raycaster.intersectObjects(groundTiles);
    if (intersectsForward.length > 0 && intersectsForward[0].distance <= collisionDistance) {
        canMoveForward = false;
    }

    raycaster.set(character.position, backwardVector);
    const intersectsBackward = raycaster.intersectObjects(groundTiles);
    if (intersectsBackward.length > 0 && intersectsBackward[0].distance <= collisionDistance) {
        canMoveBackward = false;
    }

    raycaster.set(character.position, leftVector);
    const intersectsLeft = raycaster.intersectObjects(groundTiles);
    if (intersectsLeft.length > 0 && intersectsLeft[0].distance <= collisionDistance) {
        canMoveLeft = false;
    }

    raycaster.set(character.position, rightVector);
    const intersectsRight = raycaster.intersectObjects(groundTiles);
    if (intersectsRight.length > 0 && intersectsRight[0].distance <= collisionDistance) {
        canMoveRight = false;
    }
    
    
    
    // Apply movement only if no collision detected in that direction
    let tempZ = moveZ;
    let tempX = moveX;
    if (moveZ < 0 && !canMoveForward) moveZ = 0; // Forward
    if (moveZ > 0 && !canMoveBackward) moveZ = 0; // Backward
    if (moveX < 0 && !canMoveLeft) moveX = 0;     // Left
    if (moveX > 0 && !canMoveRight) moveX = 0;    // Right

    // Update character position based on movement inputs
    const direction = new THREE.Vector2(moveX, moveZ);
    direction.normalize().multiplyScalar(moveSpeed);
    moveZ = tempZ;
    moveX = tempX;

    // Update character position based on normalized movement vector
    character.position.x += direction.x;
    character.position.y += moveY;
    character.position.z += direction.y;

    /*
    forwardArrow.position.copy(character.position);
    backwardArrow.position.copy(character.position);
    leftArrow.position.copy(character.position);
    rightArrow.position.copy(character.position);
    downArrow.position.copy(character.position);
    */

    raycaster.set(character.position, downVector);
    const intersectsDown = raycaster.intersectObjects(groundTiles);

    // Check if there’s a ground tile directly below within a small distance
    if (!isOnGround && intersectsDown.length > 0 && intersectsDown[0].distance <= 0.5) {
        character.position.y = Math.floor(character.position.y) + 1;  // Snap character to ground level
        moveY = 0;               // Reset vertical velocity
        isOnGround = true;           // Allow jumping again
    } else {
        isOnGround = false;          // Character is in the air
    }

    // Set initial camera position to have a top diagonal view
    const cameraOffset = new THREE.Vector3(0, 10, 8); // Adjust to change angle and distance
    camera.position.copy(character.position).add(cameraOffset);
    camera.lookAt(character.position);

    renderer.render(scene, camera);
}

animate();