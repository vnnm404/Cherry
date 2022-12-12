var socket = io();

function readCookie(name) {
  return document.cookie.split('; ').find(row => row.split('=')[0] === name);
}

sendCookie = () => {
  let sessionID = readCookie('sessionID');
  socket.emit('auth', sessionID);
};

sendCookie();

socket.on('validated', (boardState, turnState) => {
  if (my_color == 0)
    board = boardState;
  else {
    for (let i = 0; i < no_of_squares; i++) {
      for (let j = 0; j < no_of_squares; j++) {
        board[i][j] = boardState[no_of_squares - i - 1][no_of_squares - j - 1];
      }
    }
  }
  is_being_validated = false;
  if (turnState == my_color) {
    document.getElementById('status').innerText = 'Your turn';
    can_move = true;
  }
  else {
    document.getElementById('status').innerText = 'Opponent\'s turn';
    can_move = false;
  }
});

socket.on('startGame', (color, matchId) => {
  my_color = color;
  match_id = matchId;
  if (color == 0) {
    document.getElementById('status').innerText = 'Playing as white';
    can_move = true;
  }
  else {
    document.getElementById('status').innerText = 'Playing as black';
    for (let i = 0; i < no_of_squares; i++) {
      for (let j = i; j < no_of_squares; j++) {
        let temp = board[i][j];
        board[i][j] = board[no_of_squares - i - 1][no_of_squares - j - 1];
        board[no_of_squares - i - 1][no_of_squares - j - 1] = temp;
      }
    }
    for (let i = 0; i < no_of_squares / 2; i++) {
      let temp = board[i][i];
      board[i][i] = board[no_of_squares - i - 1][no_of_squares - i - 1];
      board[no_of_squares - i - 1][no_of_squares - i - 1] = temp;
    }
  }
});

socket.on('checkMate', turn => {
  can_move = false;
  if(my_color == turnToColor(turn)){
    document.getElementById('status').innerText = 'Check Mate you lost! 😢';
  }
  else
    document.getElementById('status').innerText = 'Check Mate you Won! 🎉';
});