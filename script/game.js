
import { Player } from "./player.js";

//const GAME_LAYOUT = [
//    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
//    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'P', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
//    ['X', 'O', 'G', 'O', 'O', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'X'],
//    ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'X'],
//    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
//];

const GAME_LAYOUT = [
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'G', 'O', 'O', 'X', 'O', 'O', 'O', 'X', 'O', 'O', 'G', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'X', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O', 'P', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'],
    ['X', 'G', 'O', 'O', 'X', 'O', 'O', 'O', 'X', 'O', 'O', 'G', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
];

export var DIRECTIONS_NUM = {
    "NONE": 0,
    "UP": 1,
    "RIGHT": 2,
    "DOWN": 3,
    "LEFT": 4,
}
export var DIRECTIONS = {
    "NONE": "NONE",
    "UP": "UP",
    "RIGHT": "RIGHT",
    "DOWN": "DOWN",
    "LEFT": "LEFT",
}

// Enum for further implementation of special fruits to pick up
export var OVERLAY_ITEM = {
    "INVALID": -1,
    "NONE": 0,
    "COIN": 1,
    "POWERPELLETS": 2,          // pellet so that pacman can eat ghosts
    "SPECIALFRUIT": 3,          // fruit to get more points if implemented
}
class GameOverlay {
    constructor(gameLayout){
        this.possibleOverlaySpawns = [];
        this.coins = new Map();         // sync version of spawn points just for coins

        for (let i = 0; i < gameLayout.length; i++) {
            this.possibleOverlaySpawns[i] = [];
            for (let j = 0; j < gameLayout[0].length; j++) {
                switch(gameLayout[i][j]){
                    case "O":
                        this.coins.set(i + ":" + j, OVERLAY_ITEM.COIN);
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.COIN;
                        break;

                    case "G":
                        this.coins.set(i + ":" + j, OVERLAY_ITEM.COIN);
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.COIN;
                        break;

                    case "P":
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.NONE;
                        break;

                    case "X":
                        this.possibleOverlaySpawns[i][j] = OVERLAY_ITEM.INVALID;
                        break;
                }
            }
        }
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
        let key = x + ":" + y;
        if(!this.coins.has(key))
            return OVERLAY_ITEM.NONE;

        // implement here return of special items

        return this.coins.get(key);
    }

    areAllCoinsCollected() {
        return this.coins.size == 0;
    }
}

// Copy Paste Code (funktioniert hoffentlich richtig)
export function shuffle_array(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


export class Game {
    constructor(cell_size, canvas, ctx) {
        this._game_is_running = true;
        this._item_size = cell_size * 0.4;
        this._canvas = canvas;
        this._ctx = ctx;
        this._game_layout = GAME_LAYOUT;
        this._rows = GAME_LAYOUT.length;
        this._cols = GAME_LAYOUT[0].length;
        this._cell_size = cell_size;
        this._coin_layout = new GameOverlay(this._game_layout);
        console.log(this._coin_layout);
        this._ghosts = []

        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let grid_value = this._game_layout[row][col]; 
                if (grid_value == 'P') {
                    this._pacman = new Player(row, col);
                } else if (grid_value == 'G') {
                    this._ghosts.push(new Player(row, col));
                }
            }
        }

        canvas.width = this._cols * this._cell_size;
        canvas.height = this._rows * this._cell_size;
    }


    set_pacman_direction(direction) {
        this._pacman._direction = direction;
    }


    step() {
        if (this._pacman._direction == "NONE") {
            return;
        }
        if (this._pacman.can_move()) {
            this._pacman.move();
        }

        for (let i = 0; i < this._ghosts.length; i++) {
            // console.log("Move ghost", i);
            // store old position for collision_detection
            let old_pos = [this._ghosts[i]._x, this._ghosts[i]._y];
            this._ghosts[i].move_ghost();

            this.win_detaction(this._pacman, this._ghosts[i], old_pos);
        }
    }

    win_detaction(pacman, ghost, old_pos){
        this.collision_detection(pacman, ghost, old_pos);
        if(this._coin_layout.areAllCoinsCollected())
            this.game_over(true);
    }

    collision_detection(pacman, ghost, old_pos) {
        // if pacman and ghost are on the same field or if pacman went through ghost
        if (ghost._x == pacman._x && ghost._y == pacman._y || (pacman._x == old_pos[0] && pacman._y == old_pos[1] && pacman._direction == ghost.get_opposite_direction())) {
            if (!pacman._eating_mode){
                this.game_over(false);
            }
        }
    }

    game_over(win){
        if(!this._game_is_running)
            return;
        this._game_is_running = false;
        if(win){
            alert("You won!");
        } else {
            alert("You lost! Try again");
        }
        window.location.reload();
    }

    draw_grid() {
        this._ctx.strokeStyle = "black";
        
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let grid_value = this._game_layout[row][col]; 
                switch (grid_value) {
                    case 'X':
                        this._ctx.fillStyle = "#1e1e1e"; 
                        break;
                    default:
                        this._ctx.fillStyle = "#4e4eae"; 
                        break;
                }
    
                let x = col * this._cell_size;
                let y = row * this._cell_size;
    
                this._ctx.fillRect(x, y, this._cell_size, this._cell_size);
                this._ctx.strokeRect(x, y, this._cell_size, this._cell_size);

                // this.draw_overlay(row,col);
            }
        }
    }

    draw_overlay() {
        this._ctx.strokeStyle = "black";

        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let fieldItem = this._coin_layout.getItem(row,col);
                switch (fieldItem) {
                    case OVERLAY_ITEM.NONE:
                    case OVERLAY_ITEM.INVALID:
                        continue;
                    case OVERLAY_ITEM.COIN:
                        this._ctx.fillStyle = "white"; 
                        break;
                    case OVERLAY_ITEM.POWERPELLETS:
                        this._ctx.fillStyle = "pink";
                        break;
                    case OVERLAY_ITEM.SPECIALFRUIT:
                        this._ctx.fillStyle = "black";
                        break;
                    default:
                        console.warn("fieldItem not implemented:",fieldItem);
                        continue;
                }

                let x = col * this._cell_size;
                let y = row * this._cell_size;

                this._ctx.beginPath();
                this._ctx.arc(
                    x + this._cell_size * 0.5, y + this._cell_size * 0.5,
                    this._item_size * 0.5,
                    0, 2 * Math.PI
                )
                this._ctx.fill();
                this._ctx.stroke();
            }
        }
    }

    draw_grid_lines() {
        this._ctx.strokeStyle = "black";
        
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let grid_value = this._game_layout[row][col]; 
                switch (grid_value) {
                    case 'X':
                        this._ctx.fillStyle = "#1e1e1e"; 
                        break;
                    default:
                        this._ctx.fillStyle = "#4e4eae"; 
                        break;
                }
    
                let x = col * this._cell_size;
                let y = row * this._cell_size;
    
                this._ctx.strokeRect(x, y, this._cell_size, this._cell_size);
            }
        }
    }


    get_tile_value(x, y) {
        //if (x > this._game_layout.length || y > this._game_layout[0].length) {
        if (x < 1 || y < 1 || x >= this._game_layout.length || y >= this._game_layout[0].length) {
            return "X"
        }
        return this._game_layout[x][y]
    }


    draw_pacman() {
        let pac_x = this._pacman._x
        let pac_y = this._pacman._y
        this._ctx.fillStyle = "#cece1e"; 
        this._ctx.fillRect(pac_y * this._cell_size, pac_x * this._cell_size, this._cell_size, this._cell_size);
    }


    draw_ghosts() {
        for (let i = 0; i < this._ghosts.length; i++) {
            let ghost_x = this._ghosts[i]._x;
            let ghost_y = this._ghosts[i]._y;
            if(this._pacman._eating_mode){
                this._ctx.fillStyle = "blue"; 
            } else {
                this._ctx.fillStyle = "#ce1e1e"; 
            }
            this._ctx.fillRect(ghost_y * this._cell_size, ghost_x * this._cell_size, this._cell_size, this._cell_size);
        }
    }

    update_scoreboard(){
        let scoreDisplay = document.getElementById("Score");
        scoreDisplay.innerText = this._pacman._points;
    }
}
