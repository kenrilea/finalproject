const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

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
let gamesCollection;

//Connection to DB, do not close!
MongoClient.connect(url, { useNewUrlParser: true }, (err, allDbs) => {
  // Add option useNewUrlParser to get rid of console warning message
  if (err) throw err;
  finalProjectDB = allDbs.db("FinalProject-DB");
  usersCollection = finalProjectDB.collection("Users");
  sessionsCollection = finalProjectDB.collection("Sessions");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ GENERAL FUNCTIONS ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////
//Returns random number
const generateId = () => {
  return "" + Math.floor(Math.random() * 100000000000);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ LOGIN, LOGOUT & SIGNUP ************//
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
  console.log(req.body);
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

///////////////////////////////////////////////////////////////////////////////////////////////////////
//************ USER RELATED ************//
///////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/get-leaderboard", upload.none(), function(req, res) {
  console.log("Getting leaderboard..."); //check get all items
  let leaderboard = usersCollection.find().sort({ wins: -1, losses: 1 });
  console.log("Leaderboard:");
  leaderboard.toArray((err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(JSON.stringify(result));
  });
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
  app.listen(4000, "0.0.0.0", () => {
    console.log("Running on port 4000 , 0.0.0.0");
  });
};
setup();
