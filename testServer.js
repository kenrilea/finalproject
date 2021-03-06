const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
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
app.use("/assets", express.static(__dirname + "/assets"));

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ STORAGE ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//Connection to DB, do not close!

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ GENERAL FUNCTIONS ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////
//Returns random number
const generateId = () => {
  return "" + Math.floor(Math.random() * 100000000000);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ LOGIN & SIGNUP ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//************ SIGNUP ************//

//************ LOGIN ************//

//***********************************SOCKET.IO******************************************************/
///____________GAME TESTING CODE________________////
let army = ["pawn"];
gameEngine.createTestGameInst("user1", "user2", army, army);
/*
gameEngine.getGameInst("test").map.forEach(char => {
  if (char.actorType !== "char") {
    return;
  }
  console.log(char.pos);
});
gameEngine.handlerUserInput({
  gameId: "test",
  action: {
    type: "move",
    actorId: "10",
    dest: { x: 0, y: 2 }
  },
  team: "user1"
});

console.log("______________________");
gameEngine.getGameInst("test").map.forEach(char => {
  if (char.actorType !== "char") {
    return;
  }
  console.log(char.pos);
});
console.log(
  gameEngine.handlerUserInput({
    gameId: "test",
    action: { type: "leave" },
    team: "user1"
  })
);
console.log(gameEngine.getGameInst("test")["points"]);

console.log("TRYING TO MOVE AFTER GAME OVER");
console.log(
  gameEngine.handlerUserInput({
    gameId: "test",
    action: {
      type: "move",
      actorId: "10",
      dest: { x: 0, y: 2 }
    },
    team: "user1"
  })
);*/
///____________END OF GAME TESTING CODE________________////
io.on("connection", socket => {
  //_______________________GAME________________________________________________
  socket.on("get-game-data", message => {
    socket.emit("game-data", gameEngine.getGameInst("test"));
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

  console.log(socket.request.headers.cookie);
  socket.on("init-lobby", message => {
    console.log("message");
    console.log(socket.request.headers.cookie);
  });
});
//http.listen(4000);
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
  /*app.listen(4000, "0.0.0.0", () => {
     console.log("Running on port 4000 , 0.0.0.0");
   });*/
};
setup();
