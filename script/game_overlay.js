import { GAME_FIELD_TYPES } from "./game.js";

// Enum for further implementation of special fruits to pick up
export var OVERLAY_ITEM = {
    "INVALID": -1,
    "NONE": 0,
    "COIN": 1,
    "POWERPELLETS": 2,          // pellet so that pacman can eat ghosts
    "SPECIALFRUIT": 3,          // fruit to get more points if implemented
}

export class GameOverlay {
    constructor(gameLayout){
        this.possibleOverlaySpawns = [];
        this.coins = new Map();         // sync version of spawn points just for coins

        for (let i = 0; i < gameLayout.length; i++) {
            this.possibleOverlaySpawns[i] = [];
            for (let j = 0; j < gameLayout[0].length; j++) {
                switch(gameLayout[i][j]){
                    case GAME_FIELD_TYPES.WAY:
                        if (Math.floor(Math.random() * 100) % 50 == 0){
                            this.coins.set(i + ":" + j, OVERLAY_ITEM.POWERPELLETS);
                            this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.POWERPELLETS;
                        } else {
                            this.coins.set(i + ":" + j, OVERLAY_ITEM.COIN);
                            this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.COIN;
                        }
                        break;

                    case GAME_FIELD_TYPES.GHOST:
                        this.coins.set(i + ":" + j, OVERLAY_ITEM.COIN);
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.COIN;
                        break;

                    case GAME_FIELD_TYPES.WALL:
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.INVALID;
                        break;
                        
                    default:
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.NONE;
                        break;
                }
            }
        }
        this.maxCoins = this.coins.size;
        // console.log(this.possibleOverlaySpawns);
    }

    // returns the collected points
    collectItem(x,y){
        let key = x + ":" + y;

        // implement special items

        if (!this.coins.has(key))
            return OVERLAY_ITEM.NONE;

        let points = this.coins.get(key);
        this.coins.delete(key);
        this.possibleOverlaySpawns[x][y] = OVERLAY_ITEM.NONE;
        return points;
    }

    getItem(x,y){
        return this.possibleOverlaySpawns[x][y];
    }

    getProgress(){
        return this.coins.size / this.maxCoins;
    }

    areAllCoinsCollected() {
        return this.coins.size == 0;
    }
}