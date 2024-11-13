import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position the camera
camera.position.set(5, 15, 5);  // Adjust to top-down view
camera.lookAt(new THREE.Vector3(5, 0, 5));

// Create a tile-based floor (10x10 grid)
const groundTiles = [];
const tileSize = 1;  // Adjust based on preferred scale
const floorSize = 10;
for (let x = 0; x < floorSize; x++) {
    for (let z = 0; z < floorSize; z++) {
        const tile = new THREE.Mesh(
            new THREE.BoxGeometry(tileSize, -1, tileSize),
            new THREE.MeshBasicMaterial({ color: 0x4a3f3a })
        );
        tile.position.set(x, 0, z);
        scene.add(tile);
        groundTiles.push(tile);
    }
}
for (let x = 0; x < 2; x++) {
    for (let z = 0; z < 2; z++) {
        const tile = new THREE.Mesh(
            new THREE.BoxGeometry(tileSize, -1, tileSize),
            new THREE.MeshBasicMaterial({ color: 0x4a3f3a })
        );
        tile.position.set(x, 1, z);
        scene.add(tile);
        groundTiles.push(tile);
    }
}

// Create a simple character (a cube) and set initial position
const character = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x1b9400 })
);
character.position.set(5, 0.5, 5);  // Center character on grid
scene.add(character);


// Movement variables
const moveSpeed = 0.1;
const jumpStrength = 0.2;
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
const forwardVector = new THREE.Vector3(0, 0, 2);
const backVector = new THREE.Vector3(0, 0, -2);

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
                moveZ = -amoveSpeed;
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

    // Update character position based on movement inputs
    const direction = new THREE.Vector2(moveX, moveZ);
    direction.normalize().multiplyScalar(moveSpeed);

    if(keysPressed.space && isOnGround){
        isOnGround = false;
        moveY = jumpStrength;
    }

    if(!isOnGround){
        moveY += gravity;
    }
    // Update character position based on normalized movement vector
    character.position.x += direction.x;
    character.position.y += moveY;
    character.position.z += direction.y;

    raycaster.set(character.position, downVector);
    const intersects = raycaster.intersectObjects(groundTiles);

    // Check if there’s a ground tile directly below within a small distance
    if (!isOnGround && intersects.length > 0 && intersects[0].distance <= 1.5) {
        character.position.y = Math.floor(character.position.y) + 1;  // Snap character to ground level
        moveY = 0;               // Reset vertical velocity
        isOnGround = true;           // Allow jumping again
    } else {
        isOnGround = false;          // Character is in the air
    }

    // Set initial camera position to have a top diagonal view
    const cameraOffset = new THREE.Vector3(0, 6, 5); // Adjust to change angle and distance
    camera.position.copy(character.position).add(cameraOffset);
    camera.lookAt(character.position);

    renderer.render(scene, camera);
}

animate();