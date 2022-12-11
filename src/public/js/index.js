play = () => {
  window.location.href = '/game';
};

function writeCookie(name, value, days) {
  let date = new Date();
  let expires = "";

  if (days) {
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }

  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  return document.cookie.split('; ').find(row => row.split('=')[0] === name);
}