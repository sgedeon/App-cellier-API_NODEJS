const mysql = require("mysql2/promise");

/**
 * Gestion la connexion à la base de données
 * @date 2022-11-11
 * @returns {*}
 */
async function getConnection() {
  const connection = await mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "root",
      port: '8889',
      database: "pw2",
  });
  return connection;
}
module.exports = getConnection;