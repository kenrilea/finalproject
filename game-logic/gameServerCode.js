/*

to avoid server conflicts copy paste this code into the line
above the following line of code

io.in(gameId).emit("game-state-change", changes);


*/

console.log("--- changes ---");
console.log(changes);
let isGameOver = gameEngine.checkGameOver(gameId);
if (isGameOver.success === false) {
  console.log("game in session");
}
if (isGameOver.success === true) {
  let win = [0, 0];
  let loss = [0, 0];
  isGameOver.players.forEach((player, index) => {
    if (isGameOver.winner === player) {
      win[index] = 1;
    }
    if (isGameOver.winner !== player) {
      loss[index] = 1;
    }
    delete UserGameAssoc[player];
  });
  usersCollection
    .find({ username: isGameOver.players[0] })
    .toArray((err, result) => {
      console.log(result[0]);
      let newUserData = result[0];
      newUserData = {
        ...newUserData,
        wins: newUserData.wins + win[0],
        losses: newUserData.losses + loss[0]
      };
      usersCollection.updateOne(
        { _id: result[0]._id },
        {
          $set: {
            wins: newUserData.wins + win[0],
            losses: newUserData.losses + loss[0]
          }
        },
        (err, result) => {
          if (err) throw err;
          console.log(`DB: editing user information: ${"username"}`);
        }
      );
    });
  usersCollection
    .find({ username: isGameOver.players[1] })
    .toArray((err, result) => {
      console.log(result[0]);
      let newUserData = result[0];
      usersCollection.updateOne(
        { _id: result[0]._id },
        {
          $set: {
            wins: newUserData.wins + win[1],
            losses: newUserData.losses + loss[1]
          }
        },
        (err, result) => {
          if (err) throw err;
          console.log(`DB: editing user information: ${"username"}`);
        }
      );
    });
}
//kenton
