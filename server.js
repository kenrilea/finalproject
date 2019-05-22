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
let newsCollection;

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
    newsCollection = finalProjectDB.collection("News");
  });
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ GENERAL FUNCTIONS ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//Generates random Id
const generateId = () => {
  return "" + Math.floor(Math.random() * 100000000000);
};

const lobbyPurge = (username, newLobbyId) => {
  try {
    console.log("OLD LOBBY PURGE FOR: " + username);
    lobbiesCollection.deleteMany({
      $or: [{ playerOne: username }, { playerTwo: username }],
      $not: { _id: newLobbyId }
    });
  } catch (e) {
    console.log("ERROR IN LOBBY PURGE FOR: " + username);
    console.log(e);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ SIGNUP, LOGIN, LOGOUT & AUTOLOGIN  ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//************ SIGNUP ************//
app.post("/signup", upload.none(), function(req, res) {
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
        isAdmin: false,
        currentLobby: "",
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
app.post("/login", upload.none(), function(req, res) {
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
app.get("/logout", upload.none(), function(req, res) {
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

app.get("/verify-cookie", function(req, res) {
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
app.post("/get-user-profile", upload.none(), function(req, res) {
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
app.post("/change-user-profile", upload.none(), function(req, res) {
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
          usersCollection.updateOne(
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

app.get("/get-user-score", function(req, res) {
  sessionsCollection
    .find({ sessionId: req.cookies.sid })
    .toArray((err, result) => {
      // if (result[0].wins === undefined) {
      //    res.send(JSON.stringify({ success: false, wins: 0, losses: 0 }))
      //    return
      // }
      usersCollection
        .find({ username: result[0].user })
        .toArray((err, result) => {
          console.log("Wins ", result[0].wins);
          res.send(
            JSON.stringify({ wins: result[0].wins, losses: result[0].losses })
          );
        });
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ NEWS AND NEWS POSTING ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/get-news", upload.none(), (req, res) => {
  newsCollection.find({}).toArray((err, result) => {
    if (err) {
      res.send(JSON.stringify({ success: false }));
      return;
    }

    console.log("Getting news -> results: ", result);

    res.send(JSON.stringify({ newsList: result, success: true }));
  });
});

app.post("/add-news", upload.none(), (req, res) => {
  let text = req.body.newsText;

  if (
    req.cookies.sid === undefined ||
    text === undefined ||
    text.trim() === ""
  ) {
    res.send({ success: false, err: "not logged in" });
  }

  sessionsCollection
    .find({ sessionId: req.cookies.sid })
    .toArray((err, result) => {
      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }

      usersCollection
        .find({ username: result[0].user })
        .toArray((err, result) => {
          if (err) {
            res.send(JSON.stringify({ success: false }));
            return;
          }

          if (!result[0].isAdmin) {
            res.send(JSON.stringify({ success: false }));
            return;
          }

          let iso = new Date().toISOString();
          let newPost = {
            date: iso,
            text
          };

          newsCollection.insertOne(newPost, (err, result) => {
            if (err) {
              res.send(JSON.stringify({ success: false }));
              return;
            }

            console.log("Created new News post.");
            res.send(JSON.stringify({ success: true }));
          });
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
            usersCollection.updateOne(
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
app.get("/get-leaderboard", upload.none(), function(req, res) {
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
app.post("/create-lobby", upload.none(), function(req, res) {
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
  lobbyPurge(req.body.currentUser, newLobbyId);
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
    console.log(`New LobbyId: ${newLobbyId}`);
    usersCollection
      .find({ username: req.body.currentUser })
      .toArray((err, result) => {
        usersCollection.updateOne(
          //bookmark
          { _id: result[0]._id },
          { $set: { currentLobby: newLobbyId } },
          (err, result) => {
            if (err) throw err;
            console.log(`DB: Setting users currentLobby to: ${newLobbyId}`);
            //res.send(JSON.stringify({ success: true }));
          }
        );
      });

    //We are now creating the lobby chat right after creating the lobby.
    const newLobbyChat = {
      _id: newLobbyId,
      messageList: [],
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
          req.body.currentUser
        } into lobby chat collection`
      );
      console.log(
        `The added chats ID, ${
          newLobbyChat._id
        }, is the same as the LobbyId, ${newLobbyId}.`
      );

      //The newLobby._id will also be used for the LobbyChat id
      res.send(JSON.stringify({ success: true, lobbyId: newLobby._id }));
    });
  });
});

//************ GET LOBBIES ************//
app.get("/get-lobbies", upload.none(), function(req, res) {
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
app.post("/join-lobby", upload.none(), function(req, res) {
  const { lobbyId, currentUser } = req.body;
  lobbyPurge(currentUser, lobbyId);
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

    lobbiesCollection.updateOne(
      { _id: lobbyId },
      { $set: { playerTwo: currentUser } },
      (err, result) => {
        if (err) throw err;
        console.log(`DB: Adding user to lobbyId: ${lobbyId}`);
        //res.send(JSON.stringify({ success: true }));

        usersCollection
          .find({ username: req.body.currentUser })
          .toArray((err, result) => {
            usersCollection.updateOne(
              //bookmark
              { _id: result[0]._id },
              { $set: { currentLobby: lobbyId } },
              (err, result) => {
                if (err) throw err;
                console.log(`DB: Setting users currentLobby to: ${lobbyId}`);
                res.send(JSON.stringify({ success: true }));
              }
            );
          });
      }
    );
  });
});

//************ USER READY ************//
app.post("/user-ready", upload.none(), function(req, res) {
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
        lobbiesCollection.updateOne(
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
app.post("/get-current-lobby", upload.none(), function(req, res) {
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

//____________FUNCTIONS FOR SOCKET STUFF____________
//Refresh the lobby chat
let refreshLobbyChat = lobbyId => {
  if (chatsCollection == undefined) {
    return;
  }
  chatsCollection.find({ _id: lobbyId }).toArray((err, result) => {
    if (err) throw err;
    if (result[0] === undefined) {
      return;
    }
    console.log("REFRESHING LOBBYCHAT.");
    //result[0] is a chat object that has messageList
    io.in(lobbyId).emit("lobby-chat", result[0].messageList);
  });
};

//Reset the lobby chat
let resetLobbyChat = lobbyId => {
  console.log("Resetting lobby chat for chat id: ", lobbyId);
  chatsCollection.updateOne(
    { _id: lobbyId },
    { $set: { messageList: [] } },
    (err, result) => {
      if (err) throw err;
      console.log(`DB: Resetting message list for chat id: ${lobbyId}`);
    }
  );
  refreshLobbyChat(lobbyId);
};

let refreshLobby = lobbyId => {
  console.log("Socket: Refresh lobby listener called");

  lobbiesCollection.find({ _id: lobbyId }).toArray((err, result) => {
    if (err) throw err;
    if (result[0] === undefined) {
      return;
    }
    //Send back lobby object in socket
    io.in(lobbyId).emit("lobby-data", result[0]);
  });
};

let refreshLobbyList = () => {
  if (lobbiesCollection === undefined) {
    return;
  }
  console.log("REFRESHING LOBBY LIST");
  lobbiesCollection.find().toArray((err, result) => {
    let lobbyCount = 0;
    let fullLobbies = 0;

    result.forEach(lobby => {
      lobbyCount++;
      if (lobby.playerOne !== "" && lobby.playerTwo !== "") {
        fullLobbies++;
      }
    });

    let data = {
      lobbies: result,
      lobbyCount,
      fullLobbies
    };

    // console.log("Lobbies from socket: ", result)
    io.emit("lobby-list-data", data);
  });
};

//____________END|FUNCTIONS FOR SOCKET STUFF____________

io.on("connection", socket => {
  console.log("Connected to socket");

  socket.on("join", currentLobbyId => {
    //After receiving join event with lobbyId, set the room for the client
    console.log("Connecting client to socket room: ", currentLobbyId);
    socket.join(currentLobbyId);

    socket.on("disconnect", () => {
      let usercookie = cookie.parse(socket.request.headers.cookie);
      var currentLobbyId = "";
      sessionsCollection
        .find({ sessionId: usercookie.sid })
        .toArray((err, result) => {
          if (err) throw err;
          //result is an array, we must check it elements with [ ]
          if (result[0] === undefined || result.length === 0) {
            //MUST send back success: false is username is not defined
            return;
          }
          usersCollection
            .find({ username: result[0].user })
            .toArray((err, result) => {
              currentLobbyId = result[0].currentLobby;
              lobbiesCollection
                .find({ _id: currentLobbyId })
                .toArray((err, result) => {
                  if (err) throw err;
                  if (result[0] === undefined) {
                    return;
                  }

                  if (result[0].readyPlayerOne && result[0].readyPlayerTwo) {
                    return;
                  } else {
                    usersCollection.updateOne(
                      //bookmark
                      { _id: result[0]._id },
                      { $set: { currentLobby: "" } },
                      (err, result) => {
                        if (err) throw err;
                        console.log(`DB: Removed users currentLobby...`);
                        lobbiesCollection.deleteOne({ _id: currentLobbyId });
                        refreshLobbyList();
                        refreshLobby(currentLobbyId);
                      }
                    );
                  }
                  //Send back lobby object in socket
                  io.in(currentLobbyId).emit("lobby-data", result[0]);
                });
            });
        });

      //bookmark
      io.emit("lobby-disconnect");
    });
  });

  socket.on("refresh-lobby", currentLobbyId => {
    refreshLobby(currentLobbyId);
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
    refreshLobbyList();
  });

  socket.on("refresh-lobby-chat", lobbyId => {
    refreshLobbyChat(lobbyId);
  });

  socket.on("sent-message", data => {
    console.log("Sent message data", data);
    console.log(Object.values(data));
    let messageToBeAdded = data.message;

    chatsCollection.updateOne(
      { _id: data.lobbyId },
      { $push: { messageList: { ...messageToBeAdded } } },
      (err, result) => {
        if (err) throw err;
        console.log(`DB: Updating message list for chat id: ${data.lobbyId}`);
        refreshLobbyChat(data.lobbyId);
      }
    );
  });

  socket.on("leave-lobby", data => {
    if (
      data.lobbyId === undefined ||
      data.lobbyId === null ||
      data.lobbyId == ""
    ) {
      return;
    }

    lobbiesCollection.find({ _id: data.lobbyId }).toArray((err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        return;
      }
      //If playerOne is alone in lobby, remove it from db!
      if (
        result[0].playerOne === data.currentUser &&
        result[0].playerTwo === ""
      ) {
        lobbiesCollection.deleteOne({ _id: data.lobbyId });
      }

      //If playerTwo is alone in lobby, remove it as well!
      if (
        result[0].playerTwo === data.currentUser &&
        result[0].playerOne === ""
      ) {
        lobbiesCollection.deleteOne({ _id: data.lobbyId });
      }

      //If playerOne leaves and is not alone, update lobby and emit!
      if (
        result[0].playerOne === data.currentUser &&
        result[0].playerTwo !== ""
      ) {
        lobbiesCollection.updateOne(
          { _id: data.lobbyId },
          //PlayerTwo will become playerOne
          {
            $set: {
              playerOne: result[0].playerTwo,
              playerTwo: "",
              readyPlayerOne: result[0].readyPlayerTwo,
              readyPlayerTwo: false
            }
          },
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
        resetLobbyChat(data.lobbyId);
      }

      //If playerTwo leaves and is not alone, also update lobby and emit!
      if (
        result[0].playerTwo === data.currentUser &&
        result[0].playerOne !== ""
      ) {
        lobbiesCollection.updateOne(
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
        refreshLobby(data.lobbyId);
        resetLobbyChat(data.lobbyId);
      }
      // else {
      //   lobbiesCollection.deleteOne({ _id: data.lobbyId });
      //   refreshLobbyList();
      //   refreshLobby(data.lobbyId);
      // }
    });

    //messageList: [],
    io.emit("refresh-lobby-chat", data.lobbyId);
  });

  //_______________________GAME________________________________________________

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
      if (lobbiesCollection === undefined) {
        console.log("db not created");
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
        let isGameOver = gameEngine.checkGameOver(gameId);
        if (isGameOver.success === false) {
          console.log("game in session");
        }
        if (isGameOver.success === true) {
          let win = [0, 0];
          let loss = [0, 0];
          lobbiesCollection.deleteOne({ _id: gameId });
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
                    losses: newUserData.losses + loss[0],
                    currentLobby: ""
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
                    losses: newUserData.losses + loss[1],
                    currentLobby: ""
                  }
                },
                (err, result) => {
                  if (err) throw err;
                  console.log(`DB: editing user information: ${"username"}`);
                }
              );
            });
          //bookmark
          lobbiesCollection.deleteOne({ _id: gameId });
          refreshLobbyList();
          refreshLobby(gameId);
        }
        io.in(gameId).emit("game-state-change", changes);
      });
  });

  //_______________________END OF GAME________________________________________________
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
