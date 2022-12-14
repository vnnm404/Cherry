// no en passant, castling, or advance drawing yet
const move_sound = new Audio('/audio/move-self.mp3');
const capture_sound = new Audio('/audio/capture.mp3');
const wrong_move_sound = new Audio('/audio/wrong_move_sound.mp3');

const canvas = document.getElementById("cnv");
const ctx = canvas.getContext('2d');

const dark_square_color = '#4f5969';
const light_square_color = '#c1c8d4';
const move_square_color = '#7af4ae';
const possible_move_color = '#74f551';

const start_fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const side_len = 400;
const offset_x = 25;
const offset_y = 25;
const delta_time = 10;

const no_of_squares = 8;
const blank = 0b0000;
const white = 0b0000;
const black = 0b1000;

const pawn = 0b0001;
const king = 0b0010;
const queen = 0b0011;
const rook = 0b0100;
const bishop = 0b0101;
const knight = 0b0110;

let is_mouse_down = false;
let was_mouse_down = false;
let is_holding_piece = false;
let holding_piece = 0; // the value of the piece held
let mouse_x, mouse_y;
let curr_position;
let from_position = {'x' : 0, 'y' : 0}; // position being dragged from
let to_position= {'x' : 0, 'y' : 0};    // position being dragged to
let old_piece; // value of the piece at the target square originally
let new_piece; // value of the piece being dragged to the square
let is_being_validated = false;
let can_move = false; // to disable dragging when it's not your turn
let my_color = null;  // white or black
let match_id = null;  

let sprites = [];
sprites[blank] = ' ';
sprites[white | pawn] = '♙';
sprites[white | king] = '♔';
sprites[white | queen] = '♕';
sprites[white | rook] = '♖';
sprites[white | bishop] = '♗';
sprites[white | knight] = '♘';

sprites[black | pawn] = '♟︎';
sprites[black | king] = '♚';
sprites[black | queen] = '♛';
sprites[black | rook] = '♜';
sprites[black | bishop] = '♝';
sprites[black | knight] = '♞';

let board = [
  [12, 14, 13, 11, 10, 13, 14, 12],
  [9, 9, 9, 9, 9, 9, 9, 9],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [4, 6, 5, 3, 2, 5, 6, 4]];


// updates the board based on given FEN string 
function fen_to_board(fen) {
    let new_board = board;
    let rank = 0, file = 0;
    let ind = 0;
    while (ind < fen.length) {
        let c = fen[ind];
        ind++;
        if (c == '/') {
            rank++;
            file = 0;
            continue;
        }
        if (!isNaN(parseInt(c, 10))) {
            file += parseInt(c, 10);
            continue;
        }
        switch (c) {
            case 'p': new_board[rank][file] = black | pawn;
                break;
            case 'k': new_board[rank][file] = black | king;
                break;
            case 'q': new_board[rank][file] = black | queen;
                break;
            case 'r': new_board[rank][file] = black | rook;
                break;
            case 'b': new_board[rank][file] = black | bishop;
                break;
            case 'n': new_board[rank][file] = black | knight;
                break;
            case 'P': new_board[rank][file] = white | pawn;
                break;
            case 'K': new_board[rank][file] = white | king;
                break;
            case 'Q': new_board[rank][file] = white | queen;
                break;
            case 'R': new_board[rank][file] = white | rook;
                break;
            case 'B': new_board[rank][file] = white | bishop;
                break;
            case 'N': new_board[rank][file] = white | knight;
                break;
        }
        file++;
    }

    board = new_board;
}

// Draws the pieces and pawns
function render_board() {
    let side_len_square = side_len / no_of_squares;
    ctx.font = Math.floor(side_len_square) * 0.7 + 'px sans serif';
    let off_x = offset_x + (side_len_square) / 5;
    let off_y = offset_y * 2 + (side_len_square) / 5;
    for (let i = 0; i < no_of_squares; i++) {
        for (let j = 0; j < no_of_squares; j++) {
            ctx.fillStyle = 'black';
            ctx.fillText(sprites[board[i][j] & (0b1111)],
                off_x + j * side_len_square,
                off_y + i * side_len_square);
        }
    }

}


// draws the board
function draw() {

    let side_len_square = side_len / no_of_squares;
    for (let i = 0; i < no_of_squares; i++) {
        for (let j = 0; j < no_of_squares; j++) {
            if ((i + j) % 2 == 0) {
                ctx.fillStyle = light_square_color;
            }
            else
                ctx.fillStyle = dark_square_color;
            if(board.length != 0  && (board[j][i] & 0b10000) > 0){
                // console.log(i, j)
                ctx.fillStyle = move_square_color;
            }

            ctx.fillRect(offset_x + i * side_len_square,
                offset_y + j * side_len_square,
                side_len_square, side_len_square);
        }
    }
    // Display the rank and file numbers and letters

    // write the numbers (1 - 8 ranks)
    ctx.fillStyle = 'black'
    for (let i = 0; i < no_of_squares; i++) {
        ctx.font = '15px sans-serif';
        ctx.fillText(8 - i, offset_x / 3,
            offset_y * 1.3 + side_len_square / 2 + i * side_len_square);
        // numbered from bottom up  
    }

    // write the letters (a - h files)
    for (let i = 0; i < no_of_squares; i++) {
        ctx.font = '15px sans-serif';
        ctx.fillText(String.fromCharCode(i + 97),
            offset_x * 0.9 + side_len_square / 2 + i * side_len_square,
            offset_y * 1.1 + side_len + 10);
        // ctx.fillText(String.fromCharCode(i), i, offset_y + side_len + 10)
    }
}

function get_box_coords() {
    let x = mouse_x - offset_x;
    let y = mouse_y - offset_y;
    let side_len_square = side_len / no_of_squares;
    let j = Math.floor(x / side_len_square);
    let i = Math.floor(y / side_len_square);
    // console.log(i, j);
    return [i, j];
}

// The most complicated function ever
// Handles drag
function handle_drag() {

    // Dont allow dragging while previous move is being validated
    if(is_being_validated)
        return;

    // get the square on which the mouse is hovering on
    let coords = get_box_coords();
    let i = coords[0], j = coords[1];

    // if mouse got clicked, update the from_position
    if(was_mouse_down == false && is_mouse_down == true){
        from_position.x = curr_position.x;
        from_position.y = curr_position.y;
    }

    // if mouse was released and the player was holding a piece
    if(was_mouse_down == true && is_mouse_down == false && is_holding_piece){
        
        // store the actions, these will be sent to the server
        old_piece = board[i][j];
        new_piece = holding_piece;
        to_position.x = curr_position.x;
        to_position.y = curr_position.y;

        // send movement data to the server
        if (my_color == 0){
            // if(!coordEqual(from_position, to_position))
            socket.emit('move', match_id, from_position, to_position);
        }
        else
            // Black has the board in a different perspective so
            // adjust the coordinates accordingly
            socket.emit('move', match_id, {
                    x : no_of_squares - from_position.x - 1 ,
                    y : no_of_squares - from_position.y - 1 
                },
                {
                    x : no_of_squares - to_position.x - 1 ,
                    y : no_of_squares - to_position.y - 1 
                });
        is_being_validated = true;
    }

    // store current mouse state as the old mouse state
    was_mouse_down = is_mouse_down;

    // update current position
    curr_position = {
        "x": j,
        "y": i
    }

    if (is_mouse_down) {
        if (!is_holding_piece) {
            // if not holding a piece, check if the current square has a piece
            // & (0b1111) is done as other bits maybe used for other purposes
            if (board[i][j] & (0b1111) == 0) 
                return;
            
            // set the holding piece to whatever is on that square
            is_holding_piece = true;
            holding_piece = board[i][j];
            board[i][j] = 0;
        }
        else {
            // if already holding a piece and the mouse is held down,
            // display the held piece at the mouse
            ctx.fillStyle = 'black';
            ctx.font = Math.floor(side_len / no_of_squares) * 0.8 + 'px sans serif';
            let off_x = Math.floor(side_len / no_of_squares) * 0.3;
            ctx.fillText(sprites[holding_piece], mouse_x - off_x, mouse_y);
        }
    }
    else {
        if (is_holding_piece) {
            // If mouse is up and we are still holding a piece,
            // Drop the piece 
            is_holding_piece = false;
            old_piece = board[i][j];
            board[i][j] = holding_piece;
            holding_piece = 0;
        }
    }
}

// Indicates all the allowed legal moves with green circles
function display_possible_moves(){
    let side_len_square = side_len / no_of_squares;
    let new_board = []
    let new_from_position = Coord(from_position.x, from_position.y);
    
    // if color is black. make a rotated version of the board and coordinates ;
    // else keep it same
    if (my_color == 0)
        new_board = board;
    else {
        for (let i = 0; i < no_of_squares; i++) {
            new_board.push([]);
            for (let j = 0; j < no_of_squares; j++) {
                new_board[i].push(board[no_of_squares - i - 1][no_of_squares - j - 1]);
            }
        }
        new_from_position.x = no_of_squares - new_from_position.x - 1;
        new_from_position.y = no_of_squares - new_from_position.y - 1;
    }
    console.log(new_board)

    // Get all the legal moves from the current held piece
    let moves = genLegalMoves(new_board, new_from_position);
    // console.log(moves);

    // For every legal move draw a green circle indicating that
    for(let m of moves){
        console.log(m);
        ctx.fillStyle = possible_move_color;
        ctx.font = '15px sans-serif';
        let off_x = offset_x + (side_len_square) / 3;
        let off_y = offset_y * 1.5 + (side_len_square) / 3;
        if(my_color == 0)
            ctx.fillText('⬤', off_x + m.to.x * side_len_square,
        off_y + m.to.y * side_len_square);
        else
        ctx.fillText('⬤', off_x + (no_of_squares - m.to.x - 1) * side_len_square,
        off_y + (no_of_squares - m.to.y - 1) * side_len_square);
            // ⬤
    }
}

window.onload = () => {
    draw();
    fen_to_board(start_fen);
    render_board();
}

canvas.onmousedown = () => {
    // console.log('down');
    is_mouse_down = true;
    // console.log(mouse_x, mouse_y);
}
canvas.onmouseup = () => {
    // console.log('up');
    is_mouse_down = false;
    // console.log(mouse_x, mouse_y);
}

canvas.ontouchstart = () => {
    // console.log('down');
    is_mouse_down = true;
    // console.log(mouse_x, mouse_y);
}
canvas.ontouchend = () => {
    // console.log('up');
    is_mouse_down = false;
    // console.log(mouse_x, mouse_y);
}


canvas.onmousemove = (event) => {
    mouse_x = event.clientX - document.getElementById('cnv').getBoundingClientRect().x;
    mouse_y = event.clientY - document.getElementById('cnv').getBoundingClientRect().y;
}
canvas.ontouchmove = (e) => {
    e.preventDefault();
    mouse_x = e.touches[0].clientX;
    mouse_y = e.touches[0].clientY;
}

// main draw loop
setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    
    if(can_move)
        handle_drag();
    
    render_board();
    if(is_holding_piece){
        board[from_position.y][from_position.x] = holding_piece;
        display_possible_moves();
        board[from_position.y][from_position.x] = blank;
    }
}, delta_time);