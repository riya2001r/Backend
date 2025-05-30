const config = require('../config');     
console.log('Connecting to DB with:', config.db);  

const mysql = require('mysql2');

let instance = null;

class MySQLDatabase {
    constructor() {
        if (!instance) {
            this.pool = mysql.createPool({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: config.db.name,
                port: config.db.port
            });
            instance = this;
        }
        return instance;
    }

    getPool() {
        return this.pool.promise();
    }
}

const mysqlDb = new MySQLDatabase();
module.exports = mysqlDb.getPool();
