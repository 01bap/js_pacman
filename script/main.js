
import { Game, DIRECTIONS } from "./game.js";

const canvas = document.getElementById("game-grid")
const ctx = canvas.getContext("2d");

export let game = new Game(30, canvas, ctx)

function game_loop() {
    game.step();
    game.draw_grid();
    game.draw_pacman();
    game.draw_ghosts();
    game.draw_grid_lines();
}


document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w": 
            game.set_pacman_direction(DIRECTIONS.UP)
            console.log("w")
            break;
        case "a": 
            game.set_pacman_direction(DIRECTIONS.LEFT)
            console.log("a")
            break;
        case "s": 
            game.set_pacman_direction(DIRECTIONS.DOWN)
            console.log("s")
            break;
        case "d": 
            game.set_pacman_direction(DIRECTIONS.RIGHT)
            console.log("d")
            break;
        case " ":
            game.set_pacman_direction(DIRECTIONS.NONE)
            break;
    }
})


setInterval(game_loop, 1000);
