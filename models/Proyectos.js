const Sequelize = require('sequelize');
const db = require('../config/db');
const shortid = require('shortid');

const slug = require('slug');

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING
    },
    url: Sequelize.STRING
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLocaleLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;