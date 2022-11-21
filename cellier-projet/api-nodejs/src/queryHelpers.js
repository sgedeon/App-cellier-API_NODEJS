const getConnection = require("./db");

/**
 * Gestion de la récupération de la liste de bouteilles d'un cellier donné
 * @date 2022-11-11
 * @param {int} id
 * @returns {Array}
 */
async function getAllBouteilles (id) {
  const connection = await getConnection();
  return connection.execute(`SELECT * FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id where vino__bouteille_has_vino__cellier.vino__cellier_id = `+ id +` ORDER BY vino__bouteille.id ASC`);
};

/**
 * Gestion de la création d'un utilisateur et d'un cellier lié
 * @date 2022-11-11
 * @param {object} body
 * @returns {array}
 */
async function createUser (body) {
  const connection = await getConnection();
  const addUser = await connection.execute(`INSERT INTO vino__utilisateur (vino__utilisateur.email, vino__utilisateur.nom) VALUES ("`+ body.email +`" ,"`+ body.nom +`")`);
  return connection.execute(`INSERT INTO vino__cellier (vino__cellier.nom, vino__utilisateur_id) VALUES ("Coucou", `+ addUser[0].insertId +`)`);
};

/**
 * Suppression d'un utilisateur 
 * @date 2022-11-21
 * @param {string} emailUtilisateur
 * @returns {Array}
 */
async function deleteUser (emailUtilisateur) {
  const connection = await getConnection();
  return connection.execute(`DELETE FROM vino__utilisateur WHERE vino__utilisateur.email="`+ emailUtilisateur +`"`);
};

/**
 * Récupération d'un utilisateur donné
 * @date 2022-11-11
 * @param {string} emailUtilisateur
 * @returns {array}
 */
 async function findUtilisateur (emailUtilisateur) {
  const connection = await getConnection();
  return connection.execute(`SELECT DISTINCT vino__utilisateur.id, vino__utilisateur.email, vino__utilisateur.privilege, vino__utilisateur.nom FROM vino__utilisateur JOIN vino__cellier ON vino__utilisateur.id=vino__cellier.vino__utilisateur_id WHERE vino__utilisateur.email="`+ emailUtilisateur +`"`);
 };

/**
 * Récupération de l'ensemble des utilisateurs
 * @date 2022-11-11
 * @param {string} emailUtilisateur
 * @returns {array}
 */
 async function findUtilisateurs (emailUtilisateur) {
  const connection = await getConnection();
  return connection.execute("SELECT vino__utilisateur.id, vino__utilisateur.email, vino__utilisateur.nom FROM vino__utilisateur");
};

module.exports = {
  getAllBouteilles,
  createUser,
  deleteUser,
  findUtilisateur,
  findUtilisateurs,
};
