let UserGameAssoc = {};
let army = [
  [
    "knight",
    "knight",
    "archer",
    "catapult",
    "catapult",
    "archer",
    "knight",
    "knight"
  ],
  [
    "legionary",
    "pawn",
    "legionary",
    "pawn",
    "pawn",
    "legionary",
    "pawn",
    "legionary"
  ]
];

socket.on("join-game", lobbyId => {
  console.log(
    "_________________________________________________________________________________"
  );
  console.log("join game recieved: ", lobbyId);
  socket.join(lobbyId);
  if (gameEngine.getGameInst(lobbyId) === undefined) {
    console.log("creating game instance: ", lobbyId);
    if (lobbyId === undefined) {
      console.log("no lobby id");
      return;
    }

    //_________________________
    if (lobbiesCollection === undefined) {
      console.log("collection undefined");
      return;
    }
    lobbiesCollection.find({ _id: lobbyId }).toArray((err, result) => {
      let originLobby = result[0];
      console.log("-- origin lobby --");
      console.log(originLobby[0]);
      if (originLobby !== undefined) {
        console.log("-- duplicate --");
        console.log(originLobby[0]);

        let newGameId = gameEngine.createGameInst(
          originLobby.playerOne,
          originLobby.playerTwo,
          army,
          army,
          lobbyId
        );
        UserGameAssoc[originLobby.playerOne] = newGameId;
        UserGameAssoc[originLobby.playerTwo] = newGameId;
        console.log("new Game Id: ", newGameId);
      } else {
        console.log("origin Lobby undefined");
      }
      //_________________________
    });
  }
  console.log("game in session, sending game");
  io.in(lobbyId).emit("game-data", gameEngine.getGameInst(lobbyId + ""));
});

socket.on("get-game-data", message => {
  console.log("get data request");
  console.log(message.gameId + "");

  let gameData = gameEngine.getGameInst(message.gameId + ""); //temporary gameId for testing, use collection later...
  if (gameData !== undefined) {
    console.log(gameData.map[0].actorId);
  } else {
    console.log("game is undefined in get-game-data");
  }
  io.emit("game-data", gameData);
});

socket.on("game-input", input => {
  console.log("user assoc");
  console.log(UserGameAssoc);
  console.log("userCookie: ", socket.request.headers.cookie);
  let usercookie = cookie.parse(socket.request.headers.cookie);
  console.log("userCookie: ", usercookie.sid);
  sessionsCollection
    .find({ sessionId: usercookie.sid })
    .toArray((err, result) => {
      if (err) throw err;
      //result is an array, we must check it elements with [ ]
      if (result[0] === undefined || result.length === 0) {
        console.log("invalid cookie - game-input");
        return;
      }
      console.log("input from user: ", result[0].user);

      let changes = gameEngine.handlerUserInput({
        gameId: UserGameAssoc[result[0].user],
        action: input,
        team: result[0].user
      });
      socket.emit("game-state-change", changes);
    });
});
