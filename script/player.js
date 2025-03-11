
import { game } from "./main.js";

export class Player {
    constructor(pos_x, pos_y) {
        this._x = pos_x;
        this._y = pos_y;

        // UP; DOWN; LEFT; RIGHT; NONE;
        this._direction = "NONE";
    }

    can_move() {
        switch (this._direction) {
            case "NONE":
                break;

            case "UP":
                if (game.get_tile_value(this._x-1, this._y) == 'X') {return false;}
                break;

            case "DOWN":
                if (game.get_tile_value(this._x+1, this._y) == 'X') {return false;}
                break;

            case "LEFT":
                if (game.get_tile_value(this._x, this._y-1) == 'X') {return false;}
                break;

            case "RIGHT": 
                if (game.get_tile_value(this._x, this._y+1) == 'X') {return false;}
                break;
        }

        return true;
    }


    move() {
        switch (this._direction) {
            case "NONE":
                console.log("none")
                break;

            case "UP":
                console.log("up")
                this._x -= 1;
                break;

            case "DOWN":
                console.log("down")
                this._x += 1;
                break;

            case "LEFT":
                console.log("left")
                this._y -= 1;
                break;

            case "RIGHT": 
                console.log("right")
                this._y += 1;
                break;
        }
    }
}