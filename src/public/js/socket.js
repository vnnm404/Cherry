var socket = io('localhost:5500');

socket.on('validated', valid => {
  if (valid) {
    // play out move
  } else {
    // indicate to player that he played an invalid move
  }
});

/* 

  use socket.emit('move', move_string);
  to send move to server

*/