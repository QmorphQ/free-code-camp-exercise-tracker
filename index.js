const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const createId = require("create-id");
const DB_Helper = require("./reducerDB");
// ==========================================================================================
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
// *==========================================================================================
// *Solution:
// *Post to /api/users with the returned response {username: someUser, _id: someNum }:
app.post("/api/users", (req, res) => {
  let { username } = req.body;
  // ?========================
  let _id = createId(null, null, 16);
  // ?========================
  let user = { username, _id };
  DB_Helper.addUser(user)
  res.json(user);
});
// *GET to /api/users to get a list of all users:
app.get("/api/users", (req, res) => {
  let users = DB_Helper.getUsers();
  res.json(users);
})
// *==========================================================================================
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
