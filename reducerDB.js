const fs = require("fs");
let urlUsers = "./DB/users.json";
let urlLogs = "./DB/logs.json";
let urlExercises = "./DB/exercises.json";

class DB {
  constructor(users, logs, exercises) {
    this.users = users;
    this.logs = logs;
    this.exercises = exercises;
    this.backUpUsersList = JSON.stringify([
      { username: "Dru", _id: "oGzinL13epdIauh7" },
      { username: "Bill", _id: "nyIefOxDuzDTAKD0" },
      { username: "Chloe", _id: "WK9I9qHctKBprJy6" },
    ]);
  }
  getUsers(url = this.users) {
    try {
      let usersList = JSON.parse(fs.readFileSync(url, "utf-8"));
      return usersList;
    } catch (err) {
      console.log(`Failed get users on path ${url}: `, err);
    }
  }
  getLogs(url = this.logs) {
    let logsList = JSON.parse(fs.readFileSync(url, "utf-8"));
    return logsList;
  }
  getExercises(url = this.exercises) {
    let exercisesList = JSON.parse(fs.readFileSync(url, "utf-8"));
    return exercisesList;
  }
  addUser(user, url = this.users) {
    try {
      const usersArray = this.getUsers();
      usersArray.push(user);
      let usersList = JSON.stringify(usersArray);
      fs.writeFileSync(url, usersList);
      return;
    } catch (err) {
      console.log(err);
    }
  }

  // ===============================
  // *Service:
  restoreUsers(url = urlUsers) {
    let backUp = this.backUpUsersList;
    fs.writeFileSync(url, backUp);
    console.log("Users List successfully restored");
    return;
  }
  clearDbArea(url) {
    fs.writeFileSync(url, "{}");
    console.log(`File with path ${url} cleared successfully`);
  }
}

const DB_Helper = new DB(urlUsers, urlLogs, urlExercises);
// ================================================================
// DB_Helper.addUser({ username: "Mark", _id: 4 });
// DB_Helper.addUser({ username: "Mary", _id: 5 });
// ================================================================
// DB_Helper.clearDbArea(urlUsers);
// DB_Helper.restoreUsers();
//console.log(DB_Helper.getUsers());

// ============================
module.exports = DB_Helper;
// ============================