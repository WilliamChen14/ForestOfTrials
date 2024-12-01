import { Controls } from '../Controls.js';
import { Character } from '../entities/Character.js';
import { LevelOne } from '../levels/LevelOne.js';
import { LevelTwo } from '../levels/LevelTwo.js';
import { GameOverState } from './GameOverState.js';
import { StarterLevel } from '../levels/StarterLevel.js';
import * as THREE from 'three';

const clock = new THREE.Clock();

export class GameState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.controls = new Controls();
        this.currentLevel = 0;
        this.levelData = null;

        this.changeLevel = this.changeLevel.bind(this);
        this.initializeGame();
    }

    async initializeGame() {
        // Set up initial lighting
        this.setupLighting();
        
        // Load character first
        try {
            console.log("Loading character model...");
            this.mixer = await loadModel(this.stateManager.scene);
            console.log("Character loaded successfully with mixer:", this.mixer);
            
            // Create character after model is loaded
            this.character = new Character(this.stateManager.scene);
            
            // Initialize first level
            this.changeLevel();
        } catch (error) {
            console.error("Failed to load character:", error);
        }
    }

    setupLighting() {
        const sunLight = new THREE.DirectionalLight(0xffffff, 5);
        sunLight.castShadow = true;
        sunLight.position.set(2, 10, 2);

        const target = new THREE.Object3D();
        target.position.set(0, 0, 0);
        this.stateManager.scene.add(target);
        sunLight.target = target;

        this.stateManager.scene.add(sunLight);
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;

        const size = 50;
        sunLight.shadow.camera.top = size;
        sunLight.shadow.camera.bottom = -size;
        sunLight.shadow.camera.left = -size;
        sunLight.shadow.camera.right = size;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = size * 3;

        const ambientLight = new THREE.AmbientLight(0x5f8fff, 1.6);
        ambientLight.position.set(-5, 5, 5);
        this.stateManager.scene.add(ambientLight);
    }

    changeLevel() {
        // Store character mesh before clearing scene
        const characterMesh = this.character ? this.character.characterMesh : null;
        
        // Clear existing scene except character
        const objectsToRemove = [];
        this.stateManager.scene.traverse((object) => {
            if (object !== characterMesh) {
                objectsToRemove.push(object);
            }
        });
        objectsToRemove.forEach((object) => {
            this.stateManager.scene.remove(object);
        });

        // Increment level counter
        this.currentLevel++;
        console.log("Changing to level:", this.currentLevel);

        // Create new level
        let level;
        if (this.currentLevel === 1) {
            console.log("Creating StarterLevel");
            level = new StarterLevel(this.stateManager.scene);
        } else if (this.currentLevel === 2) {
            console.log("Creating LevelOne");
            level = new LevelOne(this.stateManager.scene);
        } else if (this.currentLevel === 3) {
            console.log("Creating LevelTwo");
            level = new LevelTwo(this.stateManager.scene);
        } else {
            console.log("Creating default LevelOne");
            level = new LevelOne(this.stateManager.scene);
        }

        // Build the level and store its data
        console.log("Building level...");
        this.levelData = level.build();
        console.log("Level data:", this.levelData);

        // Restore lighting after clearing scene
        this.setupLighting();
        
        // Ensure character is at a good starting position
        if (this.character && this.character.characterMesh) {
            this.character.characterMesh.position.set(0, 1, 0);
        }
    }

    enter() {
        console.log("Entering Game State");
    }

    exit() {
        console.log("Exiting Game State");
        this.controls.resetKeys();
    }

    update() {
        // Safety check for level data and character
        if (!this.levelData || !this.character) {
            console.error("Level data or character not initialized");
            return;
        }

        // Update character
        this.character.update(
            this.controls.keysPressed,
            this.controls.lastKeyPressed,
            this.levelData.MapLayout,
            this.levelData.Mobs,
            this.levelData.Signs,
            this.levelData.Exits,
            this.levelData.Tools,
            this.controls.moveX,
            this.controls.moveZ,
            this.changeLevel,
            this.stateManager
        );

        // Update character animation
        if (this.mixer) {
            const deltaTime = clock.getDelta();
            this.mixer.update(deltaTime * 10);
        }

        // Check for character falling
        if (this.character.characterMesh.position.y < -10) {
            this.currentLevel--;
            this.changeLevel();
        }

        // Check for reset
        if (this.controls.keysPressed.r === true) {
            this.currentLevel--;
            this.changeLevel();
        }

        // Check for game over
        if (this.character.health === 0) {
            this.stateManager.changeState(GameOverState);
        }

        // Update camera
        const cameraOffset = new THREE.Vector3(0, 10, 8);
        this.stateManager.camera.position.copy(this.character.characterMesh.position).add(cameraOffset);
        this.stateManager.camera.lookAt(this.character.characterMesh.position);
    }
}