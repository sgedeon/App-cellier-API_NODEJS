const mysql = require("mysql2/promise");
async function getConnection() {
  // creer une connexion
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