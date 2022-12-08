const noOfSquares = 8;

const whiteTurn = 0;
const blackTurn = 1;


const blank = 0b0000;
const white = 0b0000;
const black = 0b1000;

const pawn = 0b0001;
const king = 0b0010;
const queen = 0b0011;
const rook = 0b0100;
const bishop = 0b0101;
const knight = 0b0110;

function Coord(x, y){
    let coord = {"x" : x, "y" : y};
    coordValidate(coord);
    return coord;

}

function getPiece(value){
    // the piece information is stored in the first 3 bits
    return value & (0b111);
}

function getColor(value){
    // the 4th bit denotes color
    return value & (0b1000);
}

function turnToColor(turn){
    if (turn == whiteTurn)
        return white;
    else
        return black;
}

function colorToTurn(color){
    if (color == white)
        return whiteTurn;
    else
        return blackTurn;
}

function chessMoveValidate(board, moveFromCoord, moveToCoord, turn){
    // check if the board is of right size,
    // this shouldn't be wrong as it is not user controlled
    assert(board.length() == noOfSquares);
    assert(board[0].length() == noOfSquares);

    let valid = true;

    valid &= coordValidate(moveFromCoord);
    valid &= coordValidate(moveToCoord);
    valid &= turnValidate(turn);

    // move to same position not a move
    if (moveFromCoord == moveToCoord)
        return false;

    if(valid == false)
        return false;
    let piece = getPiece(board[moveFromCoord.y][moveFromCoord.x]);
    
    // if player moved a blank square its invalid
    if (piece == blank){
        return false;
    }

    // check if the piece can even move it to that spot
    // in a non-blocking board
    switch(piece){
        case pawn:  valid &= pawnMoveValidate(board, 
                        moveFromCoord, moveToCoord, turn);
            break;
        case knight:valid &= knightMoveValidate(board, 
                        moveFromCoord, moveToCoord, turn);
            break;
        case bishop:valid &= bishopMoveValidate(board, 
                        moveFromCoord, moveToCoord, turn);
            break;
        case rook:  valid &= rookMoveValidate(board, 
                        moveFromCoord, moveToCoord, turn);
            break;
        case queen: valid &= queenMoveValidate(board, 
                        moveFromCoord, moveToCoord, turn);
            break;
        case king:  valid &= kingMoveValidate(board, 
                        moveFromCoord, moveToCoord, turn);
            break;
        default:    valid = false;
            break;
    }

}

function coordValidate(coord){
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

function turnValidate(turn){
    // im not dumb just for clarity sake
    if(turn == whiteTurn || turn == blackTurn)
        return true;
    return false;
}

function pawnMoveValidate(board, moveFromCoord, moveToCoord, turn){
    if(turn == whiteTurn)
        return whitePawnMoveValidate(board, moveFromCoord, moveToCoord);
    else
        return blackPawnMoveValidate(board, moveFromCoord, moveToCoord);
    
}

function whitePawnMoveValidate(board, moveFromCoord, moveToCoord){
    
    // only one step ahead at atime and in only one direction
    if (moveFromCoord.y - 1 != moveToCoord.y)
        return false;
    
    let differnceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    if (differnceX > 1)
        return false;
        
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == white) 
        return false;

    // can move diagonally only during captures
    if (differnceX == 1 && destValue == blank)
        return false;

    return true;
}

function blackPawnMoveValidate(board, moveFromCoord, moveToCoord){
    // only one step ahead at atime and in only one direction
    if (moveFromCoord.y + 1 != moveToCoord.y)
        return false;
    
    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    if (differenceX > 1)
        return false;
        
    let destValue = board[moveToCoord.y][moveToCoord.x];

    // cannot capture own pieces
    if (getColor(destValue) == black) 
        return false;

    // can move diagonally only during captures
    if (differenceX == 1 && destValue == blank)
        return false;

    return true;
}

function knightMoveValidate(board, moveFromCoord, moveToCoord, turn){
    let destValue = board[moveToCoord.y][moveToCoord.x];
    
    // cannot capture own pieces
    if(getColor(destValue) == turnToColor(turn))
        return false;

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);

    if (differenceX == 2 && differenceY == 1)
        return true;
    if (differenceX == 1 && differenceY == 2)
        return true;
    
    return false;
}

function bishopMoveValidate(board, moveFromCoord, moveToCoord, turn){    
    let destValue = board[moveToCoord.y][moveToCoord.x];
    
    // cannot capture own pieces
    if(getColor(destValue) == turnToColor(turn))
        return false;

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);
    let directionX = Math.sign(moveToCoord.x - moveFromCoord.x);
    let directionY = Math.sign(moveToCoord.y - moveFromCoord.y);
    if (differenceX != differenceY)
        return false;
    let currCoord = moveFromCoord;
    
    // go in the direction one step
    currCoord.x += 1 * directionX;
    currCoord.y += 1 * directionY;

    let valid = false;
    // go in the direction and check if its all clear
    while(coordValidate(currCoord) && currCoord != moveToCoord){
        if (board[currCoord.y][currCoord.x] != blank)
            break;
        currCoord.x += 1 * directionX;
        currCoord.y += 1 * directionY;
    }
    if(currCoord == moveToCoord)
        valid = true;
    return valid;
}

function rookMoveValidate(board, moveFromCoord, moveToCoord, turn){
    let destValue = board[moveToCoord.y][moveToCoord.x];
    
    // cannot capture own pieces
    if(getColor(destValue) == turnToColor(turn))
        return false;

    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);
    let directionX = Math.sign(moveToCoord.x - moveFromCoord.x);
    let directionY = Math.sign(moveToCoord.y - moveFromCoord.y);

    if(differenceY != 0 && differenceX != 0)
        return false;
    
    let currCoord = moveFromCoord;

    // go in the direction one step
    currCoord.x += 1 * directionX;
    currCoord.y += 1 * directionY;

    let valid = false;
    // go in the direction and check if its all clear
    while(coordValidate(currCoord) && currCoord != moveToCoord){
        if (board[currCoord.y][currCoord.x] != blank)
            break;
        currCoord.x += 1 * directionX;
        currCoord.y += 1 * directionY;
    }
    if(currCoord == moveToCoord)
        valid = true;
    return valid;
}

function queenMoveValidate(board, moveFromCoord, moveToCoord, turn){
    return bishopMoveValidate(board, moveFromCoord, moveToCoord, turn)
        || rookMoveValidate(board, moveFromCoord, moveToCoord, turn);
}

function kingMoveValidate(board, moveFromCoord, moveToCoord, turn){
    let destValue = board[moveToCoord.y][moveToCoord.x];
    
    // cannot capture own pieces
    if(getColor(destValue) == turnToColor(turn))
        return false;
    
    let differenceX = Math.abs(moveToCoord.x - moveFromCoord.x);
    let differenceY = Math.abs(moveToCoord.y - moveFromCoord.y);
    
    if (differenceX <= 1 && differenceY <= 1)
        return true;
    return false;
}