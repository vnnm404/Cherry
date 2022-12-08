submitLoginDetails = event => {
  let usernameInput = document.getElementById('username');
  let passwordInput = document.getElementById('password');

  let username = usernameInput.value;
  let password = passwordInput.value;

  socket.emit('auth', {
    username: username,
    password: password
  });
};