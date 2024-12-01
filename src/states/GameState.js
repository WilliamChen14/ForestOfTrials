// src/states/GameState.js
import { Controls } from '../Controls.js';
import { Character } from '../entities/Character.js';
import { LevelOne } from '../levels/LevelOne.js';
import { LevelTwo } from '../levels/LevelTwo.js';
import { loadModel } from '../Models.js';
import { GameOverState } from './GameOverState.js';

const clock = new THREE.Clock();


import { StarterLevel } from '../levels/StarterLevel.js';

import * as THREE from 'three';
import { StarterLevelTwo } from '../levels/StarterLevelTwo.js';
import { HomeState } from './HomeState.js';
import { WorldTwoLevelOne } from '../levels/WorldTwoLevelOne.js';

export class GameState {

    constructor(stateManager) {
        this.stateManager = stateManager;
        this.controls = new Controls();
        this.character = new Character(this.stateManager.scene);
        this.levelData = new WorldTwoLevelOne(stateManager.scene);
        this.currentLevel = 0;

        this.changeLevel = this.changeLevel.bind(this);
        this.setUpLevel();
    }

    enter() {
        console.log("Entering Game State");

    }


    changeLevel() {
        // Step 1: Remove all level objects from scene
        this.currentLevel++;
        
        while (this.stateManager.scene.children.length > 0) {
            this.stateManager.scene.remove(this.stateManager.scene.children[0]);
        }
        this.levelData = [];
        
       
    
        // Step 2: Load the new level
        if(this.currentLevel == 1){
            this.levelData = StarterLevelTwo(this.stateManager.scene);
        }
        else if(this.currentLevel == 2){
            this.levelData = LevelOne(this.stateManager.scene);
        }
        else if(this.currentLevel == 3){
            this.levelData = LevelTwo(this.stateManager.scene);
        }
        else if(this.currentLevel == 4){
            this.levelData = LevelOne(this.stateManager.scene);
        }
        else if(this.currentLevel == 5){
            this.levelData = LevelOne(this.stateManager.scene);
        }
        else if(this.currentLevel == 6){
            this.levelData = LevelOne(this.stateManager.scene);
        }
        else if(this.currentLevel == 7){
            this.levelData = LevelOne(this.stateManager.scene);
        }
        else{
            this.levelData = LevelOne(this.stateManager.scene);
        }

        this.character = new Character(this.stateManager.scene);

        this.setUpLevel();
        console.log("Level changed successfully.");
        
    }

    setUpLevel() {
        // Set up lights (adjust to your preference)
        const sunLight = new THREE.DirectionalLight(0xffffff, 5);
        sunLight.castShadow = true; // default false
        sunLight.position.set(2, 10, 2);

        const target = new THREE.Object3D(); // Create a target object
        target.position.set(0, 0, 0); // Set the target position, for example, the center of the scene
        this.stateManager.scene.add(target);

        // Set the light to point towards the target
        sunLight.target = target;

        this.stateManager.scene.add(sunLight);
        sunLight.shadow.mapSize.width = 4096;  // Increase width resolution
        sunLight.shadow.mapSize.height = 4096; // Increase height resolution

        // Configure the shadow camera to focus on the relevant area
        const size = 50;
        sunLight.shadow.camera.top = size;
        sunLight.shadow.camera.bottom = -size;
        sunLight.shadow.camera.left = -size;
        sunLight.shadow.camera.right = size;
        sunLight.shadow.camera.near = 0.5;  // Near clipping plane
        sunLight.shadow.camera.far = size*3;   // Far clipping plane


        // Optionally, add ambient light to ensure basic visibility
        const ambientLight = new THREE.AmbientLight(0x5f8fff, 1.6);
        ambientLight.position.set(-5, 5, 5);

        ambientLight.target = target;
        this.stateManager.scene.add(ambientLight);
       loadModel(this.stateManager.scene).then((mixer) => {
            this.mixer = mixer;
            console.log("Character loaded with mixer:", mixer);
        })
        .catch((error) => {
            console.error("Failed to load character:", error);
        });
    }


    update() {
        // Pass controls to the character's update method
        this.character.update(this.controls.keysPressed, this.controls.lastKeyPressed, this.levelData.MapLayout,this.levelData.Mobs, this.levelData.Signs, this.levelData.Exits, this.levelData.Tools, this.controls.moveX, this.controls.moveZ, this.changeLevel, this.stateManager, this.levelData.Waters);
        if (this.mixer) {
            const deltaTime = clock.getDelta();
            this.mixer.update(deltaTime * 10);
        }
        if(this.character.characterMesh.position.y < -10){
            this.currentLevel--;
            this.changeLevel();
        }
        if(this.controls.keysPressed.r === true){
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

        

        // Additional game update logic...

        const cameraOffset = new THREE.Vector3(0, 10, 8); // Adjust to change angle and distance
        //this.stateManager.camera.position.copy(this.character.characterMesh.position).add(cameraOffset);
        //this.stateManager.camera.lookAt(this.character.characterMesh.position);
        this.stateManager.camera.position.copy(this.character.characterMesh.position).add(cameraOffset);
        this.stateManager.camera.lookAt(this.character.characterMesh.position);
    }

    exit() {
        console.log("Exiting Game State");
        this.controls.resetKeys(); // Reset keys when exiting the state
    }
}