var socket = io('localhost:5500');

socket.on('validated', valid => {
  if (valid) {
    // play out move
  } else {
    // indicate to player that he played an invalid move
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