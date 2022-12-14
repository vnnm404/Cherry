// let header_guard = true;

const noOfSquares = 8;

const whiteTurn = 0;
const blackTurn = 1;

// const blank = 0b0000;
// const white = 0b0000;
// const black = 0b1000;

// const pawn = 0b0001;
// const king = 0b0010;
// const queen = 0b0011;
// const rook = 0b0100;
// const bishop = 0b0101;
// const knight = 0b0110;

function Coord(x, y) {
    let coord = { "x": x, "y": y };
    coordValidate(coord);
    return coord;
}

function Move(from, to){
    return {
        "from" : Coord(from.x, from.y),
        "to" : Coord(to.x, to.y)
    }
}

function coordEqual(a, b) {
    return a.x == b.x && a.y == b.y;
}

function getPiece(value) {
    // the piece information is stored in the first 3 bits
    return value & (0b111);
}

function getColor(value) {
    if (value == blank)
        return -1;
    // the 4th bit denotes color
    return value & (0b1000);
}

function turnToColor(turn) {
    if (turn == whiteTurn)
        return white;
    else
        return black;
}

function colorToTurn(color) {
    if (color == white)
        return whiteTurn;
    else
        return blackTurn;
}


function chessMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    // check if the board is of right size,
    // this shouldn't be wrong as it is not user controlled
    // assert.equal(board.length, noOfSquares);
    // assert.equal(board[0].length, noOfSquares);

    let valid = true;

    valid = valid && coordValidate(moveFromCoord);
    valid = valid && coordValidate(moveToCoord);
    valid = valid && turnValidate(turn);

    // move to same position not a move
    if (coordEqual(moveFromCoord, moveToCoord)) {
        // console.log("ChessError: move to same position not a move");
        return false;
    }

    if (valid == false) {
        // console.log("ChessError: Invalid board positions");
        return false;
    }
    let piece = getPiece(board[moveFromCoord.y][moveFromCoord.x]);

    // if player moved a blank square its invalid
    if (piece == blank) {
        // console.log("2");
        return false;
    }
    if (turn == 0 && getColor(board[moveFromCoord.y][moveFromCoord.x]) != white)
        return false;
    if (turn == 1 && getColor(board[moveFromCoord.y][moveFromCoord.x]) != black)
        return false;

    // check if the piece can even move it to that spot
    // in a non-blocking board
    switch (piece) {
        case pawn: valid = valid && pawnMoveValidate(board,
            moveFromCoord, moveToCoord, turn);
            break;
        case knight: valid = valid && knightMoveValidate(board,
            moveFromCoord, moveToCoord, turn);
            break;
        case bishop: valid = valid && bishopMoveValidate(board,
            moveFromCoord, moveToCoord, turn);
            break;
        case rook: valid = valid && rookMoveValidate(board,
            moveFromCoord, moveToCoord, turn);
            break;
        case queen: valid = valid && queenMoveValidate(board,
            moveFromCoord, moveToCoord, turn);
            break;
        case king: valid = valid && kingMoveValidate(board,
            moveFromCoord, moveToCoord, turn);
            break;
        default: valid = false;
            // console.log("ChessError: not a piece");
            break;
    }

    // console.log('Validator: Reached the end of validator::' + valid);
    return valid;
}

function checkCheck(board, moveFromCoord, moveToCoord, turn){
    let newBoard = board.map((arr)=>{return arr.slice();});
    newBoard[moveToCoord.y][moveToCoord.x] = newBoard[moveFromCoord.y][moveFromCoord.x];
    newBoard[moveFromCoord.y][moveFromCoord.x] = blank;
    let currColor = turnToColor(turn);
    let kingPos = Coord(0, 0);
    for(let i = 0; i < noOfSquares; i++){
        for(let j =0; j < noOfSquares; j++){
            if(newBoard[j][i] == (king | currColor)){
                kingPos.x = i;
                kingPos.y = j;
                break;
            }
        }
    }
    console.log(kingPos);
    let moves = genAllMoves(newBoard, (black - currColor));
    console.log(moves);
    for (let m of moves){
        // console.log("Move to: ", m.to);
        if(coordEqual(m.to, kingPos)){
            console.log("king in danger");
            return true;
        }
    }
    return false;
}

function checkLegalMove(board, moveFromCoord, moveToCoord, turn){
    return chessMoveValidate(board, moveFromCoord, moveToCoord, turn)
        && !checkCheck(board, moveFromCoord, moveToCoord, turn)
}

function coordValidate(coord) {
    if (coord.x == undefined)
        return false;
    if (coord.y == undefined)
        return false;
    if (coord.x < 0 || coord.x >= noOfSquares)
        return false;
    if (coord.y < 0 || coord.y >= noOfSquares)
        return false;
    return true;
}

function turnValidate(turn) {
    // im not dumb just for clarity sake
    if (turn == whiteTurn || turn == blackTurn)
        return true;
    return false;
}

function validBoard(board){
    return board.length == noOfSquares && board[0].length == noOfSquares;
}

function pawnMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    if (turn == whiteTurn)
        return whitePawnMoveValidate(board, moveFromCoord, moveToCoord);
    else
        return blackPawnMoveValidate(board, moveFromCoord, moveToCoord);

}

function whitePawnMoveValidate(board, moveFromCoord, moveToCoord) {

    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == white) {
        // console.log("Chess Error: Capturing your own pieces");
        return false;
    }

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    if (differenceX > 1)
        return false;

    if (getColor(destValue) == -1 && moveFromCoord.y == 6 && differenceX == 0 && moveToCoord.y == 4) {
        // pawns can move two moves ahead at the start
        return true;
    }
    // only one step ahead at atime and in only one direction
    if (moveFromCoord.y - 1 != moveToCoord.y) {
        // console.log('Chess Error: Too much ahead')
        return false;
    }
    // cannot capture own pieces
    if (getColor(destValue) == black && differenceX == 0) {
        // console.log("Chess Error: pawns cannot capture pieces infront");
        return false;
    }

    // can move diagonally only during captures
    if (differenceX == 1 && destValue == blank) {
        // console.log('Chess Error: cant move diagonally without enemy');
        return false;
    }

    return true;
}

function blackPawnMoveValidate(board, moveFromCoord, moveToCoord) {
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == black) {
        // console.log("Chess Error: Capturing your own pieces");
        return false;
    }


    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    if (differenceX > 1)
        return false;


    if (getColor(destValue) == -1 && moveFromCoord.y == 1 && differenceX == 0 && moveToCoord.y == 3) {
        // pawns can move two moves ahead at the start
        return true;
    }

    // only one step ahead at atime and in only one direction
    if (moveFromCoord.y + 1 != moveToCoord.y)
        return false;

    // cannot capture own pieces
    if (getColor(destValue) == white && differenceX == 0) {
        // console.log("Chess Error: pawns cannot capture pieces infront");
        return false;
    }

    // can move diagonally only during captures
    if (differenceX == 1 && destValue == blank)
        return false;

    return true;
}

function knightMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == turnToColor(turn))
        return false;

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);

    if (differenceX == 2 && differenceY == 1)
        return true;
    if (differenceX == 1 && differenceY == 2)
        return true;

    return false;
}

function bishopMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    // console.log("Validator: Validating Bishop move...");
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == turnToColor(turn)) {
        // console.log("Chess Error: Capturing own pieces");
        return false;
    }

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);
    let directionX = Math.sign(moveToCoord.x - moveFromCoord.x);
    let directionY = Math.sign(moveToCoord.y - moveFromCoord.y);
    if (differenceX != differenceY) {
        // console.log("ChessError: bishop can only move in diagonal");
        return false;
    }
    let currCoord = Coord(moveFromCoord.x, moveFromCoord.y);
    // console.log(currCoord);

    // go in the direction one step
    currCoord.x += 1 * directionX;
    currCoord.y += 1 * directionY;
    // console.log(currCoord);

    let valid = false;
    // go in the direction and check if its all clear
    while (coordValidate(currCoord) && !coordEqual(currCoord, moveToCoord)) {
        if (board[currCoord.y][currCoord.x] != blank)
            break;
        currCoord.x += 1 * directionX;
        currCoord.y += 1 * directionY;
    }
    // console.log(currCoord);
    // console.log(moveToCoord);
    if (coordEqual(currCoord, moveToCoord))
        valid = true;
    // console.log('Bishop validator::' + valid);
    return valid;
}

function rookMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == turnToColor(turn)) {
        // console.log("Chess Error: Capturing own pieces");
        return false;
    }

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);
    let directionX = Math.sign(moveToCoord.x - moveFromCoord.x);
    let directionY = Math.sign(moveToCoord.y - moveFromCoord.y);

    if (differenceY != 0 && differenceX != 0) {
        return false;
    }

    let currCoord = Coord(moveFromCoord.x, moveFromCoord.y);
    // console.log(currCoord);

    // go in the direction one step
    currCoord.x += 1 * directionX;
    currCoord.y += 1 * directionY;
    // console.log(currCoord);

    let valid = false;
    // go in the direction and check if its all clear
    while (coordValidate(currCoord) && !coordEqual(currCoord, moveToCoord)) {
        if (board[currCoord.y][currCoord.x] != blank)
            break;
        currCoord.x += 1 * directionX;
        currCoord.y += 1 * directionY;
    }
    // console.log(currCoord);

    if (coordEqual(currCoord, moveToCoord)) {
        // console.log('Can reach this square');
        valid = true;
    }
    return valid;
}

function queenMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    return bishopMoveValidate(board, moveFromCoord, moveToCoord, turn)
        || rookMoveValidate(board, moveFromCoord, moveToCoord, turn);
}

function kingMoveValidate(board, moveFromCoord, moveToCoord, turn) {
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == turnToColor(turn))
        return false;

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);

    if (differenceX <= 1 && differenceY <= 1)
        return true;
    return false;
}

function genMoves(board, position){
    // if(!validBoard(board))
    //     return [];
    let moves = [];
    let value = board[position.y][position.x];
    // console.log(getColor(value));
    for(let i = 0; i < noOfSquares; i++){
        for(let j = 0; j < noOfSquares; j++){
            let to = Coord(i, j);
            if(chessMoveValidate(board, position, to, colorToTurn(getColor(value)))){
                moves.push(Move(position, to));
            }
        }
    }
    return moves;
}

function genAllMoves(board, color){
    if(!validBoard(board))
        return [];
    let moves = [];
    for(let i = 0; i < noOfSquares; i++){
        for(let j = 0; j < noOfSquares; j++){
            let pos = Coord(i, j);
            if(getColor(board[j][i]) == color){
                for (let k of genMoves(board, pos)){
                    moves.push(k);
                }
            }
        }
    }
    return moves;
}

function genLegalMoves(board, position){
    // if(!validBoard(board))
    //     return [];
    let moves = [];
    let value = board[position.y][position.x];
    // console.log(getColor(value));
    for(let i = 0; i < noOfSquares; i++){
        for(let j = 0; j < noOfSquares; j++){
            let to = Coord(i, j);
            if(checkLegalMove(board, position, to, colorToTurn(getColor(value)))){
                moves.push(Move(position, to));
            }
        }
    }
    return moves;
}