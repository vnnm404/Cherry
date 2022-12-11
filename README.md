# Cherry

An online multiplayer (2-player) chess game.

### Run instructions

> $ node src/index.js

### board

```
 x/j  0   1   2   3   4   5   6   7
 y/i+---+---+---+---+---+---+---+---+
  0 |   |   |   |   |   |   |   |   |   BLACK SIDE
    +---+---+---+---+---+---+---+---+
  1 |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+
  2 |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+
  3 |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+
  4 |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+
  5 |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+
  6 |   |   |   |   |   |   |   |   |
    +---+---+---+---+---+---+---+---+
  7 |   |   |   |   |   |   |   |   |  WHITE SIDE
    +---+---+---+---+---+---+---+---+
      
```

## TODOs
- [X] Client to Server communication
- [ ] Validation of moves
- [ ] Sign up and Login
- [ ] Player1 - server - Player2 communication
- [ ] matchmaking
- [ ] generating links for matches
- [ ] Make it pretty

#### Chess related
- [X] valid moves in free board
- [ ] ignoring check
- [ ] king safety (movement of pinned pieces)
- [ ] pawn promotion
- [ ] 50 move draw
- [ ] castling
- [ ] enpassentwdfssf