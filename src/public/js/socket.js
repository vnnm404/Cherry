var socket = io();

socket.on('validated', (boardState, turnState) => {
  if(my_color == 0)
    board = boardState;
  else{
    for(let i = 0; i < no_of_squares; i++){
      for(let j = 0; j < no_of_squares; j++){
        board[i][j] = boardState[no_of_squares - i - 1][no_of_squares - j - 1];
      }
    }
  }
  is_being_validated = false;
  if (turnState == my_color){
    document.getElementById('status').innerText = 'Your turn';
    can_move = true;
  }
  else{
    document.getElementById('status').innerText = 'Opponent\'s turn';
    can_move = false;
  }
});

socket.on('startGame', (color, matchId) =>{
  my_color = color;
  match_id = matchId;
  if(color == 0){
    document.getElementById('status').innerText = 'Playing as white';
    can_move = true;
  }
  else{
    document.getElementById('status').innerText = 'Playing as black';
    for(let i = 0; i < no_of_squares; i++){
      for(let j = i; j < no_of_squares; j++){
        let temp = board[i][j];
        board[i][j] = board[no_of_squares - i - 1][no_of_squares - j - 1];
        board[no_of_squares - i - 1][no_of_squares - j - 1] = temp;
      }
    }
      for(let i = 0; i < no_of_squares/2; i++){
          let temp = board[i][i];
          board[i][i] = board[no_of_squares - i - 1][no_of_squares - i - 1];
          board[no_of_squares - i - 1][no_of_squares - i - 1] = temp;
      }
  }
});

socket.on('auth', resp => {
  console.log('auth back: ' + resp);

  if (resp) {
    let form = document.getElementById('form');
    let successDiv = document.getElementById('auth-success');
    let failDiv = document.getElementById('auth-fail');

    form.classList.add('hide');

    if (failDiv.classList.contains('show')) {
      failDiv.classList.remove('show');
      failDiv.classList.add('hide');
    }

    successDiv.classList.remove('hide');
    successDiv.classList.add('show');
  } else {
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');
    let failDiv = document.getElementById('auth-fail');

    usernameInput.value = "";
    passwordInput.value = "";

    failDiv.classList.remove('hide');
    failDiv.classList.add('show');
  }
});

/* 

  use socket.emit('move', move_string);
  to send move to server

*/

socket.on('signup', valid => {
  if (valid == 1) {
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');

    let username = usernameInput.value;
    let password = passwordInput.value;

    socket.emit('auth', {
      username: username,
      password: password
    });
  } else {
    let signupDiv = document.getElementById('signup-fail');
    signupDiv.classList.remove('hide');
    signupDiv.classList.add('show');

    if (valid == 0) {
      let usrnDiv = document.getElementById('signup-fail-usrnmexists');
      usrnDiv.classList.remove('hide');
      usrnDiv.classList.add('show');
    } else if (valid == -1) {
      let psdDiv = document.getElementById('signup-fail-pswdlen');
      psdDiv.classList.remove('hide');
      psdDiv.classList.add('show');
    }
  }
});