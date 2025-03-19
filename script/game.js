
import { Player } from "./player.js";
import { GameOverlay, OVERLAY_ITEM } from "./game_overlay.js";

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
export var GAME_FIELD_TYPES = {
    "WAY": "O",
    "WALL": "X",
    "GHOST": "G",
    "PACMAN": "P",
    "NONE": "-",
}
export var DIRECTIONS = {
    "NONE": "NONE",
    "UP": "UP",
    "RIGHT": "RIGHT",
    "DOWN": "DOWN",
    "LEFT": "LEFT",
}


// Copy Paste Code (funktioniert hoffentlich richtig)
export function shuffle_array(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
export function create_random_gamefield(rows, cols) {
    // 2 rows and cols for the border and at least 7 cells of actual gamefield
    if (rows == null || cols == null || rows < 9 || cols < 9)
        return GAME_LAYOUT;

    const horizontalBorder = new Array(cols).fill(GAME_FIELD_TYPES.WALL, 0, cols);
    let gamefield = [];
    gamefield.push(horizontalBorder);
    gamefield.push([GAME_FIELD_TYPES.WALL].concat(random_first_row(cols - 2), [GAME_FIELD_TYPES.WALL]));


    let gamefieldRow = [];
    for (let row = 1; row < rows - 1; row++) {

    }

    
    gamefield.push(horizontalBorder);
    // spawning/inserting here
    console.log("ACTUAL FIELD:",gamefield,"\n");
    return GAME_LAYOUT;
}
/* For later implementation and spawning:
 * 
 * 3 x 3 aria in the middle of the gamefield
 * -> spawns pacman in there
 * 
 * ghosts spawn on any way but not in the middle aria
 * 
 * fill everything with none and hollow the middle aria
 */
function random_first_row(cols) {
    if (cols < 7)
        throw "Cant be called with cols less than 7!";

    let random_row = new Array(3).fill(GAME_FIELD_TYPES.WAY, 0, 3);
    for (let col = 3; col < cols - 3; col++) {
        if(!random_row.slice(-3).includes(GAME_FIELD_TYPES.WALL)){
            if(Math.floor(Math.random() * 100) % 2 == 0){
                random_row.push(GAME_FIELD_TYPES.WALL);
            } else {
                random_row.push(GAME_FIELD_TYPES.WAY);
            }
        } else {
            random_row.push(GAME_FIELD_TYPES.WAY);
        }
    }
    random_row = random_row.concat(new Array(3).fill(GAME_FIELD_TYPES.WAY, 0, 3));
    return random_row;
}

export class Game {
    constructor(cell_size, canvas, ctx, rows, cols) {
        this._game_is_running = true;
        this._game_succes = false;
        this._item_size = cell_size * 0.4;
        this._canvas = canvas;
        this._ctx = ctx;
        this._game_layout = create_random_gamefield(rows, cols);
        this._rows = this._game_layout.length;      //rows;
        this._cols = this._game_layout[0].length;       //cols;
        this._cell_size = cell_size;
        this._coin_layout = new GameOverlay(this._game_layout);
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
        this.interval_checking();
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


    win_detaction(pacman, ghost, old_pos) {
        this.collision_detection(pacman, ghost, old_pos);
        if (this._coin_layout.areAllCoinsCollected())
            this.end_game(true);
    }

    collision_detection(pacman, ghost, old_pos) {
        // if pacman and ghost are on the same field or if pacman went through ghost
        if (ghost._x == pacman._x && ghost._y == pacman._y || (pacman._x == old_pos[0] && pacman._y == old_pos[1] && pacman._direction == ghost.get_opposite_direction())) {
            if (!pacman._eating_mode) {
                this.end_game(false);
            } else {
                // this._game_layout[ghost._x][ghost._y] = GAME_FIELD_TYPES.WAY;
                ghost._x = -1;
                ghost._y = -1;
                ghost.set_spawn_timer();
            }
        }
    }

    end_game(successs) {
        this._game_is_running = false;
        this._game_succes = successs;
    }
    game_over() {
        if (this._game_is_running)
            return null;
        if (this._game_succes) {
            alert("You won!");
        } else {
            alert("You lost! Try again");
        }
        // reset
        // window.location.reload();
        return new Game(30, this._canvas, this._ctx);
    }


    get_possible_spawn_points() {
        let possible_spawn_fields = [];
        this._game_layout.forEach((field_row, row) => {
            field_row.forEach((field, col) => {
                if (field == GAME_FIELD_TYPES.WAY)
                    possible_spawn_fields.push([row, col]);
            });
        });
        return possible_spawn_fields;
    }

    spawn_ghost() {
        let spawn_fields = this.get_possible_spawn_points();
        // filters possible spawn points that are in the same row or column (prevents ghost from spawning directly in front of pacman)
        spawn_fields = spawn_fields.filter((spawn_point_pos) => spawn_point_pos[0] != this._pacman._x && spawn_point_pos[1] != this._pacman._y);
        spawn_fields = shuffle_array(spawn_fields);
        if (spawn_fields.length > 0) {
            return spawn_fields[0];
        } else {
            console.warn("No correct spawn location found!");
            return [1, 1];
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
                        this._ctx.fillStyle = "#4e4eae";
                        break;
                }

                let x = col * this._cell_size;
                let y = row * this._cell_size;

                this._ctx.fillRect(x, y, this._cell_size, this._cell_size);
                this._ctx.strokeRect(x, y, this._cell_size, this._cell_size);
            }
        }
    }

    draw_overlay() {
        this._ctx.strokeStyle = "black";

        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let fieldItem = this._coin_layout.getItem(row, col);
                switch (fieldItem) {
                    case OVERLAY_ITEM.NONE:
                    case OVERLAY_ITEM.INVALID:
                        continue;
                    case OVERLAY_ITEM.COIN:
                        this._ctx.fillStyle = "white";
                        break;
                    case OVERLAY_ITEM.POWERPELLETS:
                        this._ctx.fillStyle = "yellow";
                        break;
                    case OVERLAY_ITEM.SPECIALFRUIT:
                        this._ctx.fillStyle = "pink";
                        break;
                    default:
                        console.warn("fieldItem not implemented:", fieldItem);
                        continue;
                }

                let x = col * this._cell_size;
                let y = row * this._cell_size;

                if (fieldItem == OVERLAY_ITEM.POWERPELLETS) {
                    this._ctx.fillRect(x + this._cell_size * 0.2, y + this._cell_size * 0.2, this._cell_size * 0.6, this._cell_size * 0.6);
                } else {
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
            if (this._pacman._eating_mode) {
                this._ctx.fillStyle = "blue";
            } else {
                this._ctx.fillStyle = "#ce1e1e";
            }
            this._ctx.fillRect(ghost_y * this._cell_size, ghost_x * this._cell_size, this._cell_size, this._cell_size);
        }
    }

    update_scoreboard() {
        let scoreDisplay = document.getElementById("Score");
        scoreDisplay.innerText = this._pacman._points;
    }

    interval_checking() {
        this._pacman.decrement_eating_timer();
        this._ghosts.forEach((ghost) => {
            if (ghost.decrement_spawn_timer()) {
                let pos = this.spawn_ghost();
                ghost._x = pos[0];
                ghost._y = pos[1];
            }
        });
    }
}
