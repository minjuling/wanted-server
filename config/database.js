const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: DB 계정
const pool = mysql.createPool({
    host: '',
    user: '',
    port: '',
    password: '',
    database: 'wanted'
});

module.exports = {
    pool: pool
};