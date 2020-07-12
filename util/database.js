const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://vinit:vinit0826@cluster0.j4he4.mongodb.net/shop?retryWrites=true&w=majority";
// mongoShellUri = mongo "mongodb+srv://cluster0.j4he4.mongodb.net/<dbname>" --username vinit
const uri = 'mongodb://localhost:27017/shop'
let _db;
const mongoConnect = callback => {
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
