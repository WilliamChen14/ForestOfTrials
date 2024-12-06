import { Controls } from '../Controls.js';
import { Character } from '../entities/Character.js';
import { WorldThree } from '../levels/WorldThree.js';
import { WorldFour } from '../levels/WorldFour.js';
import { GameOverState } from './GameOverState.js';
import { WorldOne } from '../levels/WorldOne.js';
import * as THREE from 'three';
import { WorldTwo } from '../levels/WorldTwo.js';
import { EndState } from './EndState.js';
import { AudioPlayer } from '/src/Audio.js';
import { WorldFive } from '../levels/WorldFive.js';

const clock = new THREE.Clock();

export class GameState {
    constructor(stateManager) {
        this.audio = new AudioPlayer();
        this.stateManager = stateManager;
        this.controls = new Controls();
        this.currentLevel = 0;
        this.levelData = null;
        this.level = null; // Store level instance for updates
        this.changeLevel = this.changeLevel.bind(this);
        this.isInitLevel = false;

        this.isPaused = false;
        this.lastEscapePress = 0;
    }

    // initialize game
    async enter() {
        this.setupLighting();
        
        try {
            console.log("Loading character model...");
            
            this.character = new Character(this.stateManager.scene);
            await this.character.init();
            
            await this.changeLevel();
        } catch (error) {
            console.error("Failed to load character:", error);
        }
    }

    togglePause() {
        const currentTime = Date.now();
        if (currentTime - this.lastEscapePress < 200) {
            return; // Prevent multiple toggles from one press
        }
        
        this.isPaused = !this.isPaused;
        this.lastEscapePress = currentTime;
        
        if (this.isPaused) {
            console.log("Game is paused! Press escape to resume.")
            clock.stop();
        } else {
            clock.start();
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

    async resetLevel() {
        // Return if already initializing level
        if (this.isInitLevel) return;

        const objectsToRemove = [];
        this.stateManager.scene.traverse((object) => {
            objectsToRemove.push(object);
        });
        objectsToRemove.forEach((object) => {
            this.stateManager.scene.remove(object);
        });
    
        this.character = new Character(this.stateManager.scene);
        await this.character.init();
    
        console.log("Resetting level:", this.currentLevel);
        
        switch (this.currentLevel) {
            case 1:
                this.level = new WorldOne(this.stateManager.scene);
                break;
            case 2:
                this.level = new WorldTwo(this.stateManager.scene);
                break;
            case 3:
                this.level = new WorldThree(this.stateManager.scene);
                break;
            case 4:
                this.level = new WorldFour(this.stateManager.scene);
            case 5:
                this.level = new WorldFive(this.stateManager.scene);
                break;
            default:
                console.log("Invalid level");
                this.stateManager.changeState(EndState);
                return;
        }
    
        console.log("Rebuilding level...");
        this.levelData = await this.level.build();
        this.setupLighting();
        if (this.character && this.character.characterMesh) {
            this.character.characterMesh.position.set(0, 1, 0);
        }

        this.isInitLevel = false;
    }

    async changeLevel() {

        // enter loading state
        if (this.isInitLevel) return;
        this.showLoadMessage("loading level...");
        this.isInitLevel = true;
        

        const objectsToRemove = [];
        this.stateManager.scene.traverse((object) => {
            objectsToRemove.push(object);
        });
        objectsToRemove.forEach((object) => {
            this.stateManager.scene.remove(object);
        });

        this.character = new Character(this.stateManager.scene);
        this.character.init();

        this.currentLevel++;
        console.log("Changing to level:", this.currentLevel);

        // Create new level
        if (this.currentLevel === 1) {
            console.log("Creating WorldOneWorldThree");
            this.level = new WorldOne(this.stateManager.scene, this.character);
        } else if (this.currentLevel === 2) {
            console.log("Creating WorldOneWorldFour");
            this.level = new WorldTwo(this.stateManager.scene);
        } else if (this.currentLevel === 3) {
            console.log("Creating WorldOneLevelThree");
            this.level = new WorldThree(this.stateManager.scene);
        } else if (this.currentLevel === 4){
            console.log("Creating default WorldOneLevelFour");
            this.level = new WorldFour(this.stateManager.scene);
        }
        else if (this.currentLevel === 5){
            console.log("Creating default WorldTwoWorldThree");
            this.level = new WorldFive(this.stateManager.scene);
        }
        else {
            console.log("Game has been won");
            this.stateManager.changeState(EndState);
        }

        console.log("Building level...");
        this.levelData = await this.level.build();
        console.log("Level data:", this.levelData);

        this.setupLighting();
        
        if (this.character && this.character.characterMesh) {
            this.character.characterMesh.position.set(0, 1, 0);
        }

        // exit loading state
        this.hideLoadMessage();
        this.isInitLevel = false;
    }

    exit() {
        console.log("Exiting Game State");
        this.controls.resetKeys();
    }

    showLoadMessage(message) {
        const messageContainer = document.getElementById("message-container");
        messageContainer.innerText = message;
        messageContainer.style.display = "block"; // Show the message
    }

    hideLoadMessage() {
        const messageContainer = document.getElementById("message-container");
        messageContainer.style.display = "none"; 
    }

    update() {
        let deltaTime = clock.getDelta();
        if (!this.levelData || !this.character) {
            console.error("Level data or character not initialized");
            return;
        }

        // Update level hazards
        if (this.level && this.level.update) {
            this.level.update();
        }

        if (this.controls.keysPressed.escape) {
            this.togglePause();
            this.controls.keysPressed.escape = false;
        }

        if (this.isPaused) {
            return;
        }

        // Update character with hazards included
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
            this.stateManager,
            this.levelData.Hazards,
            this.levelData.Waters
        );

        if (this.character.characterMesh.position.y < -10) {
            this.levelData = [];
            this.resetLevel();
        }

        if (this.controls.keysPressed.r === true) {
            this.levelData = [];
            this.resetLevel();
        }

        if(this.character.health == 0){
            while (this.stateManager.scene.children.length > 0) {
                this.stateManager.scene.remove(this.stateManager.scene.children[0]);
            }
            this.levelData = [];
            this.stateManager.changeState(GameOverState);
        }

        const cameraOffset = new THREE.Vector3(0, 15, 12);

        // debug camera is activated with "["
        if (!this.controls.debugCameraMode) {
            //this.stateManager.camera.position += new THREE.Vector3(1,1,1);
            const targetCameraPosition = this.stateManager.camera.position.clone().sub(cameraOffset);
            const deltaCameraPosition = this.character.characterMesh.position.clone().sub(targetCameraPosition);


            const cameraSpeed = 2;
            deltaCameraPosition.multiplyScalar(cameraSpeed * deltaTime);
            this.stateManager.camera.position.x += deltaCameraPosition.x;
            this.stateManager.camera.position.y += deltaCameraPosition.y;
            this.stateManager.camera.position.z += deltaCameraPosition.z;
            this.stateManager.camera.rotation.set(-Math.PI * 0.28, 0, 0);
        }
    }
}