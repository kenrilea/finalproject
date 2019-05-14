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
<<<<<<< HEAD
const url =
   "mongodb+srv://admin:admin@samurai-murit.mongodb.net/test?retryWrites=true"; // URI for remote database!

=======
>>>>>>> 7e64b491d6a786d9fcc483173aaed618efed6496
app.use("/assets", express.static(__dirname + "/assets"));

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ STORAGE ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

//Connection to DB, do not close!
<<<<<<< HEAD
MongoClient.connect(url, { useNewUrlParser: true }, (err, allDbs) => {
   // Add option useNewUrlParser to get rid of console warning message
   if (err) throw err;
   finalProjectDB = allDbs.db("FinalProject-DB");
   usersCollection = finalProjectDB.collection("Users");
   sessionsCollection = finalProjectDB.collection("Sessions");
});
=======
>>>>>>> 7e64b491d6a786d9fcc483173aaed618efed6496

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

gameEngine.createTestGameInst(
   "user1",
   "user2",
   gameData.defaultArmyB,
   gameData.defaultArmyA
);
io.on("connection", socket => {
   console.log("connected");
   socket.on("get-game-data", message => {
      socket.emit("game-data", gameEngine.getGameInst("test"));
   });
   socket.on("game-input", input => {
      console.log("here");
      let changes = gameEngine.handlerUserInput({
         gameId: "test",
         action: input,
         team: "user1"
      });
      socket.emit("game-state-change", {
         success: true,
         changes: changes,
         team: "user1"
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
