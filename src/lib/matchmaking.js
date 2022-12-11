/*
  match{
    matchId,
    player1Socket,
    player2Socket,
    boardState,
    turnState
  }
*/
export let matches = [];


const initBoardState = [
  [12, 14, 13, 11, 10, 13, 14, 12],
  [9, 9, 9, 9, 9, 9, 9, 9],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [4, 6, 5, 3, 2, 5, 6, 4]];

function initMatch(id, playerSocket) {
  return {
    matchId: id,
    player1Socket: playerSocket,
    player2Socket: null,
    boardState: initBoardState.map(function (arr) {
      return arr.slice();
    }),
    turnState: 0
  }
}

export function findMatch(playerSocket) {
  for (let i = 0; i < matches.length; i++) {
    if (matches[i].player2Socket == null) {
      matches[i].player2Socket = playerSocket;
      startMatch(i);
      return i;
    }
  }
  matches.push(initMatch(matches.length, playerSocket));
  return matches.length - 1;
}

function startMatch(i) {
  matches[i].player1Socket.emit('startGame', 0, i);
  matches[i].player2Socket.emit('startGame', 1, i);
}