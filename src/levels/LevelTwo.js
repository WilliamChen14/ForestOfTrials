// Level.js
import * as THREE from 'three';

import { loadModel } from '../Models.js';
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

        this.addMob(BossSlime, 10, 1, 10);

        this.addBox(3, 1, 3);
        this.addBox(17, 1, 3);
        this.addBox(3, 1, 17);
        this.addBox(17, 1, 17);

        this.addExit(19, 1, 19);

        for (let x = -1; x < floorSize + 1; x++) {
            this.addInvisWall(x, 1, -1);
            this.addInvisWall(x, 1, floorSize);
        }

        return this.getLevelData();
    }
}