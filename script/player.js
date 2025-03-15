
import { shuffle_array, DIRECTIONS } from "./game.js";
import { game } from "./main.js";

export class Player {
    constructor(pos_x, pos_y) {
        this._x = pos_x;
        this._y = pos_y;
        this._eating_mode = false;

        // UP; DOWN; LEFT; RIGHT; NONE;
        this._direction = "NONE";
    }


    // gibt liste mit möglichen wegen zurück
    possible_direction() {
        let out = []
        console.log(this._x, this._y)
        let x = this._x
        let y = this._y

        if (game.get_tile_value(x-1, y) != 'X' && this._direction != "DOWN") {
            out.push("UP");
        } 
        if (game.get_tile_value(x+1, y) != 'X' && this._direction != "UP") {
            out.push("DOWN");
        } 
        if (game.get_tile_value(x, y-1) != 'X' && this._direction != "RIGHT") {
            out.push("LEFT");
        } 
        if (game.get_tile_value(x, y+1) != 'X' && this._direction != "LEFT") {
            out.push("RIGHT");
        }
        return out;
    }

    get_opposite_direction(){
        switch (this._direction) {
            case "NONE":
                return DIRECTIONS.NONE;
            case "UP":
                return DIRECTIONS.DOWN;
            case "DOWN":
                return DIRECTIONS.UP;
            case "LEFT":
                return DIRECTIONS.RIGHT;
            case "RIGHT":
                return DIRECTIONS.LEFT;
        }
    }


    go_back(){
        this._direction = this.get_opposite_direction();
        console.log("changed direction: ", this._direction);
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
                break;

            case "UP":
                this._x -= 1;
                break;

            case "DOWN":
                this._x += 1;
                break;

            case "LEFT":
                this._y -= 1;
                break;

            case "RIGHT": 
                this._y += 1;
                break;
        }
    }

    move_ghost() {
        if (this._direction == "NONE") {
            this._direction = this.possible_direction()[0];
        }
        let pos_dir = this.possible_direction();
        if (pos_dir.length > 1) {
            let rand_dir = shuffle_array(pos_dir)
            this._direction = rand_dir[0];
        } else {
            if(pos_dir.length == 0){
                // prevent dead end
                this.go_back();
            }else{
                this._direction = pos_dir[0];
            }
        }
        console.log(pos_dir)
        switch (this._direction) {
            case "NONE":
                break;

            case "UP":
                this._x -= 1;
                break;

            case "DOWN":
                this._x += 1;
                break;

            case "LEFT":
                this._y -= 1;
                break;

            case "RIGHT": 
                this._y += 1;
                break;

            default:
                console.warn("dead end");
                break;
        }
    }
}