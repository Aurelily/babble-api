const { MongoClient, Db } = require("mongodb");

var client = null;

function dbConnect(url, callback) {
  if (client == null) {
    client = new MongoClient(url);

    client.connect((error) => {
      if (error) {
        client = null;
        callback(error);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function db() {
  return new Db(client, "babble");
}

function closeConnect() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = { dbConnect, db, closeConnect };
