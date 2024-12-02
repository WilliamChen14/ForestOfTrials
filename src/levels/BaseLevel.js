import * as THREE from 'three';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { Box } from '../entities/Box.js';
import { Fire } from '../entities/Fire.js';
import { Water } from '../entities/Water.js';
import { DirtFloor } from '../entities/DirtFloor.js';
import { Fireplace } from '../entities/Fireplace.js';
import { Rocks } from '../entities/Rocks.js';

export class BaseLevel {
    constructor(scene) {
        this.scene = scene;
        this.MapLayout = [];
        this.Mobs = [];
        this.Exits = [];
        this.Signs = [];
        this.Tools = [];
        this.Hazards = []; // New array to track fire hazards
        this.Waters = [];
    }

    addInvisWall(x, y, z) {
        const invisWall = new InvisWall(this.scene, x, y, z);
        this.MapLayout.push(invisWall.MapLayoutMesh);
        return invisWall;
    }

    addStoneFloor(x, y, z) {
        const stoneFloor = new StoneFLoor(this.scene, x, y, z);
        this.MapLayout.push(stoneFloor.MapLayoutMesh);
        return stoneFloor;
    }
    addDirtFloor(x, y, z) {
        const dirtFloor = new DirtFloor(this.scene, x, y, z);
        this.MapLayout.push(dirtFloor.MapLayoutMesh);
        return dirtFloor;
    }

    addTree(x, y, z) {
        const tree = new Tree(this.scene, x, y, z);
        return tree;
    }

    async addSign(x, y, z, message) {
        const sign = new Sign(this.scene, x, y, z, message);
        await sign.init();
        this.Signs.push(sign);
        return sign;
    }

    async addFireplace(x, y, z) {
        const fireplace = new Fireplace(this.scene, x, y, z);
        await fireplace.init();
        return fireplace;
    }

    async addRocks(x, y, z, rotation) {
        const fireplace = new Rocks(this.scene, x, y, z, rotation);
        await fireplace.init();
        return fireplace;
    }

    addExit(x, y, z) {
        const exit = new Exit(this.scene, x, y, z);
        this.Exits.push(exit.MapLayoutMesh);
        return exit;
    }

    addBox(x, y, z) {
        const box = new Box(this.scene, x, y, z);
        this.Tools.push(box);
        this.MapLayout.push(box.MapLayoutMesh);
        return box;
    }

    addMob(MobClass, x, y, z) {
        const mob = new MobClass(this.scene, x, y, z);
        this.Mobs.push(mob);
        return mob;
    }

    addFire(x, y, z) {
        const fire = new Fire(this.scene, x, y, z);
        this.Hazards.push(fire);
        return fire;
    }

    addFireRing(centerX, centerY, centerZ, radius, count) {
        const angleStep = (2 * Math.PI) / count;
        for (let i = 0; i < count; i++) {
            const x = centerX + Math.cos(angleStep * i) * radius;
            const z = centerZ + Math.sin(angleStep * i) * radius;
            this.addFire(x, centerY, z);
        }
    }

    addFireWall(startX, startZ, endX, endZ, y = 1, spacing = 1) {
        const dx = endX - startX;
        const dz = endZ - startZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const count = Math.floor(distance / spacing);
        
        for (let i = 0; i <= count; i++) {
            const x = startX + (dx * i) / count;
            const z = startZ + (dz * i) / count;
            this.addFire(x, y, z);
        }
    }
    
    addWater(x, y, z){
        const water = new Water(this.scene, x, y, z);
        this.Waters.push(water);
        return water;
    }

    addGrid(startX, endX, startZ, endZ, elementCallback) {
        for (let x = startX; x <= endX; x++) {
            for (let z = startZ; z <= endZ; z++) {
                elementCallback(x, z);
            }
        }
    }

    addWallsAndFloorsAroundGrid(startX, endX, startZ, endZ) {
        // Add walls around the perimeter
        for (let x = startX; x <= endX; x++) {
            this.addInvisWall(x, 1, startZ);
            this.addInvisWall(x, 1, endZ);
        }
        for (let z = startZ; z <= endZ; z++) {
            this.addInvisWall(startX, 1, z);
            this.addInvisWall(endX, 1, z);
        }

        // Add floor tiles within the perimeter
        for (let x = startX; x <= endX; x++) {
            for (let z = startZ; z <= endZ; z++) {
                this.addDirtFloor(x, 0, z);
            }
        }
    }

    getLevelData() {
        return {
            MapLayout: this.MapLayout,
            Mobs: this.Mobs,
            Signs: this.Signs,
            Exits: this.Exits,
            Tools: this.Tools,
            Hazards: this.Hazards, // Include hazards in level data
            Waters: this.Waters
        };
    }

    update() {
        // Update all hazards (fires)
        this.Hazards.forEach(hazard => {
            if (hazard.update) {
                hazard.update();
            }
        });
    }
}