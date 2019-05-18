const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const cookie = require("cookie");

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const gameEngine = require(__dirname + "/game-logic/gameEngine.js");
const gameData = require(__dirname + "/game-logic/DATA.js");

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ PATHS ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

const upload = multer({ dest: __dirname + "/assets/" }); // Set file upload destination
const imagePath = "/assets/";
const url =
   "mongodb+srv://admin:admin@samurai-murit.mongodb.net/test?retryWrites=true"; // URI for remote database!

app.use("/assets", express.static(__dirname + "/assets"));
app.use(cookieParser());

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ STORAGE ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

let usersCollection;
let sessionsCollection;
let lobbiesCollection;
let gamesCollection;
let chatsCollection;
let gameIdAssociation; // in database as collection "GameIdAssociation"

//Connection to DB, do not close!
(async function initDB() {
   await MongoClient.connect(url, { useNewUrlParser: true }, (err, allDbs) => {
      console.log(
         "-----------------------Database Initialised-----------------------"
      );
      // Add option useNewUrlParser to get rid of console warning message
      if (err) throw err;
      finalProjectDB = allDbs.db("FinalProject-DB");
      usersCollection = finalProjectDB.collection("Users");
      sessionsCollection = finalProjectDB.collection("Sessions");
      lobbiesCollection = finalProjectDB.collection("Lobbies");
      chatsCollection = finalProjectDB.collection("Chats");
   });
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ GENERAL FUNCTIONS ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//Generates random Id
const generateId = () => {
   return "" + Math.floor(Math.random() * 100000000000);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ SIGNUP, LOGIN, LOGOUT & AUTOLOGIN  ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//************ SIGNUP ************//
app.post("/signup", upload.none(), function (req, res) {
   //Check user collection in remote database to see if username already exists
   usersCollection
      .find({ username: req.body.username })
      .toArray((err, result) => {
         if (result[0] !== undefined) {
            // If database return any entry, user exists already!
            console.log("DB: Be yourself! Try something original...");
            res.send(JSON.stringify({ success: false }));
            return;
         }
         const newUser = {
            //userId: generateId(), use _id instead
            username: req.body.username,
            password: req.body.password,
            country: req.body.country,
            wins: 0,
            losses: 0,
            points: 0,
            profilePic: "/assets/default-user.jpg",
            status: "playing Super Chess II",
            bio: "Super Chess II player",
            army: gameData.defaultArmy,
            joinedDate: req.body.joinedDate
         };
         usersCollection.insertOne(newUser, (err, result) => {
            //Add new user to remote database
            if (err) throw err;
            console.log(
               `DB: Successfully inserted user ${
               req.body.username
               } into Users collection`
            );

            const newSessionId = generateId();
            sessionsCollection.insertOne(
               { sessionId: newSessionId, user: req.body.username },
               (err, result) => {
                  if (err) throw err;
                  console.log("DB: Successfully added entry to Sessions collection");
                  res.cookie("sid", newSessionId);
                  res.send(
                     JSON.stringify({ success: true, username: req.body.username })
                  );
               }
            );
         });
      });
});

//************ LOGIN ************//
app.post("/login", upload.none(), function (req, res) {
   const { username: enteredName, password: enteredPass } = req.body;
   // Check remote users collection in db
   usersCollection.find({ username: enteredName }).toArray((err, result) => {
      console.log("DB: Retrieving expected password for user");
      if (err) throw err;
      if (result[0] === undefined) {
         console.log("DB: User not found");
         res.send(JSON.stringify({ success: false }));
         return;
      }
      const expectedPass = result[0].password;
      if (enteredPass !== expectedPass) {
         // Check that password matches
         console.log("Passwords did not match!");
         res.send(JSON.stringify({ success: false }));
         return;
      }
      const newSessionId = generateId(); // Generate random number for sid cookie
      sessionsCollection.insertOne(
         { sessionId: newSessionId, user: enteredName },
         (err, result) => {
            if (err) throw err;
            console.log("DB: Successfully added entry to Sessions collection");
         }
      );
      console.log(`Logging in user ${enteredName}`);
      res.cookie("sid", newSessionId); // Send back set-cookie and successful response
      res.send(JSON.stringify({ success: true, username: enteredName }));
   });
});

//************ LOGOUT ************//
app.get("/logout", upload.none(), function (req, res) {
   console.log("Logging out...");
   sessionsCollection.deleteOne(
      { sessionId: req.cookies.sid },
      (err, result) => {
         // Remove from remote database
         if (err) throw err;
         console.log("DB: Successfully removed entry from sessions collection!");
      }
   );
   res.send(JSON.stringify({ success: true }));
});

//************ AUTOLOGIN ************//

app.get("/verify-cookie", function (req, res) {
   if (sessionsCollection === undefined) {
      return;
   }

   sessionsCollection
      .find({ sessionId: req.cookies.sid })
      .toArray((err, result) => {
         if (err) throw err;
         //result is an array, we must check it elements with [ ]
         if (result[0] === undefined || result.length === 0) {
            //MUST send back success: false is username is not defined
            res.send(JSON.stringify({ success: false }));
            return;
         }
         // console.log("Username found in db from sessionId: ", result[0].user)
         res.send(JSON.stringify({ success: true, username: result[0].user }));
      });
});
//***************************GET USER PROFILE*************************************8 */
app.post("/get-user-profile", upload.none(), function (req, res) {
   if (req.body.username === undefined) {
      res.send({ success: false });
   }
   if (usersCollection === undefined) {
      res.send({ success: false });
   }
   let reqUsername = req.body.username;
   usersCollection.find({ username: reqUsername }).toArray((err, result) => {
      console.log("user profile lookup");
      console.log(result);
      let userProfile = {
         username: result[0].username,
         statusMessage: result[0].statusMessage,
         bio: result[0].bio,
         profilePic: result[0].profilePic
      };
      if (userProfile.profilePic === undefined) {
         userProfile.profilePic = "/assets/default-user.png";
      }
      if (userProfile.statusMessage === undefined) {
         userProfile.statusMessage = "";
      }
      if (userProfile.bio === undefined) {
         userProfile.bio = "";
      }
      console.log("user profile lookup");
      console.log(userProfile);
      userProfile = JSON.stringify(userProfile);
      res.send(userProfile);
   });
});
//***************************CHANGE USER PROFILE**************************************/
app.post("/change-user-profile", upload.none(), function (req, res) {
   console.log(req.cookies.sid);
   if (req.cookies.sid === undefined) {
      return { success: false };
   }
   let newInfo = req.body;
   sessionsCollection
      .find({ sessionId: req.cookies.sid })
      .toArray((err, result) => {
         console.log(result[0]);
         usersCollection
            .find({ username: result[0].user })
            .toArray((err, result) => {
               console.log(result[0]);
               usersCollection.update(
                  { _id: result[0]._id },
                  {
                     $set: {
                        statusMessage: newInfo.statusMessage,
                        bio: newInfo.bio,
                        profilePic: newInfo.profilePic
                     }
                  },
                  (err, result) => {
                     if (err) throw err;
                     console.log(`DB: editing user information: ${"username"}`);
                     res.send(JSON.stringify({ success: true }));
                  }
               );
            });
      });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ ARMY AND MAP EDITOR ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/get-player-army", upload.none(), (req, res) => {
  if (req.cookies.sid === undefined) {
    res.send({ success: false, err: "not logged in" });
  }
  sessionsCollection
    .find({ sessionId: req.cookies.sid })
    .toArray((err, result) => {
      usersCollection
        .find({ username: result[0].user })
        .toArray((err, result) => {
          res.send(JSON.stringify(result[0].army));
        });
    });
});

app.post("/set-army", upload.none(), (req, res) => {
  if (req.cookies.sid === undefined) {
    res.send({ success: false, err: "not logged in" });
  }
  let newArmy = req.body.armyString;
  newArmy = newArmy;
  if (typeof newArmy === "string") {
    newArmy = newArmy.split("_");
    if (newArmy.length === 3) {
      newArmy = newArmy.map(row => {
        return row.split(" ");
      });
    }
  }
  console.log(newArmy);
  let setNewArmy = [];
  for (let row = 0; row < 3; row++) {
    let arrRow = [];
    for (let col = 0; col < 8; col++) {
      if (newArmy[row]) arrRow.push(newArmy[row][col]);
    }
    setNewArmy.push(arrRow);
  }
  console.log(setNewArmy);
  sessionsCollection
    .find({ sessionId: req.cookies.sid })
    .toArray((err, result) => {
      if (result !== undefined) {
        usersCollection
          .find({ username: result[0].user })
          .toArray((err, result) => {
            usersCollection.update(
              { _id: result[0]._id },
              {
                $set: {
                  army: setNewArmy
                }
              },
              (err, result) => {
                if (err) throw err;
                console.log(`DB: editing user information: ${"username"}`);
                res.send(JSON.stringify({ success: true }));
              }
            );
          });
      }
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ LEADERBOARD & LOBBY RELATED ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//************ GET LEADERBOARD ************//
app.get("/get-leaderboard", upload.none(), function (req, res) {
   console.log("Getting leaderboard...");
   usersCollection
      .find()
      .sort({ wins: -1, losses: 1 })
      .toArray((err, result) => {
         if (err) throw err;
         // console.log("Leaderboard:", result);
         res.send(JSON.stringify(result));
      });
});

//************ CREATE LOBBY ************//
app.post("/create-lobby", upload.none(), function (req, res) {
   //Lobby to be inserted
   let newLobbyId = generateId();
   const newLobby = {
      _id: newLobbyId,
      playerOne: req.body.currentUser,
      playerTwo: "",
      readyPlayerOne: false,
      readyPlayerTwo: false,
      creationTime: new Date().toLocaleString()
   };

   //Insert lobby into the database
   lobbiesCollection.insertOne(newLobby, (err, result) => {
      if (err) {
         res.send(JSON.stringify({ success: false }));
         throw err;
      }
      console.log(
         `DB: Successfully added lobby for ${
         newLobby.playerOne
         } into lobby collection`
      );
      console.log(`New LobbyId: ${newLobby._id}`);
   });

   //We are now creating the lobby chat right after creating the lobby.
   const newLobbyChat = {
      _id: newLobbyId,
      messageList: [],
      creator: req.body.currentUser,
      creationTime: new Date().toLocaleString()
   };

   //Insert lobby chat into the database
   chatsCollection.insertOne(newLobbyChat, (err, result) => {
      if (err) {
         res.send(JSON.stringify({ success: false }));
         throw err;
      }
      console.log(
         `DB: Successfully added lobby chat created by ${
         newLobbyChat.currentUser
         } into lobby chat collection`
      );
      console.log(
         `The added chats ID, ${newLobbyChat._id}, is the same as the LobbyId, ${
         req.body.lobbyId
         }.`
      );

      //The newLobby._id will also be used for the LobbyChat id
      res.send(JSON.stringify({ success: true, lobbyId: newLobby._id }));
   });
});

//************ GET LOBBY CHAT ************//
// app.post("/get-lobby-chat", upload.none(), function(req, res) {
//    const currentLobbyId = req.body.currentLobbyId;

//    chatsCollection.find({ _id: currentLobbyId }).toArray((err, result) => {
//      if (err) throw err;
//      if (result[0] === undefined) {
//        res.send(JSON.stringify({ success: false }));
//        return;
//      }

//      //Send back lobby object in response
//      res.send(JSON.stringify(result[0]));
//    });
//  });

//************ GET LOBBIES ************//
app.get("/get-lobbies", upload.none(), function (req, res) {
   if (lobbiesCollection === undefined) {
      res.send(JSON.stringify({ success: false }));
      return;
   }

   console.log("Getting lobbies...");
   lobbiesCollection.find({}).toArray((err, result) => {
      if (err) throw err;
      // console.log("Lobbies:", result);
      res.send(JSON.stringify(result));
   });
});

//************ JOIN LOBBY ************//
app.post("/join-lobby", upload.none(), function (req, res) {
   const { lobbyId, currentUser } = req.body;
   console.log("Trying to join lobby with id ", lobbyId);
   lobbiesCollection.find({ _id: lobbyId }).toArray((err, result) => {
      if (result[0] === undefined) {
         console.log("Error joining lobby!");
         res.send(JSON.stringify({ success: false }));
         return;
      }

      if (result[0].playerTwo !== "") {
         console.log("No space in this lobby!");
         res.send(JSON.stringify({ success: false }));
         return;
      }

      lobbiesCollection.update(
         { _id: lobbyId },
         { $set: { playerTwo: currentUser } },
         (err, result) => {
            if (err) throw err;
            console.log(`DB: Adding user to lobbyId: ${lobbyId}`);
            res.send(JSON.stringify({ success: true }));
         }
      );
   });
});

//************ USER READY ************//
app.post("/user-ready", upload.none(), function (req, res) {
   const { lobbyId, currentUser } = req.body;

   console.log(
      `|Ready| button pressed by "${currentUser}" for lobby with id ${lobbyId}`
   );

   lobbiesCollection.find({ _id: lobbyId }).toArray((err, result) => {
      if (
         result[0].playerTwo !== currentUser &&
         result[0].playerOne !== currentUser
      ) {
         console.log(
            `Error: "${currentUser}" is not registered as playerOne or playerTwo`
         );
         res.send(JSON.stringify({ success: false }));
         return;
      }

      let ready;
      switch (currentUser) {
         case result[0].playerOne:
            console.log(`User "${currentUser}" is registered as playerOne`);
            ready = !result[0].readyPlayerOne;
            lobbiesCollection.update(
               { _id: lobbyId },
               { $set: { readyPlayerOne: ready } },
               (err, result) => {
                  if (err) throw err;
                  console.log(`DB: Updating playerOne ready to ${ready}`);
                  res.send(JSON.stringify({ success: true, user: 1 }));
               }
            );
            break;

         case result[0].playerTwo:
            console.log(`User "` + currentUser + `" is registered as playerTwo`);
            ready = !result[0].readyPlayerTwo;
            lobbiesCollection.updateOne(
               { _id: lobbyId },
               { $set: { readyPlayerTwo: ready } },
               (err, result) => {
                  if (err) throw err;
                  console.log(`DB: Updating playerTwo ready to ${ready}`);
                  res.send(JSON.stringify({ success: true, user: 2 }));
               }
            );
            break;

         default:
            console.log(
               "Error, current user is not registered as playerOne or playerTwo"
            );
            res.send(JSON.stringify({ success: false }));
      }
   });
});

//************ GET CURRENT LOBBY ************//
app.post("/get-current-lobby", upload.none(), function (req, res) {
   const currentLobbyId = req.body.currentLobbyId;

   lobbiesCollection.find({ _id: currentLobbyId }).toArray((err, result) => {
      if (err) throw err;
      if (result[0] === undefined) {
         res.send(JSON.stringify({ success: false }));
         return;
      }
      //Send back lobby object in response
      res.send(JSON.stringify(result[0]));
   });
});

//_____________GAME TEST CODE____________________-
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
//____________END OF GAME TEST CODE___________________

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ SOCKET IO STUFF ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

io.on("connection", socket => {
   console.log("Connected to socket");

   socket.on("join", currentLobbyId => {
      //After receiving join event with lobbyId, set the room for the client
      console.log("Connecting client to socket room: ", currentLobbyId);
      socket.join(currentLobbyId);
   });

   socket.on("refresh-lobby", currentLobbyId => {
      console.log("Socket: Refresh lobby listener called");

      lobbiesCollection.find({ _id: currentLobbyId }).toArray((err, result) => {
         if (err) throw err;
         if (result[0] === undefined) {
            return;
         }
         //Send back lobby object in socket
         io.in(currentLobbyId).emit("lobby-data", result[0]);
      });
   });
   socket.on("refresh-leaderboard-data", () => {
      console.log("REFRESHING LEADERBOARD");
      usersCollection
         .find()
         .sort({ wins: -1, losses: 1 })
         .toArray((err, result) => {
            if (err) throw err;
            console.log("Leaderboard:", result);
            io.emit("leaderboard-data", result);
         });
   });
   socket.on("refresh-lobby-list", () => {
      console.log("REFRESHING  LOBBY LIST");
      lobbiesCollection.find().toArray((err, result) => {
         // console.log("Lobbies from socket: ", result)
         io.emit("lobby-list-data", result);
      });
   });

   ///bookmark
   socket.on("refresh-lobby-chat", lobbyId => {
      chatsCollection.find({ _id: lobbyId }).toArray((err, result) => {
         if (err) throw err;
         if (result[0] === undefined) {
            return;
         }
         console.log("REFRESHING LOBBYCHAT.");
         //result[0] is a chat object that has messageList
         io.in(lobbyId).emit("lobby-chat", result[0].messageList);
      });
   });

   socket.on("sent-message", data => {
      console.log("!!!!!!!!!!!!!!My data", data);
      console.log(Object.values(data));
      let messageToBeAdded = data.message;

      chatsCollection.updateOne(
         { _id: data.lobbyId },
         { $push: { messageList: { ...messageToBeAdded } } },
         (err, result) => {
            if (err) throw err;
            console.log(`DB: Updating message list for chat id: ${data.lobbyId}`);

            //THIS MIGHT WORK INSTEAD OF BELOW, TRY WHEN CHAT IS WORKING: io.emit("refresh-lobby-chat", data.lobbyId);
            chatsCollection.find({ _id: data.lobbyId }).toArray((err, result) => {
               if (err) throw err;
               if (result[0] === undefined) {
                  return;
               }
               io.in(data.lobbyId).emit("lobby-chat", result[0].messageList);
            });
         }
      );
   });

   socket.on("leave-lobby", data => {
      lobbiesCollection.find({ _id: data.lobbyId }).toArray((err, result) => {
         //If playerOne is alone in lobby, remove it from db!
         if (
            result[0].playerOne === data.currentUser &&
            result[0].playerTwo === ""
         ) {
            lobbiesCollection.remove({ _id: data.lobbyId });
            lobbiesCollection.find().toArray((err, result) => {
               io.emit("lobby-list-data", result);
            });
         }

         //If playerTwo is alone in lobby, remove it as well!
         if (
            result[0].playerTwo === data.currentUser &&
            result[0].playerOne === ""
         ) {
            lobbiesCollection.remove({ _id: data.lobbyId });
            lobbiesCollection.find().toArray((err, result) => {
               io.emit("lobby-list-data", result);
            });
         }

         //If playerOne leaves and is not alone, update lobby and emit!
         if (
            result[0].playerOne === data.currentUser &&
            result[0].playerTwo !== ""
         ) {
            lobbiesCollection.update(
               { _id: data.lobbyId },
               { $set: { playerOne: "" } },
               (err, result) => {
                  if (err) throw err;
                  console.log(`DB: Removing player1 from lobbyId: ${data.lobbyId}`);

                  lobbiesCollection
                     .find({ _id: data.lobbyId })
                     .toArray((err, result) => {
                        io.in(data.lobbyId).emit("lobby-data", result[0]);
                        lobbiesCollection.find().toArray((err, result) => {
                           io.emit("lobby-list-data", result);
                        });
                     });
               }
            );
         }

         //If playerTwo leaves and is not alone, also update lobby and emit!
         if (
            result[0].playerTwo === data.currentUser &&
            result[0].playerOne !== ""
         ) {
            lobbiesCollection.update(
               { _id: data.lobbyId },
               { $set: { playerTwo: "" } },
               (err, result) => {
                  if (err) throw err;
                  console.log(`DB: Removing player2 from lobbyId: ${data.lobbyId}`);

                  lobbiesCollection
                     .find({ _id: data.lobbyId })
                     .toArray((err, result) => {
                        io.in(data.lobbyId).emit("lobby-data", result[0]);
                        lobbiesCollection.find().toArray((err, result) => {
                           io.emit("lobby-list-data", result);
                        });
                     });
               }
            );
         }
      });
   });

   //_______________________GAME________________________________________________

   socket.on("join-game", lobbyId => {
      console.log(
         "_________________________________________________________________________________"
      );
      console.log("join game recieved: ", lobbyId);
      socket.join(lobbyId);
      console.log("-- game INST --");
      console.log(gameEngine.getGameInst(lobbyId));
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
          usersCollection
            .find({ username: originLobby.playerOne })
            .toArray((err, result) => {
              let userOne = result[0];
              usersCollection
                .find({ username: originLobby.playerTwo })
                .toArray((err, result) => {
                  let userTwo = result[0];
                  let newGameId = gameEngine.createGameInst(
                    userOne.username,
                    userTwo.username,
                    userOne.army,
                    userTwo.army,
                    lobbyId
                  );
                  UserGameAssoc[userOne.username] = newGameId;
                  UserGameAssoc[userTwo.username] = newGameId;
                  console.log("new Game Id: ", newGameId);
                  io.in(lobbyId).emit("game-created", "game started");
                });
            });
        });
      } else {
         io.in(lobbyId).emit("game-created", "game started");
      }
   });

   socket.on("get-game-data", message => {
      console.log("get data request");
      console.log(message.gameId + "");
      let gameData = gameEngine.getGameInst(message.gameId + "");
      if (gameData !== undefined) {
         console.log(gameData.map[0].actorId);
      } else {
         console.log("game is undefined in get-game-data");
      }
      io.in(message.gameId).emit("game-data", gameData);
   });

   socket.on("game-input", input => {
      console.log("user assoc");
      console.log(UserGameAssoc);
      console.log("userCookie: ", socket.request.headers.cookie);
      if (socket.request.headers.cookie === undefined) {
         socket.emit({ success: false });
         return;
      }
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
            let gameId = UserGameAssoc[result[0].user];
            let changes = gameEngine.handlerUserInput({
               gameId: gameId,
               action: input,
               team: result[0].user
            });
            io.in(gameId).emit("game-state-change", changes);
         });
   });

   //_______________________END OF GAME________________________________________________

   //_______________________DANIELSPERIMENTATION________________________________________________
   //************ USER READY ************//
   socket.on("user-ready", ({ room, currentUser }) => {
      let lobbyId = room;
      console.log(
         `|Ready| button pressed by "` + currentUser + `" for lobby with id`,
         lobbyId
      );
      lobbiesCollection.find({ _id: lobbyId }).toArray((err, result) => {
         if (
            result[0].playerTwo !== currentUser &&
            result[0].playerOne !== currentUser
         ) {
            console.log(
               `Error, "` +
               currentUser +
               `" is not registered as playerOne or playerTwo`
            );
            return;
         }

         let roomDataToBePassed = results[0];
         let ready;
         switch (currentUser) {
            case result[0].playerOne:
               console.log(`User "` + currentUser + `" is registered as playerOne`);
               ready = !result[0].readyPlayerOne;
               lobbiesCollection.update(
                  { _id: lobbyId },
                  { $set: { readyPlayerOne: ready } },
                  (err, result) => {
                     if (err) throw err;
                     console.log(`DB: Updating playerOne ready to ${ready}`);
                     roomDataToBePassed.readyPlayerOne = ready;
                  }
               );
               break;
            case result[0].playerTwo:
               console.log(`User "` + currentUser + `" is registered as playerTwo`);
               ready = !result[0].readyPlayerTwo;
               lobbiesCollection.updateOne(
                  { _id: lobbyId },
                  { $set: { readyPlayerTwo: ready } },
                  (err, result) => {
                     if (err) throw err;
                     console.log(`DB: Updating playerTwo ready to ${ready}`);
                     roomDataToBePassed.readyPlayerTwo = ready;
                  }
               );
               break;
            default:
               console.log(
                  "Error, current user is not registered as playerOne or playerTwo"
               );
         }
      });

      socket.in(room).emit("ready", roomDataToBePassed);
   });

   ////////////////////////////////
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ JAQUES STUFF ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

const { spawn } = require("child_process");
const chokidar = require("chokidar");

let pollServer = `let __version = undefined
let delay = t => new Promise((res, rej) => setTimeout(() => res(), t))
let checkVersion = async () => {
    await fetch('/__version')
        .then(x => x.text())
        .then(v => {
            __version = v
        })
        
    while (true) {
        await delay(300)
        try {
            let x = await fetch('/__version')
            let newVersion = await x.text()
            if (__version !== newVersion) {
               location.reload();
            }
        } catch (err) { }
    }
}
checkVersion()`;

//let generateId = () => "" + Math.floor(Math.random() * 10000000000);
let __version = generateId();
app.get("/__version", (req, res) => {
   res.send(__version);
});

chokidar
   .watch(__dirname + "/build", { ignored: /(^|[\/\\])\../ })
   .on("all", (event, path) => {
      webpackError = undefined;
      __version = generateId();
   });

let webpackError = undefined;
app.all("/*", (req, res, next) => {
   if (webpackError) {
      res.send(
         "<h4>" + webpackError + "</h4><script>" + pollServer + "</script>"
      );
   } else {
      next();
   }
});

app.use("/", express.static("build"));
app.all("/*", (req, res) => {
   res.sendFile(__dirname + "/build/index.html");
});
let counter = 0;
let setup = async () => {
   const cmd = /^win/.test(process.platform) ? "npx.cmd" : "npx";
   let webpack = spawn(cmd, ["webpack", "--watch", "--display", "errors-only"]);
   webpack.stdout.on("data", data => {
      webpackError = data.toString();
   });
   http.listen(4000, "0.0.0.0", () => {
      console.log("Running on port 4000 , 0.0.0.0");
   });
};
setup();