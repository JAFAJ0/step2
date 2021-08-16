const Sequelize = require("sequelize");
const db = new Sequelize(process.env.DATABASE_URL || process.env.connectionString, {
  logging: false
});

module.exports = db;
