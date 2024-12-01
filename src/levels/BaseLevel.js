import * as THREE from 'three';
import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { Box } from '../entities/Box.js';

export class BaseLevel {
    constructor(scene) {
        this.scene = scene;
        this.MapLayout = [];
        this.Mobs = [];
        this.Exits = [];
        this.Signs = [];
        this.Tools = [];
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

    addTree(x, y, z) {
        const tree = new Tree(this.scene, x, y, z);
        // Trees are added directly to the scene in the Tree constructor
        return tree;
    }

    addSign(x, y, z, message) {
        const sign = new Sign(this.scene, x, y, z, message);
        this.Signs.push(sign);
        return sign;
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

    addGrid(startX, endX, startZ, endZ, elementCallback) {
        for (let x = startX; x <= endX; x++) {
            for (let z = startZ; z <= endZ; z++) {
                elementCallback(x, z);
            }
        }
    }

    addWallsAndFloorsAroundGrid(startX, endX, startZ, endZ) {
        // Add walls around the perimeter
        for (let x = startX - 1; x <= endX + 1; x++) {
            this.addInvisWall(x, 1, startZ - 1);
            this.addInvisWall(x, 1, endZ + 1);
        }
        for (let z = startZ - 1; z <= endZ + 1; z++) {
            this.addInvisWall(startX - 1, 1, z);
            this.addInvisWall(endX + 1, 1, z);
        }

        // Add floor tiles within the perimeter
        for (let x = startX; x <= endX; x++) {
            for (let z = startZ; z <= endZ; z++) {
                this.addStoneFloor(x, 0, z);
            }
        }
    }

    getLevelData() {
        return {
            MapLayout: this.MapLayout,
            Mobs: this.Mobs,
            Signs: this.Signs,
            Exits: this.Exits,
            Tools: this.Tools
        };
    }
}