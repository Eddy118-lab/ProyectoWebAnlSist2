import { Sequelize } from "sequelize";
const db = new Sequelize('transporte', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;