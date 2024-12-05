// main.js
import * as THREE from 'three';
import { StateManager } from './src/StateManager.js';
import { HomeState } from './src/states/HomeState.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create renderer, scene, and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x062b11 );
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Set up lights (adjust to your preference)
const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);

const defaultPosition = new THREE.Vector3(5, 0, 5);
window.addEventListener('resize', onWindowResize, false);

// Position the camera
camera.position.set(5, 15, 5);  // Adjust to top-down view
camera.lookAt(defaultPosition);
new OrbitControls(camera, renderer.domElement); // debug camera controls

// Initialize the state manager and start with the HomeState
const stateManager = new StateManager(scene, camera, renderer);
stateManager.changeState(HomeState);  // Start in the home state

// Pass stateManager to index.js to handle updates
import { animate } from './src/index.js';
animate(stateManager);

// handle window resizes
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}