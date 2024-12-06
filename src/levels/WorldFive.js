import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { Slime } from '../entities/Slime.js';
import { BigSlime } from '../entities/BigSlime.js';
import { Ghost } from '../entities/Ghost.js';
import { Box } from '../entities/Box.js';
import { BossSlime } from '../entities/BossSlime.js';

export class WorldFive extends BaseLevel {
    async build() {
        // Start the player at a safe position
        await this.addSign(1, 1, 1, "Welcome to Level 3!\nUse planks to cross the lava pools and watch out for the fire rings!");
        
        // Create starting platform with volcanic theme (slightly smaller than before for better performance)
        for (let x = -8; x <= 8; x++) {
            for (let z = -8; z <= 8; z++) {
                // Create pattern suggesting hot/cold zones
                if (Math.abs(x) + Math.abs(z) < 8) {
                    this.addStoneFloor(x, 0, z);  // Inner "hot" zone
                } else {
                    this.addDirtFloor(x, 0, z);   // Outer "cool" zone
                }
            }
        }

        // Add decorative elements in starting area - reduced number for performance
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const x = Math.cos(angle) * 6;
            const z = Math.sin(angle) * 6;
            await this.addFireplace(x, 1, z);
            // Only add rocks at alternating positions
            if (i % 2 === 0) {
                await this.addRocks(x + 1, 1, z + 1, angle);
            }
        }

        // Add fire ring in center - reduced number of fires
        this.addFireRing(0, 1, 0, 3, 4);

        // Create boundary walls and decoration
        for (let x = -8; x <= 8; x++) {
            this.addInvisWall(x, 1, 8);
            this.addInvisWall(x, 1, -8);
            // Add trees at intervals instead of every position
            if (x % 2 === 0) {
                this.addTree(x, 1, 8);
                this.addTree(x, 1, -8);
            }
        }
        
        for (let z = -8; z <= 8; z++) {
            this.addInvisWall(-8, 1, z);
            this.addInvisWall(8, 1, z);
            // Add trees at intervals
            if (z % 2 === 0) {
                this.addTree(-8, 1, z);
                this.addTree(8, 1, z);
            }
        }

        // Create lava challenge section - optimized spacing
        const lavaStart = 9;
        const lavaWidth = 16; // Reduced from 20
        
        // Create platforms over lava
        
        
        for (let x = lavaStart; x < lavaStart + lavaWidth; x += 4) {
            // Create safe platforms
            this.addStoneFloor(x, 0, 0);
            this.addStoneFloor(x, 0, 1);
            
            // Add lava pools between platforms - reduced area
            for (let z = -3; z <= 4; z++) {
                if (z !== 0 && z !== 1) {
                    
                    //this.addLava(x, 0, z);
                    //this.addLava(x + 1, 0, z);
                    this.addLava(x + 2, 0, z);
                    
                }
            }
            
            // Add planks for crossing
            if (x < lavaStart + lavaWidth - 4) {
                this.addPlank(x + 1, 1, 0);
            }
            
            // Add ghosts as obstacles - reduced number
            if (x % 8 === 0) {
                this.addMob(Ghost, x + 2, 2, -2);
            }
        }
            
        

        // Create combat arena after lava section
        const arenaStart = lavaStart + lavaWidth;
        const arenaSize = 12; // Reduced from 15
        
        // Create elevated arena platform
        for (let x = arenaStart; x < arenaStart + arenaSize; x++) {
            for (let z = -6; z <= 6; z++) {
                if ((x + z) % 2 === 0) {
                    this.addStoneFloor(x, 0, z);
                } else {
                    this.addDirtFloor(x, 0, z);
                }
            }
        }
            

        // Add decorative fire rings - reduced number of fires
        this.addFireRing(arenaStart + arenaSize/2, 1, 0, 4, 6);
        this.addFireRing(arenaStart + arenaSize/2, 1, 0, 2, 4);

        // Add rock formations in corners - reduced to two
        await this.addRocks(arenaStart + 2, 1, -5, Math.PI/4);
        await this.addRocks(arenaStart + arenaSize - 2, 1, 5, -Math.PI/2);

        // Add enemies in arena - balanced number
        this.addMob(BigSlime, arenaStart + 5, 1, -3);
        this.addMob(Ghost, arenaStart + 8, 1, -4);
        this.addMob(Slime, arenaStart + 10, 1, 2);

        // Add final boss
        this.addMob(BigSlime, arenaStart + arenaSize/2, 1, 0);

        // Add walls around arena with optimized decorations
        for (let x = arenaStart; x < arenaStart + arenaSize; x++) {
            this.addInvisWall(x, 1, -6);
            this.addInvisWall(x, 1, 6);
            if (x % 3 === 0) {  // Reduced frequency of decorations
                await this.addFireplace(x, 1, -6);
                await this.addFireplace(x, 1, 6);
            }
        }
            

        // Add exit behind boss arena
        this.addExit(arenaStart + arenaSize - 1, 1, 0);
        

        return this.getLevelData();
    }
}