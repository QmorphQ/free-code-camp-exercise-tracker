const fs = require("fs");
let urlDB = "./DB/DB.json";

class DB {
  constructor(url) {
    this.DB_URL = url;
    this.backUpList = JSON.stringify([
      {
        username: "fcc_test",
        count: 1,
        _id: "5fb5853f734231456ccb3b05",
        log: [
          {
            description: "test",
            duration: 60,
            date: "Mon Jan 01 1990",
          },
        ],
      },
    ]);
  }
  getUsers(url = this.DB_URL) {
    try {
      let usersList = this.getDB_Data().map((item) => ({
        username: item.username,
        _id: item._id,
      }));
      return usersList;
    } catch (err) {
      console.log(`Failed get users on path ${url}: `, err);
    }
  }
  getLogs(url = this.DB_URL) {
    let logsList = JSON.parse(fs.readFileSync(url, "utf-8"));
    return logsList;
  }
  getExercises(url = this.DB_URL) {
    let exercisesList = JSON.parse(fs.readFileSync(url, "utf-8"));
    return exercisesList;
  }
  addUser(user, url = this.DB_URL) {
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
  getDB_Data(url = this.DB_URL) {
    try {
      let DB_list = JSON.parse(fs.readFileSync(url, "utf-8"));
      return DB_list;
    } catch (err) {
      console.log(`Failed get data on path ${url}: `, err);
    }
  }
  restoreDB(url = this.DB_URL) {
    let backUp = this.backUpList;
    fs.writeFileSync(url, backUp);
    console.log("Users List successfully restored");
    return;
  }
  clearDB(url = this.DB_URL) {
    fs.writeFileSync(url, "{}");
    console.log(`File with path ${url} cleared successfully`);
  }
}

const DB_Helper = new DB(urlDB);
// ================================================================
// DB_Helper.addUser({ username: "Mark", _id: 4 });
// DB_Helper.addUser({ username: "Mary", _id: 5 });
// ================================================================
// DB_Helper.clearDB();
// DB_Helper.restoreDB();
// console.log(DB_Helper.getUsers());

// ============================
module.exports = DB_Helper;
// ============================
