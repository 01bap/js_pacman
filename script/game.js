
import { Player } from "./player.js";
import { GameOverlay, OVERLAY_ITEM } from "./game_overlay.js";
import { game_cell_size, game_rows, game_cols } from "./main.js";

// Default Spielfeld
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
    "HIGHLIGHTED_WALL": "x",
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
/**
 * Erstellt ein zufälliges Spielfeld von oben nach unten (Zeile um Zeile)
 * @param {number} rows 
 * @param {number} cols 
 * @returns 
 */
export function create_random_gamefield(rows, cols) {
    // 2 Zeilen und Spalten für den Rand und mindestens 7 Felder für das eigentliche Spielfeld
    if (rows == null || cols == null || rows < 9 || cols < 9)
        return GAME_LAYOUT;

    const CENTER_POINT = [Math.floor(rows/2), Math.floor(cols/2)];
    let gamefield = make_bare_bone_gamefield(rows,cols,CENTER_POINT);
    gamefield = fill_empty_gamefields(gamefield);
    gamefield = spawn_ghosts(gamefield,CENTER_POINT);

    return gamefield;           // <= Diese Zeile auskommentieren, damit nur 'GAME_LAYOUT' benutzt wird 
    return GAME_LAYOUT;
}
/**
 * Spawnt die Geister außerhalb der Spawnbox von Pacman
 * @param {string[][]} gamefield 
 * @param {number[2]} CENTER_POINT 
 * @returns 
 */
function spawn_ghosts(gamefield,CENTER_POINT) {
    let possible_spawn_points = [];
    gamefield.forEach((row,row_index) => {
        row.forEach((field,col_index) => {
            // Nutzt das generierte Spielfeld, um alle Wege rauszufiltern und die Spawnbox zu ignorieren
            if(field == GAME_FIELD_TYPES.WAY && (row_index > CENTER_POINT[0] + 2 || row_index < CENTER_POINT[0] - 2 || col_index > CENTER_POINT[1] + 2 || col_index < CENTER_POINT[1] - 2)) {
                possible_spawn_points.push([row_index, col_index]);
            }
        }
    )});
    let pos = new Array(2);
    for(let i = 0; i < 4; i++) {
        // Zufälliges Feld aus allen gefilterten Feldern wählen
        possible_spawn_points = shuffle_array(possible_spawn_points);
        pos = possible_spawn_points.shift();
        gamefield[pos[0]][pos[1]] = GAME_FIELD_TYPES.GHOST;
    }
    return gamefield;
}
function fill_empty_gamefields(gamefield) {
    let matrix = new Array(24).fill(0);
    let field = GAME_FIELD_TYPES.NONE;
    // Iteriert über jedes Feld
    for (let row = 2; row < gamefield.length - 1; row++) {
        for(let col = 1; col < gamefield[0].length - 1; col++) {
            field = gamefield[row][col];
            // Generiert ein Feld, wenn noch keins vorhanden ist
            if(field != GAME_FIELD_TYPES.NONE)
                continue;
            // Holt sich die umliegenden Felder (5x5 Matrix) von der aktuellen Position
            // Variable matrix besteht dann aus einem Array von 24 Feldern (5x5 - 1)
            // Für eine bessere Spielfeldgenerierung muss die Matrix erweitert werden, um mehr Eventualitäten abzuwägen
            matrix = get_surroundings_matrix(row,col,gamefield);

            // Sucht nach Pattern, um das Feld zu bestimmen
            // Pattern werden in der compare_surroundings_matrix_with_pattern() verglichen
            // Priorität: WAY > WALL > RANDOM
            
            /**
             * ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? X ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? X ? ? | ? ? X ? ?
             * ? X X ? ? | ? ? ? ? ? | ? ? X X ? | ? ? ? ? ? | ? X O O ? | ? X O X ? | ? X ? ? ? | ? ? ? X ? | ? ? ? ? ? | ?-X O X ? | ? X O ? ?
             * ? X O ? ? | ? X O ? ? | ? ? O X ? | ? ? O X ? | ? X O-O ? | ? ? O ? ? | ? O O ? ? | ? ? O O ? | ? ? O ? ? | ?-O O ? ? | ? ? O ? ?
             * ? ? ? ? ? | ? X X ? ? | ? ? ? ? ? | ? ? X X ? | ? ?-X ? ? | ? ? ? ? ? | ? X ? ? ? | ? ? ? X ? | ? X O X ? | ? ? ? ? ? | ? ? ? ? ?
             * ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             * 
             * ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             * ? X ? ? ? | ? ? ? ? ? | ? ? ? X ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? O X ?
             * X O O ? ? | X O O ? ? | ? ? O O X | ? ? O O X | ? ? O ? ? | ? ? O ? ? | ? X O ? ?
             * ? ? ? ? ? | ? X ? ? ? | ? ? ? ? ? | ? ? ? X ? | ? X O ? ? | ? ? O X ? | ? ? ? ? ?
             * ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? X ? ? | ? ? X ? ? | ? ? ? ? ?
             * 
             * ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             * ? X O ? ? | ? ? O X ? | ? ? O X ? | ? X O ? ? | ? ? X ? ? | ? ? ? ? ? | ? O O X ?
             * ? X O ? ? | ? ? O X ? | ?-O O ? ? | ? O O-O ? | ? ? O-X ? | ? X O X ? | ? O O * ?
             * ? X ? ? ? | ? ? ? X ? | ? ? ? ? ? | ? ?-O ? ? | ? ? X ? ? | ? ?-X ? ? | X X X X X
             * ? ? X ? ? | ? ? X ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             */
            const WAY_PATTERN_1 = [0,0,0,0,0,0,2,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_2 = [0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,2,0,0,0,0,0,0,0];
            const WAY_PATTERN_3 = [0,0,0,0,0,0,0,2,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_4 = [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,2,0,0,0,0,0,0];
            const WAY_PATTERN_5 = [0,0,2,0,0,0,2,1,1,0,0,2,-1,0,0,0,-2,0,0,0,0,0,0,0];
            const WAY_PATTERN_6 = [0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_7 = [0,0,0,0,0,0,2,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_8 = [0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0];
            const WAY_PATTERN_9 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0];
            const WAY_PATTERN_10 = [0,0,2,0,0,0,-2,1,2,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_11 = [0,0,2,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_12 = [0,0,0,0,0,0,2,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_13 = [0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,2,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_14 = [0,0,0,0,0,0,0,0,2,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_15 = [0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0,0,2,0,0,0,0,0,0];
            const WAY_PATTERN_16 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,2,0,0];
            const WAY_PATTERN_17 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0,0,2,0,0];
            const WAY_PATTERN_18 = [0,0,0,0,0,0,0,1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_19 = [0,0,0,0,0,0,2,1,0,0,0,2,0,0,0,2,0,0,0,0,0,2,0,0];
            const WAY_PATTERN_20 = [0,0,0,0,0,0,0,1,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0];
            const WAY_PATTERN_21 = [0,0,0,0,0,0,0,1,2,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0];
            const WAY_PATTERN_22 = [0,0,0,0,0,0,2,1,0,0,0,1,-1,0,0,0,-1,0,0,0,0,0,0,0];
            const WAY_PATTERN_23 = [0,0,0,0,0,0,0,2,0,0,0,0,-2,0,0,0,2,0,0,0,0,0,0,0];
            const WAY_PATTERN_24 = [0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,-2,0,0,0,0,0,0,0];
            const WAY_PATTERN_25 = [0,0,0,0,0,0,1,1,2,0,0,1,3,0,2,2,2,2,2,0,0,0,0,0];
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_1)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_2)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_3)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_4)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_5)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_6)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_7)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_8)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_9)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_10)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_11)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_12)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_13)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_14)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_15)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_16)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_17)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_18)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_19)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_20)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_21)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_22)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_23)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_24)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WAY_PATTERN_25)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WAY;
                continue;
            }
            
            /** Beispiel:
             * drei Felder 'Way' um das Spawnfeld (Rest egal) -> 'Wall'
             * ? ? ? ? ? | ? X X X ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             * ? O O-X ? |-X O O O X | ? ? ? ? ? | ? ? X ? ? | ? ? X ? ? | ? ? X ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ? ? O X | ? O X ? ? | ? O X ? ? | ? ? X ? ?
             * ? O X ? ? | ? X X-X ? | ?-X X ? ? | ? X X ? ? | ? ? X X ? | ? O X ? ? | ? ? X ? X | X ? X ? ? | ? X X ? ? | O O X ? ? | X O X-X ? | ? X X ? ?
             * ? ? ? ? ? | ? ? ? ? ? | X ? ? ? ? | ? ? X ? ? | ? ? X ? ? | ?-X-X-X ? | ? ? ? ? X | X ? ? ? ? | ? ? ? ? ? | ? * * * ? | ? ? ?-X ? | ? ? ? ? ?
             * ? ? ? ? ? | ? ? ? ? ? | ? X ? ? ? | ? ? ? ? ? | ? ? ? ? ? | ? ?-O ? ? | ? ? X X ? | ? X X ? ? | ? ? ? ? ? | ? X O X ? | ? X O ? ? | ? ? ? ? ?
             */
            const WALL_PATTERN_1 = [0,0,0,0,0,0,1,1,-2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
            const WALL_PATTERN_2 = [0,2,2,2,0,-2,1,1,1,2,0,2,-2,0,0,0,0,0,0,0,0,0,0,0];
            const WALL_PATTERN_3 = [0,0,0,0,0,0,0,0,0,0,0,-2,0,0,2,0,0,0,0,0,2,0,0,0];
            const WALL_PATTERN_4 = [0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0];
            const WALL_PATTERN_5 = [0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0];
            const WALL_PATTERN_6 = [0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,-2,-2,-2,0,0,0,-1,0,0];
            const WALL_PATTERN_7 = [0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,2,2,0,0];
            const WALL_PATTERN_8 = [0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,2,2,0];
            const WALL_PATTERN_9 = [0,0,0,0,0,0,0,0,1,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0];
            const WALL_PATTERN_10 = [0,0,0,0,0,0,1,2,0,0,1,1,0,0,0,3,3,3,0,0,2,1,2,0];
            const WALL_PATTERN_11 = [0,0,0,0,0,0,1,2,0,0,2,1,-2,0,0,0,0,-2,0,0,2,1,0,0];
            const WALL_PATTERN_12 = [0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0];
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_1)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_2)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_3)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_4)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_5)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_6)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_7)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_8)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_9)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_10)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_11)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, WALL_PATTERN_12)) {
                gamefield[row][col] = GAME_FIELD_TYPES.WALL;
                continue;
            }

            /**
             * ? ?-X-O ? | ? ? ? ? ?                 | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             * ? X O-X ? | ? O O O-X                 | ?-X-O-X ? | ?-X-O-X ? | ?-X-O-X ?
             * ? X ? ? ? | ? X ?-O ?                 | ? ? ? ? ? | ? ? ? ? ? | ? ? ? ? ?
             * ? X-X ? ? | ? ? ? ? ?                 | ? * * * ? | ? * * * ? | ? * * * ?
             * ? ?-X ? ? | ? ? ? ? ?                 | ?-X ? ? ? | ? ?-X ? ? | ? ? ?-X ?
             * 
             * ? ? ? ? ? | ?-X-X ? ? | ? ? ? ? ? | ? ? ? ? ?
             * ? ? X ? ? | ?-X O X ? | ? ? X X ? | ?-X-O-X ?
             * ? ? ? ? ? | ? ? ? X ? | ? O ? * ? | ? ? ? ? ?
             * ? * * * ? | ? ?-X X ? | ? * * * ? | ? * * * ?
             * ? * * * ? | ? ?-X ? ? | ? ? ? ? ? | ? ? X ? ?
             */
            const RANDOM_PATTERN_1 = [0,0,-2,-1,0,0,2,1,-2,0,0,2,0,0,0,2,-2,0,0,0,0,-2,0,0];
            const RANDOM_PATTERN_2 = [0,0,0,0,0,0,1,1,1,-2,0,2,-1,0,0,0,0,0,0,0,0,0,0,0];
            
            const RANDOM_PATTERN_3 = [0,0,0,0,0,0,-2,-1,-2,0,0,0,0,0,0,3,3,3,0,0,-2,0,0,0];
            const RANDOM_PATTERN_4 = [0,0,0,0,0,0,-2,-1,-2,0,0,0,0,0,0,3,3,3,0,0,0,-2,0,0];
            const RANDOM_PATTERN_5 = [0,0,0,0,0,0,-2,-1,-2,0,0,0,0,0,0,3,3,3,0,0,0,0,-2,0];
            
            const RANDOM_PATTERN_6 = [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0];
            const RANDOM_PATTERN_7 = [0,-2,-2,0,0,0,-2,1,2,0,0,0,2,0,0,0,-2,2,0,0,0,-2,0,0];
            const RANDOM_PATTERN_8 = [0,0,0,0,0,0,0,2,2,0,0,1,3,0,0,3,3,3,0,0,0,0,0,0];
            const RANDOM_PATTERN_9 = [0,0,0,0,0,0,-2,-1,-2,0,0,0,0,0,0,3,3,3,0,0,0,2,0,0];
            /**/
            if(compare_surroundings_matrix_with_pattern(matrix, RANDOM_PATTERN_1)) {
                gamefield[row][col] = get_random_field();
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, RANDOM_PATTERN_2)) {
                gamefield[row][col] = get_random_field();
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, RANDOM_PATTERN_6)) {
                gamefield[row][col] = get_random_field();
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, RANDOM_PATTERN_7)) {
                gamefield[row][col] = get_random_field();
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, RANDOM_PATTERN_8)) {
                gamefield[row][col] = get_random_field();
                continue;
            }
            if(compare_surroundings_matrix_with_pattern(matrix, RANDOM_PATTERN_9)) {
                gamefield[row][col] = get_random_field();
                continue;
            }
            // Falls kein Pattern gefunden wurde, wird ein zufälliges Feld generiert
            gamefield[row][col] = get_random_field();
        }
    }
    return gamefield;
}
/**
 * Nutzt die Feldtypen für die beiden Matrizen, um diese zu vergleichen.
 * @param {number[24]} orign_matrix 
 * @param {number[24]} pattern_matrix 
 * @returns 
 */
function compare_surroundings_matrix_with_pattern(orign_matrix, pattern_matrix) {
    if(orign_matrix.length != 24 || pattern_matrix.length != 24) {
        console.warn("Matrix doesnt match surroundings!");
        return false;
    }
    for(let i = 0; i < 24; i++) {
        let field_type = pattern_matrix[i];
        switch(field_type) {
            // Pattern Typ 'WildCard' wird ignoriert
            case 0:
                break;
            case 1:
            case 2:
                if(field_type != orign_matrix[i]) {
                    return false;
                }
                break;
            case -1:
            case -2:
                if(Math.abs(field_type) == orign_matrix[i]) {
                    return false;
                }
                break;
            case 3:
            case -3:
                if(0 != orign_matrix[i]) {
                    return false;
                }
                break;
        }
    }
    return true;
}
/**
 * Gibt ein zufälliges Feld zurück
 * @returns 'Way' oder 'Wall'
 */
function get_random_field() {
    // Wahrscheinlichkeit für eine 'Wall': 1/WALL_PROPABILITY
    const WALL_PROPABILITY = 2;
    return (Math.floor((Math.random() * 10) * WALL_PROPABILITY) % WALL_PROPABILITY == 0) ?
        GAME_FIELD_TYPES.WALL : GAME_FIELD_TYPES.WAY;
}
/** 
 * @Umgebungsarray:
 * [ *, *, *, *, *,
 *   *, *, *, *, *,
 *   *, *, +, *, *,
 *   *, *, *, *, *,
 *   *, *, *, *, * ].length = 24
 * @Feldtypen:
 * (0: Empty/WildCard, 1: Way, 2: Wall, 3: Invalid, -: Verneinung)
 * @param {number} row 
 * @param {number} col 
 * @param {string[][]} gamefield 
 * @returns 
 */
function get_surroundings_matrix(row,col,gamefield) {
    let matrix = [];
    for(let _row = row - 2; _row <= row + 2; _row++) {
        for(let _col = col - 2; _col <= col + 2; _col++) {
            if(_row == row && _col == col) {
                continue;
            } else if(_row < 0 || _row > gamefield.length - 1 || _col < 0 || _col > gamefield[row].length - 1) {
                // Invalid field (außerhalb des Spielfeldes)
                matrix.push(3);
                continue;
            }
            switch(gamefield[_row][_col]){
                case GAME_FIELD_TYPES.WALL:
                case GAME_FIELD_TYPES.HIGHLIGHTED_WALL:
                    matrix.push(2);
                    break;
                case GAME_FIELD_TYPES.NONE:
                    matrix.push(0);
                    break;
                case GAME_FIELD_TYPES.WAY:
                case GAME_FIELD_TYPES.PACMAN:
                case GAME_FIELD_TYPES.GHOST:
                    matrix.push(1);
                    break;
                default:
                    console.warn("Unkown gamefield type:",gamefield[_row][_col]);
                    break;
            }
        }
    }
    return matrix;
}
/**
 * Bare bone structure: [
 * @[X X X X X X X X X]
 * @[X O O O - O O O X]
 * @[X - X X O X X - X]
 * @[X - - O O O - - X]
 * @[X - - O P O - - X]
 * @[X - - O O O - - X]
 * @[X - X - - - X - X]
 * @[X - - - - - - - X]
 * @[X X X X X X X X X] ]
 * @param {number} rows
 * @param {number} cols 
 * @param {number[2]} CENTER_POINT 
 * @returns {string[][]}
 */
function make_bare_bone_gamefield(rows,cols,CENTER_POINT){
    // reihe voll mit wänden (für oben und unten)
    const horizontalBorder = new Array(cols).fill(GAME_FIELD_TYPES.WALL, 0, cols);
    // reihe mit wand rändern
    const horizontalBareBoneRow = [GAME_FIELD_TYPES.WALL].concat(new Array(cols - 2).fill(GAME_FIELD_TYPES.NONE, 0, cols - 2), GAME_FIELD_TYPES.WALL);
    let gamefield = [];
    gamefield.push(horizontalBorder);
    // erste reihe wird zufällig generiert damit spätere daraus folgende reihen ein wenig varianz bekommen
    gamefield.push([GAME_FIELD_TYPES.WALL].concat(random_first_row(cols - 2), [GAME_FIELD_TYPES.WALL]));
    for(let row = 2; row < rows - 1; row++) {
        gamefield.push([...horizontalBareBoneRow]);
        // ecken um die 3 x 3 spawnfläche für pacman
        if(row == CENTER_POINT[0] - 2) {
            gamefield[row][CENTER_POINT[1] - 2] = GAME_FIELD_TYPES.WALL;
            gamefield[row][CENTER_POINT[1] - 1] = GAME_FIELD_TYPES.WALL;
            gamefield[row][CENTER_POINT[1]] = GAME_FIELD_TYPES.WAY;
            gamefield[row][CENTER_POINT[1] + 1] = GAME_FIELD_TYPES.WALL;
            gamefield[row][CENTER_POINT[1] + 2] = GAME_FIELD_TYPES.WALL;
        }
        if(row == CENTER_POINT[0] + 2){
            gamefield[row][CENTER_POINT[1] - 2] = GAME_FIELD_TYPES.WALL;
            gamefield[row][CENTER_POINT[1] + 2] = GAME_FIELD_TYPES.WALL;
        }
    }
    // spawn aria
    for(let row = CENTER_POINT[0] - 1; row <= CENTER_POINT[0] + 1; row++){
        for(let col = CENTER_POINT[1] - 1; col <= CENTER_POINT[1] + 1; col++){
            gamefield[row][col] = GAME_FIELD_TYPES.WAY;
        }
    }
    // pacman
    gamefield[CENTER_POINT[0]][CENTER_POINT[1]] = GAME_FIELD_TYPES.PACMAN;
    gamefield.push(horizontalBorder);
    return gamefield;
}
/**
 * Erstellt die erste Reihe des Spielfeldes mit einem gewissen Zufall, um mehr Varianz reinzubringen
 * @param {number} cols 
 * @returns 
 */
function random_first_row(cols) {
    // Die ersten drei felder müssen wege sein
    let random_row = new Array(3).fill(GAME_FIELD_TYPES.WAY, 0, 3);
    for (let col = 3; col < cols - 3; col++) {
        // Eine wand darf erst dann kommen wenn mindestends 3 wege dazwischen liegen
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
    // Die letzten drei felder müssen wege sein
    random_row = random_row.concat(new Array(3).fill(GAME_FIELD_TYPES.WAY, 0, 3));
    return random_row;
}

export class Game {
    constructor(cell_size, canvas, ctx, rows, cols) {
        this._game_is_running = false;
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
        if(!this._game_is_running) {
            this._game_is_running = true;
        }
    }

    step() {
        if (this._pacman._direction == "NONE" || !this._game_is_running) {
            return;
        }
        this.interval_checking();
        if (this._pacman.can_move()) {
            this._pacman.move();
        }

        for (let i = 0; i < this._ghosts.length; i++) {
            // zwischenspeichern der alten position für die Kollisionserkennung (collision_detection)
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
        // Abfrage, ob Pacman und Geist auf dem selben Feld sind oder Pacman durch den Geist durchgegangen ist
        if (ghost._x == pacman._x && ghost._y == pacman._y || (pacman._x == old_pos[0] && pacman._y == old_pos[1] && pacman._direction == ghost.get_opposite_direction())) {
            if (!pacman._eating_mode) {
                this.end_game(false);
            } else {
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
        return new Game(game_cell_size, this._canvas, this._ctx,game_rows,game_cols);
    }

    // Filtert alle Wege
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
    // Spawnt Geister, wenn sie gegessen wurden
    spawn_ghost() {
        let spawn_fields = this.get_possible_spawn_points();
        // Filtert Spawnpunkte vom Geist, sodass dieser nicht direkt vor Pacman spawnen kann
        spawn_fields = spawn_fields.filter((spawn_point_pos) => spawn_point_pos[0] != this._pacman._x && spawn_point_pos[1] != this._pacman._y);
        spawn_fields = shuffle_array(spawn_fields);
        if (spawn_fields.length > 0) {
            return spawn_fields[0];
        } else {
            console.warn("No correct spawn location found!");
            return [1, 1];
        }
    }

    // Zeichnet das Spielfeld (Wege und Wände)
    draw_grid() {
        this._ctx.strokeStyle = "black";

        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let grid_value = this._game_layout[row][col];
                switch (grid_value) {
                    case GAME_FIELD_TYPES.NONE:
                        this._ctx.fillStyle = "grey";
                        break;
                    case GAME_FIELD_TYPES.WALL:
                        this._ctx.fillStyle = "#1e1e1e";
                        break;
                    case GAME_FIELD_TYPES.HIGHLIGHTED_WALL:
                        this._ctx.fillStyle = "darkblue";
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

    // Zeichnet die items auf dem Spielfeld
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

    // Zusätzliche Erkennung zwischen Intervallen
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
