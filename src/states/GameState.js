import { Controls } from '../Controls.js';
import { Character } from '../entities/Character.js';
import { LevelOne } from '../levels/LevelOne.js';
import { LevelTwo } from '../levels/LevelTwo.js';
import { GameOverState } from './GameOverState.js';
import { StarterLevel } from '../levels/StarterLevel.js';
import * as THREE from 'three';
import { StarterLevelTwo } from '../levels/StarterLevelTwo.js';
import { EndState } from './EndState.js';

const clock = new THREE.Clock();

export class GameState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.controls = new Controls();
        this.currentLevel = 0;
        this.levelData = null;
        this.level = null; // Store level instance for updates
        this.changeLevel = this.changeLevel.bind(this);
        this.isInitLevel = false;
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
            console.log("Creating WorldOneLevelOne");
            this.level = new StarterLevel(this.stateManager.scene);
        } else if (this.currentLevel === 2) {
            console.log("Creating WorldOneLevelTwo");
            this.level = new StarterLevelTwo(this.stateManager.scene);
        } else if (this.currentLevel === 3) {
            console.log("Creating WorldOneLevelThree");
            this.level = new LevelOne(this.stateManager.scene);
        } else if (this.currentLevel === 4){
            console.log("Creating default WorldOneLevelFour");
            this.level = new LevelTwo(this.stateManager.scene);
        }
        else if (this.currentLevel === 5){
            console.log("Creating default WorldTwoLevelOne");
            this.level = new LevelTwo(this.stateManager.scene);
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
            this.currentLevel--;
            this.changeLevel();
        }

        if (this.controls.keysPressed.r === true) {
            this.currentLevel--;
            this.changeLevel();
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