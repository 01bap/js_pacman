import { GAME_FIELD_TYPES } from "./game.js";

// Aufzählung aller möglichen Items, die auf dem Spielfeld spawnen können (kann weiter ausgeführt werden)
export var OVERLAY_ITEM = {
    "INVALID": -1,
    "NONE": 0,
    "COIN": 1,
    "POWERPELLETS": 2,          // Pallette, um Pacman in den eating Modus zu versetzen
    "SPECIALFRUIT": 3,          // Spezielle Frucht für extra Punkte (nicht implementiert)
}

export class GameOverlay {
    constructor(gameLayout){
        this.possibleOverlaySpawns = [];
        this.coins = new Map();         // Synchron mit possibleOverlaySpawns, aber nur für die Coins

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
    }

    /**
     * Gibt den Wert des eingesammelten Items zurück
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
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

    /**
     * Gibt den aktuellen Fortschritt des Levels an
     * @(kann benutzt werden, um zB die Schwierigkeit zu erhöhen oder Special Fruits zu spawnen)
     * @returns 
     */
    getProgress(){
        return this.coins.size / this.maxCoins;
    }

    /**
     * Schaut, ob alle Coins eingesammelt sind
     * @returns 
     */
    areAllCoinsCollected() {
        return this.coins.size == 0;
    }
}