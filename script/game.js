
import { Player } from "./player.js";

const GAME_LAYOUT = [
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
    ['X', 'O', 'O', 'O', 'P', 'O', 'G', 'X'],
    ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'X'],
    ['X', 'G', 'O', 'O', 'O', 'O', 'O', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
];


export class Game {
    constructor(cell_size, canvas, ctx) {
        this._canvas = canvas;
        this._ctx = ctx;
        this._game_layout = GAME_LAYOUT;
        this._rows = GAME_LAYOUT.length;
        this._cols = GAME_LAYOUT[0].length;
        this._cell_size = cell_size;
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
            console.log("NONE!")
            return;
        }
        if (this._pacman.can_move()) {
            this._pacman.move();
        }

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
                        this._ctx.fillStyle = "#1e1e8e"; 
                        break;
                }
    
                let x = col * this._cell_size;
                let y = row * this._cell_size;
    
                this._ctx.fillRect(x, y, this._cell_size, this._cell_size);
                this._ctx.strokeRect(x, y, this._cell_size, this._cell_size);
            }
        }
    }


    get_tile_value(x, y) {
        return this._game_layout[x][y]
    }


    draw_pacman() {
        let pac_x = this._pacman._x
        let pac_y = this._pacman._y
        console.log(pac_x)
        console.log(pac_y)
        this._ctx.fillStyle = "#cece1e"; 
        this._ctx.fillRect(pac_y * this._cell_size, pac_x * this._cell_size, this._cell_size, this._cell_size);
    }


    draw_ghosts() {
        for (let i = 0; i < this._ghosts.length; i++) {
            let ghost_x = this._ghosts[i]._x;
            let ghost_y = this._ghosts[i]._y;
            this._ctx.fillStyle = "#ce1e1e"; 
            this._ctx.fillRect(ghost_y * this._cell_size, ghost_x * this._cell_size, this._cell_size, this._cell_size);
        }
    }
}
