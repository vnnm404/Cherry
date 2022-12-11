import crypto from 'crypto';

let generateSessionID = () => {
  return crypto.randomBytes(16).toString('hex');
};

export let authenticateUser = (users, username, password) => {
  for (let user of users) {
    if (user.username == username && user.password == password) {
      let session = {
        id: generateSessionID(),
        expires: new Date().toGMTString()
      }
      user.sessions.push(session);
      return [1, session.id];
    }
  }
  return [0, null];
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
    password: password,
    sessions: []
  });

  return 1;
}