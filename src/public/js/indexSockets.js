let socket = io();

socket.on('signin', (valid, sessionID) => {
  console.log('signing valid: ' + valid);

  if (valid) {
    let form = document.getElementById('form');
    let successDiv = document.getElementById('auth-success');
    let failDiv = document.getElementById('auth-fail');
    let usrnDiv = document.getElementById('signup-fail-usrnmexists');
    let psdDiv = document.getElementById('signup-fail-pswdlen');
    let usernameInput = document.getElementById('username');
    let playButton = document.getElementById('play-button');

    form.classList.add('hide');

    if (failDiv.classList.contains('show')) {
      failDiv.classList.remove('show');
      failDiv.classList.add('hide');
    }
    if (usrnDiv.classList.contains('show')) {
      usrnDiv.classList.remove('show');
      usrnDiv.classList.add('hide');
    }
    if (psdDiv.classList.contains('show')) {
      psdDiv.classList.remove('show');
      psdDiv.classList.add('hide');
    }

    successDiv.innerHTML = 'Logged in as ' + usernameInput.value;
    successDiv.classList.remove('hide');
    successDiv.classList.add('show');

    playButton.innerHTML = 'Play';

    writeCookie('sessionID', sessionID, 1);
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

socket.on('signup', valid => {
  if (valid == 1) {
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');

    let username = usernameInput.value;
    let password = passwordInput.value;

    socket.emit('signin', {
      username: username,
      password: password
    });
  } else {
    let signupDiv = document.getElementById('signup-fail');
    let failDiv = document.getElementById('auth-fail');

    if (failDiv.classList.contains('show')) {
      failDiv.classList.remove('show');
      failDiv.classList.add('hide');
    }

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