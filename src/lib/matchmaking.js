/*
  match{
    matchId,
    player1Socket,
    player2Socket,
    boardState,
    turnState,
    private
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

export function initMatch(id, playerSocket) {
  return {
    matchId: id,
    player1Socket: playerSocket,
    player2Socket: null,
    boardState: initBoardState.map(function (arr) {
      return arr.slice();
    }),
    turnState: 0,
    private: false
  }
}

export function findMatch(playerSocket) {
  for (let i = 0; i < matches.length; i++) {
    if (matches[i].private)
      continue;

    if (matches[i].player2Socket == null) {
      matches[i].player2Socket = playerSocket;
      startMatch(matches[i].matchId);
      return i;
    }
  }
  matches.push(initMatch(matches.length, playerSocket));
  return matches.length - 1;
}

export function findPrivateMatch(playerSocket, matchId) {
  for(let match of matches) {
    if (match.matchId === matchId && match.private) {
      if (match.player1Socket) {
        match.player2Socket = playerSocket;
        startMatch(matchId);
        return 1;
      } else {
        match.player1Socket = playerSocket;
        return 1;
      }
    }
  }
  return 0;
}

function startMatch(i) {
  matches[i].player1Socket.emit('startGame', 0, i);
  matches[i].player2Socket.emit('startGame', 1, i);
}