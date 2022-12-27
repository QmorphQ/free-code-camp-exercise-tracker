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
  function getUniqID() {
    let idsArray = DB_Helper.getListByKey("_id");
    let _id = createId(null, null, 16);
    if (idsArray.includes(_id)) {
      getUniqID();
    }
    return _id;
  }
  // ?========================
  let _id = getUniqID();
  let user = { username, count: 0, _id, log: [] };
  DB_Helper.addUser(user);
  res.json({ username, _id });
});
// *--------------------------------------------------------
// *GET to /api/users to get a list of all users:
app.get("/api/users", (req, res) => {
  let users = DB_Helper.getUsers();
  res.json(users);
});
// *--------------------------------------------------------
// *POST to /api/users/:_id/exercises with form data {description, duration, [, date]}:
app.post("/api/users/:_id/exercises", (req, res) => {
  let userId = req.params._id;
  let users = DB_Helper.getDB_Data();
  let userExist = users.find((item) => item._id === userId);
  if (!userExist) {
    console.log(`User with ID ${userId} doesn't exist`);
    res.json("Please, sign in and use your unique ID");
  }
  let user = DB_Helper.getItemById(userId);
  let params = req.body;
  let date = req.body.date
    ? new Date(req.body.date).toDateString()
    : new Date().toDateString();
  let resObj = {
    username: user.username,
    description: params.description,
    duration: +params.duration,
    date,
    _id: user._id,
  };
  let DB_object = {
    description: params.description,
    duration: +params.duration,
    date,
  };
  // !--------------------------------
  // *Update user:
  user.log.push(DB_object);
  user.count = user.log.length;
  DB_Helper.updateItem(user);
  // !--------------------------------
  res.send(resObj);
});
// *--------------------------------------------------------
// *GET request to /api/users/:_id/logs retrieve a full exercise log of any user:
app.get("/api/users/:_id/logs", (req, res) => {
  let itemId = req.params._id;
  let item = DB_Helper.getItemById(itemId);
  let query = req.query;
  console.log("Query: ", query);
  // !------------------------------
  let from = new Date(query.from);
  let to = new Date(query.to);
  let limit = query.limit;
  if (from.toString() !== "Invalid Date") {
    item.log = item.log.filter((el, i) => {
      let date = new Date(el.date);
      let res = date > from && date < to;
      return res;
    });
  }
  if (limit) {
    item.log.length = limit;
  }
  // !------------------------------
  console.log(item);
  res.json(item);
});
// *--------------------------------------------------------
// *--------------------------------------------------------
// *==========================================================================================
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
