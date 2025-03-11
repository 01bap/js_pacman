
import { Game } from "./game.js";

const canvas = document.getElementById("game-grid")
const ctx = canvas.getContext("2d");


document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w": 
            console.log("W pressed")
            break;
        case "a": 
            console.log("A pressed")
            break;
        case "s": 
            console.log("S pressed")
            break;
        case "d": 
            console.log("D pressed")
            break;
    }
})


export let game = new Game(30, canvas, ctx)
game.draw_grid();
game.draw_pacman();
game.draw_ghosts();

