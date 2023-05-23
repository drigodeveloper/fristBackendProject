const sqliteConecition = require("../../sqlite")
const createUsers = require("./createUsers")

async function migrationsRun() {
    const schemas = [
        createUsers
    ].join('')

    sqliteConecition()
    .then(db => db.exec(schemas))
    .catch(error => console.error("error"));
}

module.exports = migrationsRun;