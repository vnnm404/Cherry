submitLoginDetails = event => {
  let usernameInput = document.getElementById('username');
  let passwordInput = document.getElementById('password');

  let username = usernameInput.value;
  let password = passwordInput.value;

  socket.emit('signin', {
    username: username,
    password: password
  });
};

submitSignUpDetails = event => {
  let usernameInput = document.getElementById('username');
  let passwordInput = document.getElementById('password');

  let username = usernameInput.value;
  let password = passwordInput.value;

  socket.emit('signup', {
    username: username,
    password: password
  });
};