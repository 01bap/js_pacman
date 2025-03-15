
import { Game, DIRECTIONS } from "./game.js";

const canvas = document.getElementById("game-grid");
const ctx = canvas.getContext("2d");

export let game = new Game(30, canvas, ctx)

function game_loop() {
    if(!game._game_is_running)
        return;
    game.step();
    game.draw_grid();
    game.draw_overlay();
    game.draw_pacman();
    game.draw_ghosts();
    game.draw_grid_lines();
    game.update_scoreboard();
}


document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
        case "ArrowUp": 
            game.set_pacman_direction(DIRECTIONS.UP)
            break;
        case "a":
        case "ArrowLeft": 
            game.set_pacman_direction(DIRECTIONS.LEFT)
            break;
        case "s":
        case "ArrowDown": 
            game.set_pacman_direction(DIRECTIONS.DOWN)
            break;
        case "d":
        case "ArrowRight": 
            game.set_pacman_direction(DIRECTIONS.RIGHT)
            break;
        case " ":
            game.set_pacman_direction(DIRECTIONS.NONE)
            break;
    }
})


setInterval(game_loop, 1000);
