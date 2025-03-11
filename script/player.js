
import { game } from "./main.js";

export class Player {
    constructor(pos_x, pos_y) {
        this._x = pos_x;
        this._y = pos_y;

        // UP; DOWN; LEFT; RIGHT; NONE;
        this._direction = "NONE";
    }

    move() {
        switch (this._direction) {
            case "NONE":
                break;

            case "UP":
                if (game.get_tile_value(this._x-1, this._y) == 'X') {break;}
                this._x -= 1;
                break;

            case "DOWN":
                if (game.get_tile_value(this._x+1, this._y) == 'X') {break;}
                this._x += 1;
                break;

            case "LEFT":
                if (game.get_tile_value(this._x, this._y-1) == 'X') {break;}
                this._y -= 1;
                break;

            case "RIGHT": 
                if (game.get_tile_value(this._x, this._y+1) == 'X') {break;}
                this._y += 1;
                break;
        }
    }
}