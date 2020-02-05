const createConnection = require('mysql').createConnection;
const models = require('./db');
const promisify = require('util').promisify
const commentModel = require('../model/db-comment')
const userModel = require('../model/db-user')
class Database {
    static instance;
    query;
    db;

    constructor(user, password, database, host) {
        Database.instance = this;

        this.db = createConnection(models.mysql);
        this.db.connect(function (err) {
            if (err) {
                console.log(`mysql连接失败: ${err}!`);
            } else {
                console.log("mysql连接成功!");
            }
        });


        this.query = promisify(this.db.query).bind(this.db)
    }

}

const noMethodProto = Database.prototype
Database.prototype = Object.assign(
    noMethodProto,
    commentModel,
    userModel
)

const $db = new Database()
module.exports = $db