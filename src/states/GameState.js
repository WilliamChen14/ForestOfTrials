// src/states/GameState.js
import { Controls } from '../Controls.js';
import { Character } from '../entities/Character.js';
import { LevelOne } from '../levels/LevelOne.js';
import { LevelTwo } from '../levels/LevelTwo.js';


import { StarterLevel } from '../levels/StarterLevel.js';

import * as THREE from 'three';

export class GameState {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.controls = new Controls();
        this.character = new Character(this.stateManager.scene);
        this.levelData = new StarterLevel(stateManager.scene);
        this.currentLevel = 0;

        this.changeLevel = this.changeLevel.bind(this);


         // Set up lights (adjust to your preference)
         const sunLight = new THREE.DirectionalLight( 0xffffff, 5);
         sunLight.castShadow = true; // default false
         sunLight.position.set(-5,4,5);
 
         const target = new THREE.Object3D(); // Create a target object
         target.position.set(0, 0, 0); // Set the target position, for example, the center of the scene
         this.stateManager.scene.add(target);
 
         // Set the light to point towards the target
         sunLight.target = target;
         
         this.stateManager.scene.add( sunLight );
 
         // Optionally, add ambient light to ensure basic visibility
         const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
         ambientLight.castShadow = true; // default false
         ambientLight.position.set(-5,5,5);
 
         ambientLight.target = target;
         this.stateManager.scene.add(ambientLight);
    }

    enter() {
        console.log("Entering Game State");

    }


    changeLevel() {
        // Step 1: Remove all level objects from scene
        this.currentLevel++;
        console.log(this.currentLevel);
        
        while (this.stateManager.scene.children.length > 0) {
            this.stateManager.scene.remove(this.stateManager.scene.children[0]);
        }
        this.levelData = [];
        
       
    
        // Step 2: Load the new level
        if(this.currentLevel == 1){
            this.levelData = LevelOne(this.stateManager.scene);
        }
        else if(this.currentLevel == 2){
            this.levelData = LevelTwo(this.stateManager.scene);
        }
        else if(this.currentLevel == 3){
            this.levelData = LevelOne(this.stateManager.scene);
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


        // Set up lights (adjust to your preference)
        const sunLight = new THREE.DirectionalLight( 0xffffff, 5);
        sunLight.castShadow = true; // default false
        sunLight.position.set(-5,4,5);

        const target = new THREE.Object3D(); // Create a target object
        target.position.set(0, 0, 0); // Set the target position, for example, the center of the scene
        this.stateManager.scene.add(target);

        // Set the light to point towards the target
        sunLight.target = target;
        
        this.stateManager.scene.add( sunLight );

        // Optionally, add ambient light to ensure basic visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
        ambientLight.castShadow = true; // default false
        ambientLight.position.set(-5,5,5);

        ambientLight.target = target;
        this.stateManager.scene.add(ambientLight);
    
        console.log("Level changed successfully.");
        
    }

    update() {
        // Pass controls to the character's update method
        this.character.update(this.controls.keysPressed, this.controls.lastKeyPressed, this.levelData.MapLayout,this.levelData.Mobs, this.levelData.Signs, this.levelData.Exit, this.controls.moveX, this.controls.moveZ, this.changeLevel, this.stateManager);

        

        // Additional game update logic...

        const cameraOffset = new THREE.Vector3(0, 10, 8); // Adjust to change angle and distance
        this.stateManager.camera.position.copy(this.character.characterMesh.position).add(cameraOffset);
        this.stateManager.camera.lookAt(this.character.characterMesh.position);
    }

    exit() {
        console.log("Exiting Game State");
        this.controls.resetKeys(); // Reset keys when exiting the state
    }
}