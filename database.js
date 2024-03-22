const mysql = require('mysql');

const db = mysql.createConnection({
    host: "database-14.mysql.database.azure.com",
    user: "kaua",
    password: "Augusto777#",
    database: "users",
    port: 3306,
    ssl: {
        mode: 'require'
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Conexão com o Banco de Dados bem Sucedida');
});

module.exports = { db };