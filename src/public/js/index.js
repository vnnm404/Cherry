// no en passant, castling, or advance drawing yet

const dark_square_color = '#4f5969';
const light_square_color = '#c1c8d4';
const move_square_color = '#7af4ae';
const start_fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const no_of_squares = 8;
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext('2d');
const side_len = 400;
const offset_x = 25;
const offset_y = 25;
const delta_time = 10;
const move_sound = new Audio('/audio/move-self.mp3');
const capture_sound = new Audio('/audio/capture.mp3');

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
let holding_piece = 0;
let mouse_x, mouse_y;
let curr_position, from_position = {'x' : 0, 'y' : 0}, to_position= {'x' : 0, 'y' : 0};
let old_piece, new_piece;
let is_being_validated = false;
let can_move = false;
let my_color = null;
let match_id = null;

let sprites = []
sprites[blank] = ' ';
sprites[white | pawn] = '♙'
sprites[white | king] = '♔'
sprites[white | queen] = '♕'
sprites[white | rook] = '♖'
sprites[white | bishop] = '♗'
sprites[white | knight] = '♘'

sprites[black | pawn] = '♟︎'
sprites[black | king] = '♚'
sprites[black | queen] = '♛'
sprites[black | rook] = '♜'
sprites[black | bishop] = '♝'
sprites[black | knight] = '♞'

let board = [];

function init_board() {
    for (let i = 0; i < no_of_squares; i++) {
        let rank = []
        for (let j = 0; j < no_of_squares; j++) {
            rank.push(0);
        }
        board.push(rank);
    }
}

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

    // console.log(new_board);
    // let board_with_pieces = board;
    // for(let i = 0; i < no_of_squares; i++){
    //     for(let j = 0; j < no_of_squares; j++){
    //         board_with_pieces[i][j] = sprites[new_board[i][j]];
    //     }
    // }
    // console.log(board_with_pieces);
    board = new_board
}

function render_board() {
    let side_len_square = side_len / no_of_squares;
    ctx.font = Math.floor(side_len_square) * 0.7 + 'px sans serif';
    let off_x = offset_x + (side_len_square) / 5;
    let off_y = offset_y * 2 + (side_len_square) / 5;
    for (let i = 0; i < no_of_squares; i++) {
        for (let j = 0; j < no_of_squares; j++) {
            // if(my_color == 1)
            //     ctx.fillText(sprites[board[no_of_squares - i - 1][no_of_squares - j - 1]],
            //         off_x + j * side_len_square,
            //         off_y + i * side_len_square);
            // else
            // if( board[i][j] & 0b10000 != 0){
            //     console.log(i, j);  
            //     ctx.fillStyle = move_square_color;
            //     ctx.fillRect(offset_x + i * side_len_square,
            //         offset_y + j * side_len_square,
            //         side_len_square, side_len_square);
            // }
            ctx.fillStyle = 'black';
            ctx.fillText(sprites[board[i][j] & (0b1111)],
                off_x + j * side_len_square,
                off_y + i * side_len_square);
        }
    }

}

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
                console.log(i, j)
                ctx.fillStyle = move_square_color;
            }

            ctx.fillRect(offset_x + i * side_len_square,
                offset_y + j * side_len_square,
                side_len_square, side_len_square);
        }
    }
    ctx.fillStyle = 'black'
    for (let i = 0; i < no_of_squares; i++) {
        ctx.font = '15px sans-serif';
        ctx.fillText(8 - i, offset_x / 3,
            offset_y * 1.3 + side_len_square / 2 + i * side_len_square);
        // numbered from bottom up  
    }
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

function handle_drag() {
    if(is_being_validated)
        return;
    let coords = get_box_coords();
    let i = coords[0], j = coords[1];
    if(was_mouse_down == false && is_mouse_down == true){
        from_position.x = curr_position.x;
        from_position.y = curr_position.y;
    }
    if(was_mouse_down == true && is_mouse_down == false && is_holding_piece){
        old_piece = board[i][j];
        new_piece = holding_piece;
        to_position.x = curr_position.x;
        to_position.y = curr_position.y;
        if (my_color == 0)
            socket.emit('move', match_id, from_position, to_position);
        else
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
    was_mouse_down = is_mouse_down;
    curr_position = {
        "x": j,
        "y": i
    }
    if (is_mouse_down) {
        if (!is_holding_piece) {
            if (board[i][j] == 0)
                return;
            is_holding_piece = true;
            holding_piece = board[i][j];
            board[i][j] = 0;
        }
        else {
            ctx.font = Math.floor(side_len / no_of_squares) * 0.8 + 'px sans serif';
            let off_x = Math.floor(side_len / no_of_squares) * 0.3;
            ctx.fillText(sprites[holding_piece], mouse_x - off_x, mouse_y);
        }
    }
    else {
        if (is_holding_piece) {
            is_holding_piece = false;
            if (board[i][j] == 0)
                move_sound.play();
            else
                capture_sound.play();
            old_piece = board[i][j];
            board[i][j] = holding_piece;
            holding_piece = 0;
        }
    }
}

// socket.emit('move', fromCoords, toCoords);

window.onload = () => {
    draw();
    init_board();
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
    // console.log(mouse_x, mouse_y);

}

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    if(can_move)
        handle_drag();
    render_board();
}, delta_time);