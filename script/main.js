
import { Game, DIRECTIONS } from "./game.js";

const canvas = document.getElementById("game-grid");
const ctx = canvas.getContext("2d");
let enable_arrow_movment = false;
export var game_rows = 14;
export var game_cols = 13;
var game_velocity = 400;
export var game_cell_size = 30;
var game_interval = null;

export let game = new Game(game_cell_size, canvas, ctx,game_rows,game_cols);

function game_loop() {
    game.step();
    game.draw_grid();
    game.draw_overlay();
    game.draw_pacman();
    game.draw_ghosts();
    game.draw_grid_lines();
    game.update_scoreboard();
    
    if(!game._game_is_running){
        show_settings();
        return;
    }
    hide_settings();
    setTimeout(() => {
        let new_game = game.game_over();
        if (new_game != null) {
            game = new_game;
            enable_arrow_movment = false;
        }
    }, game_velocity);
}


document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": 
            if(!enable_arrow_movment)
                break;
        case "w":
        case "W":
            game.set_pacman_direction(DIRECTIONS.UP)
            break;
        case "ArrowLeft": 
            if(!enable_arrow_movment)
                break;
        case "a":
        case "A":
            game.set_pacman_direction(DIRECTIONS.LEFT)
            break;
        case "ArrowDown": 
            if(!enable_arrow_movment)
                break;
        case "s":
        case "S":
            game.set_pacman_direction(DIRECTIONS.DOWN)
            break;
        case "ArrowRight": 
            if(!enable_arrow_movment)
                break;
        case "d":
        case "D":
            game.set_pacman_direction(DIRECTIONS.RIGHT)
            break;
        case "t":
        case "T":
            enable_arrow_movment = !enable_arrow_movment;
            if(enable_arrow_movment) {
                hide_settings();
            } else {
                show_settings();
            }
            break;
        default:
            // game.set_pacman_direction(DIRECTIONS.NONE);
            break;
    }
})

// html elements
const settings_view = document.getElementById("Settings");
const game_velocity_slider = document.getElementById("game_velocity");
const game_velocity_display = document.getElementById("game_velocity_display");
const game_row_slider = document.getElementById("game_rows");
const game_row_display = document.getElementById("game_rows_display");
const game_col_slider = document.getElementById("game_cols");
const game_col_display = document.getElementById("game_cols_display");
const game_square_only_checkbox = document.getElementById("game_size_squared");

// setting eventlistener
game_velocity_slider.addEventListener("change", () => update_game_velocity());
game_row_slider.addEventListener("change", () => update_game_rows());
game_col_slider.addEventListener("change", () => update_game_cols());
game_square_only_checkbox.addEventListener("change", () => update_game_size());

// game_velocity
function update_game_velocity() {
    if(game._game_is_running) {
        game_velocity_display.innerHTML = "x" + game_velocity_slider.value;
        return;
    }
    game_velocity = parseInt(game_velocity_slider.value * 1000);
    console.log("Set game velocity to:", game_velocity,"s");
    game_velocity_display.innerHTML = "x" + game_velocity_slider.value;
    if(game_interval != null) {
        clearInterval(game_interval);
    }
    game_interval = setInterval(game_loop, game_velocity);
}
// game_rows
function update_game_rows() {
    if(game._game_is_running) {
        game_row_display.innerHTML = game_row_slider.value;
        return;
    }
    game_rows = parseInt(game_row_slider.value);
    if(game_square_only_checkbox.checked){
        game_cols = game_rows;
        console.log("Set square size to:", game_rows);
        game_col_display.innerHTML = game_row_slider.value;
    } else {
        console.log("Set game rows to:", game_rows);
    }
    game_row_display.innerHTML = game_row_slider.value;
    game = new Game(game_cell_size, canvas, ctx,game_rows,game_cols)
}
// game_cols
function update_game_cols() {
    if(game._game_is_running) {
        game_col_display.innerHTML = game_col_slider.value;
        return;
    }
    if(!game_square_only_checkbox.checked) {
        game_cols = parseInt(game_col_slider.value);
    }
    console.log("Set game cols to:", game_cols);
    game_col_display.innerHTML = game_cols;
    game = new Game(game_cell_size, canvas, ctx,game_rows,game_cols)
}
// game_size
function update_game_size() {
    if(game_square_only_checkbox.checked) {
        game_col_slider.disabled = true;
        game_cols = game_rows;
        update_game_cols();
    } else {
        game_col_slider.disabled = false;
        update_game_cols();
    }
}
// setting panel
function show_settings() {
    if(settings_view.style.display == "" || settings_view.style.visibility == "flex" || (!game._game_is_running && enable_arrow_movment)){
        return;
    }
    enable_arrow_movment = false;
    settings_view.style.display = "flex";
}
function hide_settings() {
    if(settings_view.style.visibility == "none"){
        return;
    }
    enable_arrow_movment = true;
    settings_view.style.display = "none";
}

// init
update_game_velocity();