const { Sequelize } = require('sequelize');
//Extraer valores de varialbels .env
require('dotenv').config({ path: 'variables.env' });


// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'mysql',
    define: {
        timestamps: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
});

module.exports = db;