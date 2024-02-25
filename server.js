const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { expressjwt: exjwt } = require("express-jwt");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

const secretKey = "My Secret Key";

const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "sujith",
    password: "143",
  },
  {
    id: 2,
    username: "sweety",
    password: "1432",
  },
];

// app.post("/api/login", (req, res) => {
//   const { username, password } = req.body;

//   for (let user of users) {
//     if (username == user.username && password == user.password) {
//       let token = jwt.sign(
//         { id: user.id, username: user.username },
//         secretKey,
//         { expiresIn: "3m" } //the JWT expire to 3 minutes
//       );
//       res.json({
//         success: true,
//         err: null,
//         token,
//       });
//       break;
//     } else {
//       res.status(401).json({
//         success: false,
//         token: null,
//         err: "username or password incorrect",
//       });
//     }
//   }
// });

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  let found = false;

  for (let user of users) {
    if (username === user.username && password === user.password) {
      found = true;
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "3m" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      return;
    }
  }

  res.status(401).json({
    success: false,
    token: null,
    err: "Username or password incorrect",
  });
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can see.",
  });
});

app.get("/api/prices", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "this is of price $5.4",
  });
});

//settings route is added and protected
app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "this is settings",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({
      success: false,
      err,
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
