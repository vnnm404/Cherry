let users = [];

export let authenticateUser = (username, password) => {
  for (let user of users) {
    if (user.username == username && user.password == password) {
      return 0;
    }
  }
  return 1;
}

export let signupUser = (username, password) => {
  // check if user is created
  for (let user of users) {
    if (user.username == username) {
      return 0;
    }
  }

  // check if password is non empty
  if (password.length <= 0) {
    return -1;
  }

  users.push({
    username: username,
    password: password
  });

  return 1;
}