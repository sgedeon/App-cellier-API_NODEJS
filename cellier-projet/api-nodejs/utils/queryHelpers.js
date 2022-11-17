const getConnection = require("./db");

// const getAllBouteilles = async (id) => {
//   const connection = await getConnection();
//   return connection.execute(`SELECT * FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id where vino__bouteille_has_vino__cellier.vino__cellier_id = `+ id +` ORDER BY vino__bouteille.id ASC`);
// };

async function getAllBouteilles (id) {
  const connection = await getConnection();
  return connection.execute(`SELECT * FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id where vino__bouteille_has_vino__cellier.vino__cellier_id = `+ id +` ORDER BY vino__bouteille.id ASC`);
};

// const createUser = async (body) => {
//   const connection = await getConnection();
//   connection.execute(`INSERT INTO vino__utilisateur (vino__utilisateur.email, vino__utilisateur.nom) VALUES ("`+ body.email +`" ,"`+ body.nom +`")`);
//   return connection.execute(`INSERT INTO vino__cellier (vino__cellier.nom, vino__utilisateur_id) VALUES ("Coucou", "`+ result.insertId +`")`);
// };

async function createUser (body) {
  const connection = await getConnection();
  const addUser = await connection.execute(`INSERT INTO vino__utilisateur (vino__utilisateur.email, vino__utilisateur.nom) VALUES ("`+ body.email +`" ,"`+ body.nom +`")`);
  return connection.execute(`INSERT INTO vino__cellier (vino__cellier.nom, vino__utilisateur_id) VALUES ("Coucou", `+ addUser[0].insertId +`)`);
};

module.exports = {
  getAllBouteilles,
  createUser,
};
