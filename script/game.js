
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

        canvas.width = this._cols * this._cell_size;
        canvas.height = this._rows * this._cell_size;
    }


    draw_grid() {
        this._ctx.strokeStyle = "black";
        
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let grid_value = this._game_layout[row][col]; 
                console.log(grid_value)
                switch (grid_value) {
                    case 'X':
                        this._ctx.fillStyle = "#1e1e1e"; 
                        break;
                    case 'O':
                        this._ctx.fillStyle = "#1e1e8e"; 
                        break;
                    case 'P':
                        this._ctx.fillStyle = "#cece1e"; 
                        break;
                    case 'G': 
                        this._ctx.fillStyle = "#ce1e1e";
                        break;
                }
    
                let x = col * this._cell_size;
                let y = row * this._cell_size;
    
                this._ctx.fillRect(x, y, this._cell_size, this._cell_size);
                this._ctx.strokeRect(x, y, this._cell_size, this._cell_size);
            }
        }
    }


    draw_pacman(x, y) {
        this._ctx.fillStyle = "yellow";
        this._ctx.fillRect(x * this._cell_size, y * this._cell_size, this._cell_size, this._cell_size);
    }
}
