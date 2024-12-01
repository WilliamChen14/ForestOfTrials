// Level.js
import * as THREE from 'three';

import { Sign } from '../entities/Sign.js';
import { Slime } from '../entities/Slime.js';
import { StoneFLoor } from '../entities/StoneFloor.js';
import { Tree } from '../entities/Tree.js';
import { InvisWall } from '../entities/InvisWall.js';
import { Exit } from '../entities/Exit.js';
import { BossSlime } from '../entities/BossSlime.js';
import { Box } from '../entities/Box.js';
import { BaseLevel } from './BaseLevel.js';

export class LevelTwo extends BaseLevel {
    build() {
        const floorSize = 20;


        this.addWallsAndFloorsAroundGrid(-1, floorSize + 1, -1, floorSize + 1);
        for (let x = -1; x <= floorSize + 1; x++) {
            this.addTree(x, 1, -1);
            this.addTree(x, 1, floorSize + 1);
        }

        for (let z = -1; z <= floorSize + 1; z++) {
            this.addTree(-1, 1, z);
            this.addTree(floorSize + 1, 1, z);
        }

        this.addMob(BossSlime, 10, 1, 10);

        this.addBox(3, 1, 3);
        this.addBox(17, 1, 3);
        this.addBox(3, 1, 17);
        this.addBox(17, 1, 17);

        this.addExit(20, 1, 20);

        for (let x = -1; x < floorSize + 1; x++) {
            this.addInvisWall(x, 1, -1);
            this.addInvisWall(x, 1, floorSize + 1);
        }

        return this.getLevelData();
    }
}
