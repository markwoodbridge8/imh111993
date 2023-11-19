const mysql = require('mysql')

const db = mysql.createConnection({
host: "localhost",
user: "u222749845_doghair",
password: "DogHair1020$",
database:"u222749845_Inu_Moo" 
})

module.exports = db;