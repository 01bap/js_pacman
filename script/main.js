
import { Game } from "./game.js";

const canvas = document.getElementById("game-grid")
const ctx = canvas.getContext("2d");

export let game = new Game(30, canvas, ctx)

function game_loop() {
    game.step();
    game.draw_grid();
    game.draw_ghosts();
    game.draw_pacman();
    game.draw_grid_lines();
}


document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w": 
            game.set_pacman_direction("UP")
            console.log("w")
            break;
        case "a": 
            game.set_pacman_direction("LEFT")
            console.log("a")
            break;
        case "s": 
            game.set_pacman_direction("DOWN")
            console.log("d")
            break;
        case "d": 
            game.set_pacman_direction("RIGHT")
            console.log("d")
            break;
        case " ":
            game.set_pacman_direction("NONE")
            break;
    }
})


setInterval(game_loop, 1000);
