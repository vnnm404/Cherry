export let authenticateUser = (users, username, password) => {
  for (let user of users) {
    if (user.username == username && user.password == password) {
      return 1;
    }
  }
  return 0;
}

export let signupUser = (users, username, password) => {
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