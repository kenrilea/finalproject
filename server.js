const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

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
                console.log(
                  "DB: Successfully added entry to Sessions collection"
                );
                res.cookie("sid", newSessionId);
                res.send(
                  JSON.stringify({ success: true, username: req.body.username })
                );
              }
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
  const newLobby = {
    _id: generateId(),
    playerOne: req.body.currentUser,
    playerTwo: "",
    readyPlayerOne: false,
    readyPlayerTwo: false,
    creationTime: new Date().toLocaleString()
  };

  //Insert lobby into the database
  lobbiesCollection.insertOne(newLobby, (err, result) => {
    //Add new user to remote database
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
    //use this result to get the _Id from the lobby object
    // console.log(result);
    res.send(JSON.stringify({ success: true, lobbyId: newLobby._id }));
    //res.send(JSON.stringify(result));
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

    // let ready;
    switch (currentUser) {
      case result[0].playerOne:
        console.log(`User "${currentUser}" is registered as playerOne`);
        // ready = !result[0].readyPlayerOne;
        lobbiesCollection.update(
          { _id: lobbyId },
          { $set: { readyPlayerOne: true } },
          (err, result) => {
            if (err) throw err;
            // console.log(`DB: Updating playerOne ready to ${ready}`);
            res.send(JSON.stringify({ success: true, user: 1 }));
          }
        );
        break;

      case result[0].playerTwo:
        console.log(`User "` + currentUser + `" is registered as playerTwo`);
        // ready = !result[0].readyPlayerTwo;
        lobbiesCollection.updateOne(
          { _id: lobbyId },
          { $set: { readyPlayerTwo: true } },
          (err, result) => {
            if (err) throw err;
            // console.log(`DB: Updating playerTwo ready to ${ready}`);
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
let army = ["pawn"];
let gameId = gameEngine.createTestGameInst("user1", "user2", army, army);
//____________END OF GAME TEST CODE___________________

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ SOCKET IO STUFF ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

io.on("connection", socket => {
  console.log("Connected to socket");

  socket.on("playerOneReady", () => {
    console.log("Socket: Player one is ready!");
    socket.emit("setStatePlayerOneReady");
  });

  socket.on("playerTwoReady", () => {
    console.log("Socket: Player two is ready!");
    socket.emit("setStatePlayerTwoReady");
  });

  socket.on("login", () => {
    console.log("Socket: Logging in");
  });

  socket.on("lobby-update", () => {
    //Refreshes lobby page for both users
    io.emit("refresh-lobby");
  });

  socket.on("refresh-lobby", currentLobbyId => {
    console.log("Socket: Refresh lobby listener called");
    lobbiesCollection.find({ _id: currentLobbyId }).toArray((err, result) => {
      if (err) throw err;
      if (result[0] === undefined) {
        return;
      }
      //Send back lobby object in socket
      io.emit("lobby-data", result[0]);
    });
  });

  //_______________________GAME________________________________________________

  socket.on("get-game-data", message => {
    //-- add gameIdFromUsernameCollection("username") to get gameId when its implemented
    let gameData = gameEngine.getGameInst(gameId); //temporary gameId for testing, use collection later...
    socket.emit("game-data", gameData);
  });

  socket.on("game-input", input => {
    console.log("here");
    let result = gameEngine.handlerUserInput({
      gameId: "test",
      action: input,
      team: "user1"
    });
    socket.emit("game-state-change", {
      success: result.success,
      changes: result.changes
    });
  });

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

//_______________________END OF GAME________________________________________________

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
