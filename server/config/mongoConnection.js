const MongoClient = require("mongodb").MongoClient;
const settings = {
  mongoConfig: {
    serverUrl:
      "mongodb+srv://CW-1:test@cluster0.nvwgh.mongodb.net/code-warriors?retryWrites=true&w=majority",
    database: "code-warriors",
  },
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
